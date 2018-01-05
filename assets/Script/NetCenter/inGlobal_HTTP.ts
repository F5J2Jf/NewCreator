import TopMgr from "../GameManager/inGlobal_TopMgr";

//HTTP 管理
const {ccclass, property} = cc._decorator;
const G_TOP = TopMgr.getInstance();

@ccclass
export default class HTTPEX{
    _tagStr1 : string
    _tagStr2 : string
    _baseIP : string

    _dict_cacheHttp : {}
    _isRequesting : Boolean                //正在请求中
    _hallUrl : string

    init (){
        this._config();
    }

    _config (){
        this._tagStr1 = "?";
        this._tagStr2 = "&";
        this._dict_cacheHttp = {};
        this._setBaseUrl();
    }

    _setBaseUrl (url?:string){
        // if(!url) url = "192.168.88.106:9000";
        if(!url) url = "127.0.0.1:3001";
        // if(!url) url = "59.110.214.48:9000";
        this._baseIP = "http://" + url;
    }

    setHallUrl (url){
        if(this._hallUrl){
            url = this._hallUrl;
        }else{
            this._hallUrl = url;
        }
        this._setBaseUrl(url);
    }

    send (httpInfo){
        if(!httpInfo) return;
        let urlInterfac = httpInfo.urlInterfac,
            sendObj = httpInfo.sendObj,
            callFunc = httpInfo.callFunc,
            resetBaseIP = httpInfo.resetBaseIP;
        if(this._dict_cacheHttp[urlInterfac]) return;
        //data str
        let dataStr = "";
        if(sendObj){
            dataStr = this._tagStr1;
            let curStr;
            for(let key in sendObj){
                if(curStr) dataStr += this._tagStr2;
                curStr = key+'='+sendObj[key];
                dataStr += curStr;
            }
        }
        //url
        let url = resetBaseIP ? resetBaseIP : this._baseIP;
        url += urlInterfac;
        url += dataStr;
        cc.log('http send= ',url)
        this._dict_cacheHttp[urlInterfac] = httpInfo;
        if(this._isRequesting) return;
        this._send(url, callFunc, urlInterfac);
    }

    _send (url, callFunc, urlInterfac){
        //var xhr = new XMLHttpRequest();
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 60000;
        xhr.open('POST', url, true);
        if (cc.sys.isNative){
            // xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
            xhr.setRequestHeader("Accept-Encoding","text/html;charset=UTF-8");
        }
        xhr.onreadystatechange = ()=> {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                this._requestEnd(urlInterfac);
                try {
                    cc.log(xhr.responseText);
                    var ret = JSON.parse(xhr.responseText);
                    if(callFunc){
                        callFunc(ret);
                        callFunc = null;
                    }                        /* code */
                } catch (e) {
                    cc.error("err:", e);
                }
                finally{
                    //===
                }
            }
        };
        xhr.onerror = (error)=> {
            this._requestEnd(urlInterfac);
            cc.error('http request error == ',error)
        }
        //
        xhr.ontimeout = ()=> {
            this._requestEnd(urlInterfac);
            cc.error('http request error == timeout')
        }
        G_TOP.showNetRequest();
        this._isRequesting = true;
        //xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        xhr.send();
    }
    _requestEnd (urlInterfac){
        this._isRequesting = false;
        G_TOP.hideNetRequest();
        delete this._dict_cacheHttp[urlInterfac];
        let nextUrlList = Object.keys(this._dict_cacheHttp);
        if(nextUrlList.length > 0){
            //还有未请求的接口
            let httpInfo = this._dict_cacheHttp[nextUrlList[0]];
            delete this._dict_cacheHttp[nextUrlList[0]];
            this.send(httpInfo);
        }
    }
    
    //单例处理
    private static _instance : HTTPEX;
    public static getInstance (){
        if(!this._instance){
            this._instance = new HTTPEX();
            this._instance.init();
        }
        return this._instance;
    }

    // update (dt) {},
}