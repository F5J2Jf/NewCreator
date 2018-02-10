import BaseCfg from "../Libs/BaseCfg";
import BetCfg from "./BetCfg";
 
export default class GameIdCfg extends BaseCfg{
  
	//单例处理
	private gameids = null;
	private gameIdPath=null;
	constructor(){
		super();
		this.gameIdPath=this.getFullPath('gameid'); 
	}
	
    private static _instance:GameIdCfg; 
    public static getInstance ():GameIdCfg{
        if(!this._instance){
            this._instance = new GameIdCfg();
        }
        return this._instance;
	} 
	loadGameIdCb(name,data){ 
		this.loaded=true; 
		BetCfg.getInstance().loadCfgs(data);
		this.gameids = data;
	}
	getGameIds()
	{
		return this.gameids;
	}
	loadGameId()
	{
		//先去判断有几个游戏要加载
		this.loadRes(this.gameIdPath,this.loadGameIdCb);
	}
}

