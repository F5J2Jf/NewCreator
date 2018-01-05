//
import BaseMgr from "./BaseMgr";
import RoomMgr from "./RoomMgr";
import UserMgr from "./UserMgr";

/**
 * gfun
 * Bet
 * platmodule
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class VerifyMgr extends BaseMgr{
    unsettled:any = null                    //未决事件，1表示未结束游戏，2表示未解散房间
    routes:any = null                       
    constructor (){
        super();

        this.unsettled=0;
        this.routes={ 
            'http.reqMyRoomState':this.http_reqMyRoomState.bind(this),
            'onGameFinished':this.onGameFinished.bind(this), 
        }
    }

    onGameFinished(msg){
        this.unsettled=0;
    }

    http_reqMyRoomState(msg) {
        this.unsettled=msg.unsettled;
        if(this.unsettled == 1){
            this.showRecoverRoom();
        }else if(this.unsettled==2){
            this.showUndispandRoom();
        }
    }

    showRecoverRoom(){
        // body 
        let okcb = function(){
            if(this.unsettled !=1){
                // gfun.Warrning("游戏已结束")
                return
            }
            RoomMgr.getInstance().reqRoomRecover();
        }
        // gfun.MsgDlg("你有游戏在进行,点击确定恢复游戏!",okcb);
    }
    showUndispandRoom(){
        // body 
        let okcb = function(){
            if(this.unsettled !=2){
                // gfun.Warrning("游戏已解散")
                return;
            }
            RoomMgr.getInstance().reqEnterMyFangKaRoom();
        }

        // gfun.MsgDlg("你有房间未解散,点击确定进入!",okcb);
    } 

    checkUnSettled(){
        if(this.unsettled == 1){
            this.showRecoverRoom();
            return true;
        }
        return false;
    }
    
    checkCoin(gameid,bettype){
        if(this.checkUnSettled()){
            return false
        }
        
        let myinfo=UserMgr.getInstance().myinfo   
        // let betcfg=Bet.getInstance().getBetById(gameid,bettype) 
        let betcfg:any = null;

        if(myinfo.coin<betcfg.leastcoin){
            //如果金钱不够就去领取
            if(myinfo.getcoin>0){
                // this.start_sub_module(platmodule.getcoin)
            }else{
                //打开购买游戏豆界面
                // let ctrl=this.start_sub_module(platmodule.recharge)
                // ctrl.initShop(0)
            }
            return false;
        }
        return true;
    } 

    checkFangKaRound(roominfo) {
        if(roominfo.roundindex==roominfo.roundcount-1){
            // gfun.Warrning("牌局场次已结束") 
            return false;
        }
        return true;
    }


    checkFangKa(cost){
        if(this.checkUnSettled()){
            return false
        }
        let myinfo=UserMgr.getInstance().myinfo  
        if(myinfo.fangka<cost){
            // let ctrl=this.start_module(platmodule.recharge)
            // ctrl.initShop(1)
            return false;
        }
        return true;
    } 


    //单例处理
    private static _instance:VerifyMgr;
    public static getInstance ():VerifyMgr{
        if(!this._instance){
            this._instance = new VerifyMgr();
        }
        return this._instance;
    }
}