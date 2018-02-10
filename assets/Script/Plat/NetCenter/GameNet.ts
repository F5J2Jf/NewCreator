import NetCode from "./NetCode";
import NetNotify from "./NetNotify";   
import FrameMgr from "../GameMgrs/FrameMgr";

Array.prototype.remove=function(index){
 
    for(var j = index;j <this.length-1;j++){ 
        this[j]=this[j+1]; 
    } 
    this.length = this.length-1;
}
Array.prototype.insert = function (index, item) {  
	this.splice(index, 0, item);  
};    

export default class GameNet{
	private static _instance = null; 
	private m_send_record={};//发送队列
	private m_is_resend=false;//重发
	private m_resendcount=0;//重发次数   
    private _uid=null;
    private _token=null;
	private webhost;    
    private msgindex=0;
	private logenable=true;  
 
    public static getInstance() : GameNet{
        if (GameNet._instance == null){
            GameNet._instance = new GameNet();
        }
        return GameNet._instance;
	} 
	setLoginInfo(uid,token)
	{
		this._uid=uid;
		this._token=token; 
	}
	setWebHost(webhost)
	{
		this.webhost=webhost
	}
	//发送网络消息
	emit(route,msg)
	{   
		G_FRAME.netEmitter.emit(route,msg)
		return true;
	}

	notify_msg(route,msg)
	{
		this.pomeloNotify(route,msg);
	} 

	//拼装数据
	send_msg(route,msg){
		var words=route.split('.');
		var wordslen= words.length
		console.log("words=",typeof(route),route,words)

		if (wordslen<=0){ 
			return -1;
		}
		var server=words[0]; 
		if(msg==null||msg=='undefined')
		{
			msg={}
		}   
		if (server=='http'){ 
			this.webReq(route,msg);
			this.msgindex++;
		}
		else
		{ 
			this.pomeloReq(route,msg);
		}
		return 0; 
	}

	//tcp请求
	pomeloReq(route,msg){  
		pomelo.request(route,msg)
	}reqUsers
	//tcp请求
	pomeloNotify(route,msg){ 
		pomelo.notify(route,msg)
	} 
 
	msgcb(route,code,data){ 
		//错误处理
		if(route=='queResult')//这个是服务器队列添加结果不予理会
		{
			return;
		} 
		var errmsg=NetCode.getInstance().check(code)
		if (errmsg!=null){   
			FrameMgr.getInstance().showMsgBox(`code=${code},${errmsg}`); 
			return;
		}  
		//刷新管理器的数据 
		NetNotify.getInstance().dealResp(route,data)  
		//广播网络消息 
		this.emit(route,data);
	} 

	//http请求
	webReq(route,msg){ 
		var xhr = cc.loader.getXMLHttpRequest();   
		var self=this;
		xhr.onreadystatechange = function () {   
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {  
				var respone = xhr.responseText;   
				var resp = JSON.parse(respone)
				var head=resp.head;
				var body=resp.body;  
				self.msgcb(head.route,head.code,body)   
			}  
		};   
		//xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");   
		// note: In Internet Explorer, the timeout property may be set only after calling the open()  
		// method and before calling the send() method.  
		xhr.timeout = 5000; 
		xhr.onerror = (error)=> {
            console.log("客户端出错啦")
        }
		var smsg={
			head:{
				msgindex:this.msgindex,
				token:this._token,
				route:route,
			},
			body:msg
		}
		var wholeurl=this.webhost+'?data='+JSON.stringify(smsg); 
		xhr.open("POST", wholeurl,true); 
		xhr.send(); 
	} 
 
	connect(host,port,connectcb)
	{  
		var cfg={
			host:host,
			port:port,
			debug:true,
			msgcb:this.msgcb.bind(this),
			connectcb:connectcb, 
		}
		console.log("连接配置=",cfg)
		pomelo.init(cfg)
	} 
	disconnect()
	{
		pomelo.disconnect() 
	}
} 
	
   
