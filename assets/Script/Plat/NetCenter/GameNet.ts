import NetCode from "./NetCode";
import NetNotify from "./NetNotify";   
import FrameMgr from "../GameMgrs/FrameMgr";
 
export default class GameNet{
	private static _instance = null; 
	private m_send_record={};//发送队列
	private m_is_resend=false;//重发
	private m_resendcount=0;//重发次数   
    private _uid=null;
	private webhost;    
 
	private logenable=true;  
 
    public static getInstance() : GameNet{
        if (GameNet._instance == null){
            GameNet._instance = new GameNet();
        }
        return GameNet._instance;
	} 
	setUid(uid)
	{
		this._uid=uid;
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
		msg.uid=this._uid; 
		if (server=='http'){ 
			this.webReq(route,msg);
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
	}
	//tcp请求
	pomeloNotify(route,msg){ 
		pomelo.notify(route,msg)
	} 
 
	msgcb(route,resp){ 
		//错误处理
		if(route=='queResult')//这个是服务器队列添加结果不予理会
		{
			return;
		}
		console.log("返回的msgcb=",route,resp)
		var errmsg=NetCode.getInstance().check(resp.code)
		if (errmsg!=null){   
			FrameMgr.getInstance().showMsgBox(`code=${resp.code},${errmsg}`);
			console.log('错误信息=',errmsg)
			return;
		}  
		//刷新管理器的数据 
		NetNotify.getInstance().dealResp(route,resp)  
		//广播网络消息 
		this.emit(route,resp);
	} 

	//http请求
	webReq(route,msg){ 
		var xhr = cc.loader.getXMLHttpRequest();   
		var self=this;
		xhr.onreadystatechange = function () {  
			cc.log('xhr.readyState='+xhr.readyState+'  xhr.status='+xhr.status);  
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {  
				var respone = xhr.responseText;   
				var resp = JSON.parse(respone)
				var route=resp.route;
				var msg=resp.msg;  
				self.msgcb(route,msg)   
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
			'route':route,
			'msg':msg,
		}
		var wholeurl=this.webhost+'?data='+JSON.stringify(smsg);
		console.log("wholeurl=",wholeurl)
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
	
   
