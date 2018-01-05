//头像图标的加载，通知缓存一定数量的图片

const {ccclass, property} = cc._decorator;

@ccclass
export default class URLImgMgr{
    _dict_urlRes : {}                            //路径资源，不包括头像
    _dict_headImg : {}                           //头像资源
    _list_headImg : Array<string>
    _maxCache : number

    init (){
        this._maxCache = 30;
    }

    //加载单张图片资源
    getOneImg (url, callFunc) {
        if(!this._dict_headImg) {
            this._dict_headImg = {};
            this._list_headImg = [];
        }
        if(this._dict_headImg[url]) {
            if(callFunc) callFunc(this._dict_headImg[url][0]);
            var index = this._list_headImg.indexOf(url);
            if(index > -1){
                this._list_headImg.splice(index,1);
                this._list_headImg.splice(0,0,url);
            }
        } else{
            cc.loader.load(url, function (err, texture) {
                var frame;
                if(err){
                    console.log('request headImg error== '+err)
                }else{
                    if(texture){
                        frame=new cc.SpriteFrame(texture);
                        if(frame){
                            this._dict_headImg[url] = [frame, texture];
                            this._list_headImg.splice(0,0,url);
                            if(this._list_headImg.length > this._maxCache){
                                var lastUrl = this._list_headImg.pop();
                                this.removeOneHeadImg(lastUrl);
                            }
                        }
                    }
                }
                if(callFunc) callFunc(frame);
            }.bind(this));
        }
    }

    //释放单个资源
    removeOneHeadImg (url) {
        if(this._dict_headImg[url]) {
            cc.loader.releaseAsset(this._dict_headImg[url][0]);
            cc.loader.releaseAsset(this._dict_headImg[url][1]);
            delete this._dict_headImg[url];
        }
    }

    //释放所有资源
    removeAllImages () {
        for(var url in this._dict_headImg){
            cc.loader.releaseAsset(this._dict_headImg[url][0]);
            cc.loader.releaseAsset(this._dict_headImg[url][1]);
        }
    }
    
    //单例处理
    private static _instance : URLImgMgr;
    public static getInstance (){
        if(!this._instance){
            this._instance = new URLImgMgr();
            this._instance.init();
        }
        return this._instance;
    }

    // update (dt) {},
}