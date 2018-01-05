//
import BaseMgr from "./BaseMgr";
import UserMgr from "./UserMgr";
import RoomMgr from "./RoomMgr";
import RechargeMgr from "./RechargeMgr";
import VerifyMgr from "./VerifyMgr";
const {ccclass, property} = cc._decorator;

@ccclass
export default class ModuleMgr extends BaseMgr{
    loadprocess:any = null
    loadarr:Array<Function> = null
    totalcount:number = null
    routes:any = null
    completecb:Function = null
    constructor (){
        super();
        UserMgr.getInstance();
        RoomMgr.getInstance();
        RechargeMgr.getInstance();
        VerifyMgr.getInstance();

        this.loadprocess=0;
        function ff (){

        }
        this.loadarr = [
            function(){
                UserMgr.getInstance().reqMyInfo();//获取我的信息
            },
            function(){
                RoomMgr.getInstance().reqMyRoomState();//获取我的房间状态
            }
        ];
        this.totalcount=this.loadarr.length;
        this.routes={
            'http.reqMyInfo':this.http_reqMyInfo.bind(this), 
            'http.reqMyRoomState':this.http_reqMyRoomState.bind(this),     
        } 
    }

    http_reqMyInfo(msg){
        this.checkIfAllLoaded();
    }
    http_reqMyRoomState(msg){
        this.checkIfAllLoaded();
    }
    checkIfAllLoaded(){
        this.loadprocess=this.loadprocess+1; 
        if(this.loadprocess>=this.totalcount){
            //表示全部加载完成了
            this.completecb();
        }
    }

    initPlat(completecb){
        this.completecb = completecb
        //获取我的信息
        for(let i = 0; i < this.totalcount; i ++){
            this.loadarr[i]();
        }
    } 
    
    
    enterPlat() { 
        this.send_msg('connector.entryHandler.enterPlat');
    } 
    dealConnectorEvent(ev_type,arg1,arg2){
        //ev_type=0表示推送
        //ev_type=1表示连接成功 

        if(ev_type==1){
            this.enterPlat();  
        }
    }


    //单例处理
    private static _instance:ModuleMgr;
    public static getInstance ():ModuleMgr{
        if(!this._instance){
            this._instance = new ModuleMgr();
        }
        return this._instance;
    }
}