import BaseCfg from "../Libs/BaseCfg";

export default class GoodsCfg extends BaseCfg{
  
    //单例处理
	private goodsPath=null;
	private goldCfg=null;
	private coinCfg=null;
	private fangKaCfg=null;

	constructor(){
		super();
		this.goodsPath=this.getFullPath('goods.json');
	}
	
    private static _instance:GoodsCfg; 
    public static getInstance ():GoodsCfg{
        if(!this._instance){
            this._instance = new GoodsCfg();
        }
        return this._instance;
	} 
	loadGoodsCb(name,data){  
		this.goldCfg=data['gold'];
		this.coinCfg=data['coin'];
		this.fangKaCfg=data['fangka'];
		this.loaded=true;
	}
	loadGoods()
	{ 
     	//先去判断有几个游戏要加载 
		this.loadRes(this.goodsPath,this.loadGoodsCb);
	}
	getCoinCfg()
	{
		return this.coinCfg;
	}
	getFangKaCfg()
	{
		return this.fangKaCfg;
	}
	getGoldCfg()
	{
		return this.goldCfg;
	}
}

