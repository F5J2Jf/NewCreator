import LogMgr from "./LogMgr";

//控制器基类 
let G_MODULE=
{
    Login:'Login',  
	LoadingPlat:'LoadingPlat',  
    Plaza:'Plaza', 
    QzmjRoom:'QzmjRoom',
    BullRoom:'BullRoom', 
    UserLogin:'SubLayer/Plat/UserLogin/Prefab_UserLogin',
    UserRegister:'SubLayer/Plat/UserLogin/Prefab_UserRegister',
	MsgBox:'SubLayer/Plat/MsgBox/Prefab_MsgBoxCtrl',
	LoadingGame:'LoadingGame',
	PlazaSetting:'SubLayer/Plat/PlazaSetting/Prefab_settingCtrl',
    LuckDraw:'SubLayer/Plat/LuckDraw/Prefab_luckDraw',
    LuckDrawTipPanel:'SubLayer/Plat/LuckDraw/Prefab_luckDrawTipCtrl',
	AgencyBind:'SubLayer/Plat/PlazaSetting/Prefab_AgencyBind',
	AccountBind:'SubLayer/Plat/PlazaSetting/Prefab_AccountBind',
	ChatNode:'SubLayer/Plat/Chat/Prefab_ChatNode',
	Mail:'SubLayer/Plat/Mail/Prefab_Mail',
    MailItem:'SubLayer/Plat/Mail/Prefab_MailDetail',
    Shared:'SubLayer/Plat/Shared/Prefab_sharedCtrl',
	Shop:'SubLayer/Plat/Shop/Prefab_shopCtrl',
	ShopDetail:'SubLayer/Plat/Shop/Prefab_shopDetailCtrl',
    joinRoom:'SubLayer/Plat/CreateRoom/Prefab_JoinRoom',
    createRoom:'SubLayer/Plat/CreateRoom/Prefab_CreateRoom',
    PlayerDetail:'SubLayer/Plat/PlayerDetail/Prefab_playerDetailCtrl',
    ReliefMoney:'SubLayer/Plat/MsgBox/Prefab_reliefMoneyCtrl',
    HarvestFrame:'SubLayer/Plat/MsgBox/Prefab_harvestCtrl',
    SignIn:'SubLayer/Plat/SignIn/Prefab_SignIn',
    LoadAni:'SubLayer/Plat/MsgBox/Prefab_loadAniCtrl',
	GoldMode:'SubLayer/Plat/GoldMode/Prefab_GoldModeCtrl',
	RoomSetting:'SubLayer/Plat/RoomSetting/Prefab_RoomSetting',  
	shimingRenZheng:'SubLayer/Plat/PlayerDetail/Prefab_shimingRenZheng',
	changeName:'SubLayer/Plat/PlayerDetail/Prefab_changeName',
	tipFrame:'SubLayer/Plat/tips/Prefab_tipsCtrl',
	gameDetailResult:'SubLayer/Games/Qzmj/gameDetailResult/Prefab_gameDetailResultCtrl',
	Rank:'SubLayer/Plat/Rank/Prefab_RankCtrl',
	RoleDetail:'SubLayer/Plat/Rank/Prefab_roleDetailCtrl',
	RuleDescription:'SubLayer/Plat/RuleDescription/Prefab_RuleCtrl',
    More:'SubLayer/Plat/More/More',
} 
window['G_MODULE']=G_MODULE;


export default class ModuleMgr{ 
	  
	gameModules=null;
	registerGame(modules)
	{
		this.gameModules=modules;
		for(var key in modules)
		{
			G_MODULE[key]=modules[key];
		}
	}
	//启动模块(全屏)
	start_module(sceneName)
	{
		var cb=function()
		{
			LogMgr.getInstance().showModule(sceneName)
		}
		cc.director.loadScene(sceneName,cb.bind(this));
	}   
	start_sub_module(prefabName:string, cb:Function)
	{ 
		cc.loader.loadRes(prefabName, (err, prefab:cc.Prefab)=> { 
			if(err){
				cc.error(err) 
			}else{
				let prefabNode = cc.instantiate(prefab);
                prefabNode.parent = cc.find('Canvas');
                let prefabComp = prefabNode.getComponent(prefab.name);
                cb(prefabComp);
				LogMgr.getInstance().showSubModule(prefabName)
			} 
		}); 
	}       
    private static _instance:ModuleMgr;
  
    public static getInstance ():ModuleMgr{
        if(!this._instance){
            this._instance = new ModuleMgr();
        }
        return this._instance;
    }
}
