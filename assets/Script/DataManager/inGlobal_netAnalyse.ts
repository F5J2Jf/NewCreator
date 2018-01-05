//网络请求的全局缓存(跨场景的数据)

const {ccclass, property} = cc._decorator;

@ccclass
export default class NET_CACHE{
    init (){

    }
    
    //单例处理
    private static _instance : NET_CACHE;
    public static getInstance (){
        if(!this._instance){
            this._instance = new NET_CACHE();
            this._instance.init();
        }
        return this._instance;
    }

    // update (dt) {},
}