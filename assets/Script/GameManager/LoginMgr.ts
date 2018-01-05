import BaseMgr from "./BaseMgr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginMgr extends BaseMgr{

    _routes:{} = null

    constructor (){
        super();

        this._routes = {
            'http.reqRegister' : this.http_reqRegister.bind(this),
            'http.reqLogin' : this.http_reqLogin.bind(this),
            'gate.entry.req' : this.gate_entry_req.bind(this),
        }
    }

    gate_entry_req (msg){
        //body
        // g.gamenet:changeIp(msg)
    }
    http_reqLogin (msg){
        //body
        // g.gamenet:loginPomelo(msg)
    }

    http_reqRegister (msg){
        //body
        // g.gamenet:loginPomelo(msg)
    }

    reqLogin (msg){
        this.send_msg('http.reqLogin',msg) 
    }

    reqRegister (msg){
        this.send_msg('http.reqRegister',msg) 
    }


    //单例处理
    private static _instance:LoginMgr;
    public static getInstance ():LoginMgr{
        if(!this._instance){
            this._instance = new LoginMgr();
        }
        return this._instance;
    }
}