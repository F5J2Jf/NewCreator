//
import BaseMgr from "../Libs/BaseMgr"; 
import BetCfg from "../CfgMgrs/BetCfg";

 
 
export default class BetMgr extends BaseMgr{
    private betType = null;
    private gameId = null;
    private seatCount=null;
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

    setGameId(gameId:number){
        this.gameId = gameId;
    }
    setBetType(bettype:number)
    {
        this.betType=bettype;
    }
    setSeatCount(seatCount:number){
        this.seatCount;
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