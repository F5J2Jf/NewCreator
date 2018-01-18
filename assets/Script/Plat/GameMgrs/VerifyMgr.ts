//
import BaseMgr from "../Libs/BaseMgr";
import RoomMgr from "./RoomMgr";
import UserMgr from "./UserMgr";
import FrameMgr from "./FrameMgr";
import BetMgr from "./BetMgr";
import Prefab_shopCtrl from "../Modules/Shop/Prefab_shopCtrl";

/**
 * gfun
 * Bet
 * platmodule
 */

 
export default class VerifyMgr extends BaseMgr{
    unsettled:any = null                    //未决事件，1表示未结束游戏，2表示未解散房间
    routes:any = null                       
    constructor (){
        super();

        this.unsettled=0;
        this.routes={ 
            'http.reqMyRoomState':this.http_reqMyRoomState,
            'onGameFinished':this.onGameFinished, 
        }
    }

    onGameFinished(msg){
        this.unsettled=0;
    }

    http_reqMyRoomState(msg) {
        console.log("http_reqMyRoomState msg=",msg)
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
            console.log("调用了 回调")
            if(this.unsettled !=1){
                FrameMgr.getInstance().showMsgBox("游戏已经结束"); 
                return
            }
            RoomMgr.getInstance().reqRoomRecover();
        }
        FrameMgr.getInstance().showDialog("你有游戏在进行,点击确定恢复游戏!",okcb.bind(this)) 
    }
    showUndispandRoom(){
        // body 
        let okcb = function(){
            if(this.unsettled !=2){
                FrameMgr.getInstance().showMsgBox("游戏已解散");  
                return;
            }
            RoomMgr.getInstance().reqEnterMyFangKaRoom();
        }

        FrameMgr.getInstance().showDialog("你有房间未解散,点击确定进入!",okcb.bind(this))  
    } 

    checkUnSettled(){
        if(this.unsettled == 1){
            this.showRecoverRoom();
            return true;
        }
        return false;
    }
    //判断金币是否足够
    checkCoin(){
        //判断是否有未恢复的游戏
        if(this.checkUnSettled()){
            return false
        } 
        let myinfo=UserMgr.getInstance().getMyInfo();   
        let jbcCfg=BetMgr.getInstance().getJbcCfg();
        var baseInfo=jbcCfg['base'] 
        if(myinfo.coin<baseInfo.leastcoin){ 
            //金币不足
            if(myinfo.relief>0){
                //启用救济金
                this.start_sub_module(G_MODULE.ReliefMoney)  
            }else{
                //打开购买游戏豆界面 
                this.start_sub_module(G_MODULE.Shop, (uiComp:Prefab_shopCtrl)=>{
                    uiComp.buyCoin();
                });
   
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