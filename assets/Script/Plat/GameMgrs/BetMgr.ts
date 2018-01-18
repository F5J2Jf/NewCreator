//
import BaseMgr from "../Libs/BaseMgr"; 
import BetCfg from "../CfgMgrs/BetCfg";

 
 
export default class BetMgr extends BaseMgr{
    private betType = 1;
    private gameId = 1;
    private seatCount=4;
    //单例处理
    constructor(){
        super();
    }
    private static _instance:BetMgr; 
    public static getInstance ():BetMgr{
        if(!this._instance){
            this._instance = new BetMgr();
        }
        return this._instance;
    }
    getGameId(){
        return this.gameId;
    }
    getBetType(){
        return this.betType;
    }
    getSeatCount(){
        return this.seatCount;
    }
    getJbcCfg()
    {
        return BetCfg.getInstance().getJbcCfg(this.gameId,this.betType);
    }
}