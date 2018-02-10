//聊天管理
//TODO 管理房间聊天
import BaseMgr from "../Libs/BaseMgr";

 
export default class CharMgr extends BaseMgr{
    routes:{} = null 
    //====== 
    uid:any = null 
    constructor (){
        super(); 
        this.routes={
            
        }
    }
    sendText(msg){
        this.gemit('http.sendText',msg);
    }

    //单例处理
    private static _instance:CharMgr;
    public static getInstance ():CharMgr{
        if(!this._instance){
            this._instance = new CharMgr();
        }
        return this._instance;
    }
}