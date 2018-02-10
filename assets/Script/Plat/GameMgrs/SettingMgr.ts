import BaseMgr from "../Libs/BaseMgr";

 
export default class SettingMgr extends BaseMgr{
    controlInfo:any = {}
    notifyInfo:any = {}
    musicInfo:any = {}
    defaultInfo:any = {}
    routes:{} = null
    //====== 
    uid:any = null 
    constructor (){
        super();
        this.controlInfo = {
        	bMjClick:true,
        	bMjDrag:true,
        	bSssAutoMate:true,
        }
        this.notifyInfo = {
        	bMatchAD : false,
			bMatchBegin : true,
			bClubMatchSignUp : true,
			bClubMatchInvite : false,
        }
        this.musicInfo = {
        	bMusicSwitch:true,
			musicVolume:50,
			bEffectSwitch:true,
			effectVolume:50,
			bYySwitch:false,
			yyVolume:60,
			bTipSwitch:false,
			bTopolectSwitch:true,
        }
        this.routes={
        	'http.reqSettingInfo':this.http_reqSettingInfo, 
        	'http.reqReset':this.http_reqReset,
        }
    }
    getControlInfo(){
        return this.controlInfo;
    }
    getNotifyInfo(){
    	return this.notifyInfo;
    }
    getMusicInfo(){
    	return this.musicInfo;
    }
    setProperty (value, PropertyName, childProName) {
    	if (isNaN(value)) return console.log("value 不能为空")
    	if (!PropertyName) return console.log("PropertyName 不能为空")
    	if (childProName) {
    		this[PropertyName][childProName] = value
    	} else {
			this[PropertyName] = value
    	}
    }

    http_reqSettingInfo(msg){
    	this.controlInfo = msg.controlInfo;
    	this.notifyInfo = msg.notifyInfo;
    	this.musicInfo = msg.musicInfo;
    }
    //请求设置的相关数据
    reqSettingInfo(msg){
    	this.send_msg('http.reqSettingInfo', msg)
    }
    //发送更改后的设置数据
    sendSettingInfo(msg){
    	this.send_msg('http.sendReviseSetting', msg)
    }

    reqReset(){
    	this.send_msg('http.reqReset')
    }
    http_reqReset(msg){
    	this.controlInfo = msg.controlInfo;
    	this.notifyInfo = msg.notifyInfo;
    	this.musicInfo = msg.musicInfo;
    }
 
    //单例处理
    private static _instance:SettingMgr;
    public static getInstance ():SettingMgr{
        if(!this._instance){
            this._instance = new SettingMgr();
        }
        return this._instance;
    }
}