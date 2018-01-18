import BaseCfg from "../Libs/BaseCfg";

export default class BetCfg extends BaseCfg{
  
    //单例处理
    gameids=null;
    statemap={};//记录记载完成的标记
    cfgs={};
    constructor(){
        super();
    }
    private static _instance:BetCfg; 
    public static getInstance ():BetCfg{
        if(!this._instance){
            this._instance = new BetCfg();
        }
        return this._instance;
	} 
    loadCfgsCb(name,data)
    {  
        var item=this.statemap[name]//加载标记
        if(!this.cfgs[item.type]) 
        {
            this.cfgs[item.type]={};
        }
        if(item.type=='jbc')
        {
            var cfgItemMap={}; 
            for(var i=0;i<data.length;++i)
            {
                var dataItem=data[i];
                console.log("dataItem=",JSON.stringify(dataItem))
                cfgItemMap[dataItem.base.id]=dataItem;
            }
            this.cfgs[item.type][item.gameId]=cfgItemMap;
        }
        else{
            this.cfgs[item.type][item.gameId]=data;
        }
        item.loaded=true; 
    }
    loadCfgs(gameids)
    {
        this.gameids=gameids; 
        for(var i = 0;i<this.gameids.length;++i)
        {
            var item=this.gameids[i];
            //金币场配置
            var jbccfgpath=this.getFullPath(`games/${item.code}/${item.code}jbc.json`)
            //房卡配置
            var roomcfgpath=this.getFullPath(`games/${item.code}/${item.code}room.json`)
            //金币场还是房卡，还有游戏id,还有加载标志
            this.statemap[jbccfgpath]={type:'jbc',gameId:item.id,loaded:false};
            this.statemap[roomcfgpath]={type:'room',gameId:item.id,loaded:false};;
            this.loadRes(jbccfgpath,this.loadCfgsCb);
            this.loadRes(roomcfgpath,this.loadCfgsCb);
        }
    }
    getJbcCfg(gameId,bettype)
    {
        var jbcCfg=this.cfgs['jbc']; 
        return jbcCfg[gameId][bettype];
    }
    isLoaded()
    {
        for(var key in this.statemap)
        {
            if(this.statemap[key].loaded==false)
            {
                return false
            }
        }
        return true;
    }
}





 