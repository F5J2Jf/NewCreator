//用户管理
import BaseMgr from "./BaseMgr";

const {ccclass, property} = cc._decorator;

@ccclass
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
            'http.reqMyInfo':this.http_reqMyInfo.bind(this), 
            'http.reqGetCoin':this.http_reqGetCoin.bind(this), 
            'http.reqUsers':this.http_reqUsers.bind(this), 
            'onUserInfoChanged':this.onUserInfoChanged.bind(this),
            'http.reqRegister':this.http_reqRegister.bind(this),
            'http.reqLogin':this.http_reqLogin.bind(this)
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
        for(let key in msg.users){
            value = msg.users[key];
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
        return this._formatStr('res/cocosstudio/pics/head/%d.png',headid)
    }

    _formatStr(...args){
        var t=args,e=t.length;
        if(e<1)return"";
        var i=/(%d)|(%s)/,n=1,r=t[0],s="string"==typeof r&&i.test(r);
        if(s)for(var o=/%s/;n<e;++n){
            var a=t[n],c="number"==typeof a?i:o;
            c.test(r)?r=r.replace(c,a):r+=" "+a
        }else if(e>1)for(;n<e;++n)r+=" "+t[n]; else r=""+r;
        return r
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