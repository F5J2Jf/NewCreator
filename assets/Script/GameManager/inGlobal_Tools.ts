//工具单例

const {ccclass, property} = cc._decorator;

@ccclass
export default class Tools{
    init (){

    }

    isNumber (target){
        return Boolean(Object.prototype.toString.call(target) === "[object Number]");
    }
    isArray (target){
        return Boolean(Object.prototype.toString.call(target) === "[object Array]");
    }
    isString (target){
        return Boolean(Object.prototype.toString.call(target) === "[object String]");
    }
    isFunction (target){
        return Boolean(Object.prototype.toString.call(target) === "[object Function]");
    }
    //返回数值包括最大最小值
    getRandomArea (downNum:number, upNum:number) {
        return parseInt(Math.random() * (upNum - downNum + 1) + downNum + '');
    }
    //返回随机的bool值是或否
    getRandomBool (){
        return Boolean(Math.random() > 0.5);
    }
    // //使用%s，%d重新配置字符串，如 this.formatStr('这是:%s',9099)  ==> 这是:9099
    formatStr(...args){
        var t=args,e=t.length;
        if(e<1)return"";
        var i=/(%d)|(%s)/,n=1,r=t[0],s="string"==typeof r&&i.test(r);
        if(s)for(var o=/%s/;n<e;++n){
            var a=t[n],c="number"==typeof a?i:o;
            c.test(r)?r=r.replace(c,a):r+=" "+a
        }else if(e>1)for(;n<e;++n)r+=" "+t[n]; else r=""+r;
        return r
    }
    //字节buffer转字符串
    ab2Str(buffer){
        var arr = new Uint8Array(buffer);
        var str = String.fromCharCode.apply(String, arr);
        if(/[\u0080-\uffff]/.test(str)){
            cc.log("this string seems to contain (still encoded) multibytes");
        }
        return str;
    }
    //名字规范  name为传入的名字， len为需要留住的字符长度(1个中文长度为2)， isNot多出的字符用...表示（true表示要）
    getNameLimit (name:string, len?:number, isNot?:Boolean) {
        var _num_maxNameLen = 10;
        var str,
            maxNameLength;
        len ? maxNameLength = len : maxNameLength = _num_maxNameLen;
        var reg = /^[\u4E00-\u9FA5]+$/;
        var wordsNum = 0;
        var newStr = '';
        for(var i =0; i < name.length; i ++){
            if(wordsNum >= maxNameLength){
                if (isNot) newStr = newStr;
                else newStr += '...'
                break;
            }
            str = name[i];
            newStr += str;
            if(reg.test(str)) {
                wordsNum += 2;
            } else {
                wordsNum += 1;
            }
        }
        return newStr
    }
    //改变数值的单位
    formatNumber (money) {
        var zeroCnt = 0, nega = "";//带多少个0，负数标志位
        if (money < 0) {
            money = -money;
            nega = "-";
        }
        var tmp:number = money;
        while ((tmp = tmp / 10) >= 1)zeroCnt++;
        if (zeroCnt <= 3)return nega + money;
        for (var i = 0, tmp = 1; i < zeroCnt - 3; i++) {
            money /= 10;
            tmp = tmp == 10000 ? 10 : tmp * 10;
        }
        return nega + (parseInt(money) / (10000 / tmp)) + (zeroCnt < 8 ? "万" : (zeroCnt < 12 ? "亿" : "兆"));
    }
    //更新头像的大小
    resetURLImg (urlNode, newFrame) {
        if(urlNode._firstSize === undefined) urlNode._firstSize = {width:urlNode.width,height:urlNode.height};
        urlNode.getComponent(cc.Sprite).spriteFrame = newFrame;
        urlNode.width = urlNode._firstSize.width;
        urlNode.height = urlNode._firstSize.height;
    }
    // setURLImage (targetNode, imageName, useUrl){
    //     if(!imageName) return;
    //     let headUrl;
    //     if(useUrl){
    //         headUrl = imageName;
    //     }else{
    //         headUrl = G_DATA().getRootURL(imageName) + ".png";
    //     }
    //     //this._headUrl = 'http://192.168.0.109:8080/classic/res/raw-assets/Texture/Common/head/head00.jpg';
    //     G_NET_IMG_CACHE().getOneImg(headUrl, function (frame) {
    //         if(frame){
    //             this.resetURLImg(targetNode, frame);
    //         }
    //     })
    // }
    //游戏中的一次性定时器,从这里使用方便管理
    timeout (callBack, time){
        if(!this['_dict_timeout']) this['_dict_timeout'] = {};
        var timeoutID = setTimeout(()=>{
                if(callBack){
                    callBack();
                    callBack = null;
                }
            }, time);
        this['_dict_timeout'][timeoutID] = true;
        return timeoutID
    }
    clearNodeTimeout (){
        if(this['_dict_timeout']){
            for(let timeoutid in this['_dict_timeout']){
                clearTimeout(parseInt(timeoutid));
            }
        }
        this['_dict_timeout'] = null;
    }
    //游戏中的循环定时器,从这里使用方便管理
    interval (callBack, time){
        if(!this['_dict_interval']) this['_dict_interval'] = {};
        var intervalID = setInterval(()=>{
                if(callBack){
                    callBack();
                }
            }, time);
        this['_dict_interval'][intervalID] = true;
        return intervalID
    }
    clearNodeInterval (){
        if(this['_dict_interval']){
            for(let intervalID in this['_dict_interval']){
                clearInterval(parseInt(intervalID));
            }
        }
        this['_dict_interval'] = null;
    }

    //============

    //获取card花色
    getCardColor(cardData) {
        return (cardData & 0xf0) >> 4
    }
    //获取card值
    getCardValue (cardData){
        return (cardData & 0x0f)
    }
    //十六进制名字
    getCardData (cardColor, cardValue){
        let str = cardColor < 1 ?  "0x0" : "0x";
        return str + ((cardColor << 4) + cardValue).toString(16);
    }

    //==========================
    
    //单例处理
    private static _instance : Tools;
    public static getInstance (){
        if(!this._instance){
            this._instance = new Tools();
            this._instance.init();
        }
        return this._instance;
    }

    // update (dt) {},
}
