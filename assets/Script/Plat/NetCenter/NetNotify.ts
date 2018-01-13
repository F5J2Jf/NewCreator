import LoginMgr from "../GameMgrs/LoginMgr";

 
export default class NetNotify{
	
	private static _instance = null;
	private m_listenlist=[];
	public static getInstance() : NetNotify{
        if (NetNotify._instance == null){
            NetNotify._instance = new NetNotify();
        }
        return NetNotify._instance;
	}
	regNotifyListener(listener){
		this.m_listenlist.push(listener)
	}
	dealResp(notifyname,msg){
		for(var i = 0;i<this.m_listenlist.length;i++)  
		{  
			var v=this.m_listenlist[i]
			v.dealResp(notifyname,msg);
		}
	}  
}
