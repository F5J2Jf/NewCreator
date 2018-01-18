import LogMgr from "./LogMgr";

//控制器基类 
let G_MODULE=
{
    Login:'Login',  
	LoadingPlat:'LoadingPlat',  
    Plaza:'Plaza', 
    UserLogin:'SubLayer/Plat/UserLogin/Prefab_UserLogin',
    UserRegister:'SubLayer/Plat/UserLogin/Prefab_UserRegister',
	MsgBox:'SubLayer/Plat/MsgBox/Prefab_MsgBoxCtrl',
	LoadingGame:'LoadingGame', 
	QzmjRoom:'QzmjRoom',
	PlazaSetting:'SubLayer/Plat/PlazaSetting/Prefab_plazaSetting',
	AgencyBind:'SubLayer/Plat/PlazaSetting/Prefab_AgencyBind',
	AccountBind:'SubLayer/Plat/PlazaSetting/Prefab_AccountBind',
	ChatNode:'SubLayer/Plat/Chat/Prefab_ChatNode',
	Mail:'SubLayer/Plat/Mail/Prefab_Mail',
    MailItem:'SubLayer/Plat/Mail/Prefab_MailDetail',
    Shared:'SubLayer/Plat/Shared/Prefab_sharedCtrl',
    Shop:'SubLayer/Plat/Shop/Prefab_shopCtrl',
    joinRoom:'SubLayer/Plat/CreateRoom/Prefab_JoinRoom',
    createRoom:'SubLayer/Plat/CreateRoom/Prefab_CreateRoom',
    PlayerDetail:'SubLayer/Plat/PlayerDetail/Prefab_playerDetailCtrl',
    ReliefMoney:'SubLayer/Plat/MsgBox/Prefab_reliefMoneyCtrl',
    HarvestFrame:'SubLayer/Plat/MsgBox/Prefab_harvestCtrl',
    SignIn:'SubLayer/Plat/SignIn/Prefab_SignIn',
    LoadAni:'SubLayer/Plat/MsgBox/Prefab_loadAniCtrl',
    GoldMode:'SubLayer/Plat/GoldMode/Prefab_GoldMode',
} 
window['G_MODULE']=G_MODULE;


export default class ModuleMgr{ 
      
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
