//用户管理
import BaseMgr from "../Libs/BaseMgr";

 
export default class UserMgr extends BaseMgr{
    myinfo:any = null
    users:{} = null
    routes:{} = null 
    //====== 
    uid:any = null 
    constructor (){
        super(); 
        this.myinfo=null;
        this.users={};
        this.routes={
            'http.reqMyInfo':this.http_reqMyInfo, 
            'http.reqGetCoin':this.http_reqGetCoin, 
            'http.reqUsers':this.http_reqUsers, 
            'onUserInfoChanged':this.onUserInfoChanged,
            'http.reqRegister':this.http_reqRegister,
            'http.reqLogin':this.http_reqLogin
        }
    }
    
    http_reqRegister(msg)
    {
        this.uid=msg.uid;
    }
    http_reqLogin(msg)
    {
        this.uid=msg.uid;
    }
    onUserInfoChanged(msg) 
    {
        this.reqMyInfo();
    }
    http_reqMyInfo(msg)
    {
        this.myinfo=msg;
    }
    http_reqGetCoin(msg)
    {
        //刷新我的信息
        this.myinfo=msg;
    }

    reqGetCoin()
    {
        this.send_msg('http.reqGetCoin');
    }
    //获取我的信息
    reqMyInfo() 
    {
        this.send_msg('http.reqMyInfo');
    }
    //获取用户信息
    reqUsers(uids)
    {
        // body
        let msg={
            'uids':uids,
        }
        this.send_msg('http.reqUsers',msg);
    }
    http_reqUsers(msg)
    {
        // body    
        let value; 
        for(let i = 0; i < msg.users.length; i ++){
            value = msg.users[i];
            this.users[value.id]=value; 
        }
    }
    getUserById(uid)
    {
        // body  
        return this.users[uid]
    }
    getHeadPng(headid)
    {
        // body
        return `res/cocosstudio/pics/head/${headid}.png`
    } 
 
    //单例处理
    private static _instance:UserMgr;
    public static getInstance ():UserMgr{
        if(!this._instance){
            this._instance = new UserMgr();
        }
        return this._instance;
    }
}