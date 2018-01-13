import BaseMgr from "../Libs/BaseMgr";
import GameNet from "../NetCenter/GameNet";
import NetNotify from "../NetCenter/NetNotify";
import PlatMgr from "./PlatMgr";
  
enum ServerType {
	server_gate=1,
    server_connector
} 

export default class LoginMgr extends BaseMgr{

    private _host=null;
    private _port=null;  
    private m_servertype:ServerType;
    private _uid=null;
    private _token;
    
    routes:{} = null

    constructor (){
        super(); 
        this.routes = {
            'http.reqRegister' : this.http_reqRegister,
            'http.reqLogin' : this.http_reqLogin,
            'gate.entry.req' : this.gate_entry_req,
        }
        GameNet.getInstance().setWebHost("http://192.168.1.190:3000/gamereq") 
    }
    getUid()
    {
        return this._uid;
    }
    //连接服连接状态回调
    connectConnector(event_type,event){
        switch(event_type)
        {
            case 'connect':
                //连接服连接成功
                console.log("连接服连接成功")
                PlatMgr.getInstance().enterPlat();
            break;
        }
    }
    gateConnectCb(event_type,event){
        switch(event_type)
        {
            case 'connect':
                console.log("连接gate成功后获取入口") 
                this.queryEntry();//获得入口
            break;
            case 'disconnect':
                //gate断开有两种情况，一种是获取到了游戏服后断开，一种是gate服连接被拒
                console.log("断开了gate")
                if(this._host!=null)
                {
                    console.log("端口gate后连接连接服")
                    this.m_servertype=ServerType.server_connector;
                    GameNet.getInstance().connect(this._host,this._port,this.connectcb.bind(this));
                }
            break;
        }
    }
    connectcb(event_type,event){ 
        console.log("servertype=",this.m_servertype,event_type)
        switch(this.m_servertype)
        {
            case ServerType.server_gate: 
                this.gateConnectCb(event_type,event)
            break;
            case  ServerType.server_connector:
                this.connectConnector(event_type,event)
            break;
        } 
	}  
	//去获取连接服ip和端口
	queryEntry(){
        console.log("去获取连接服ip和端口")
		var route = 'gate.entry.req'; 
		var msg={ 
			'token':this._token,
		} 
		GameNet.getInstance().send_msg(route,msg);
    }
    //获取到连接服务器后就断开gate
    gate_entry_req (msg){
        //body
        console.log("获取连接服成功后去断开gate")
        this._host=msg.host;
        this._port=msg.port;
        GameNet.getInstance().disconnect();
    } 

    //登录pomelo长连接服
    loginPomelo(msg)
    {  
        //body  
        this.m_servertype=ServerType.server_gate
        this._uid=msg.uid;
        this._token=msg.token; 
        GameNet.getInstance().setUid(this._uid)
        //登录成功后连接gate
        GameNet.getInstance().connect(msg.host,msg.port,this.connectcb.bind(this));
    }
    //登录nodejs服回调
    http_reqLogin (msg){
        this.loginPomelo(msg)
    }
    
    //注册nodejs服回调
    http_reqRegister (msg){
        //body
        this.loginPomelo(msg)
    }
    //请求登录nodejs服
    reqLogin (msg){
        this.send_msg('http.reqLogin',msg)
    }
    //请求注册nodejs服
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