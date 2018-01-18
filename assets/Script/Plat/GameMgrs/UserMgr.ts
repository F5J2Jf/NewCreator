//用户管理
import BaseMgr from "../Libs/BaseMgr";

 
export default class UserMgr extends BaseMgr{
    myinfo:any = {}
    users:{} = null
    routes:{} = null 
    //====== 
    uid:any = null 
    constructor (){
        super(); 
        this.myinfo={};
        this.users={};
        this.routes={
            'http.reqMyInfo':this.http_reqMyInfo, 
            'http.reqGetRelief':this.http_reqGetRelief, 
            'http.reqUsers':this.http_reqUsers, 
            'onUserInfoChanged':this.onUserInfoChanged,
            'http.reqRegister':this.http_reqRegister,
            'http.reqLogin':this.http_reqLogin
        }
    }
    getMyInfo()
    {
        return this.myinfo;
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
    http_reqGetRelief(msg)
    {
        //刷新我的信息
        this.myinfo=msg;
    }

    reqGetRelief()
    {
        this.send_msg('http.reqGetRelief');
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
        
        console.log("我娃哦哦额哦按非uids=",uids) 
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
        return `http://192.168.1.190:3000/images/default_${headid}.png`
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