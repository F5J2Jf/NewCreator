import ModuleMgr from "../../Plat/GameMgrs/ModuleMgr";

let modules={
    
	QzmjRoom:'QzmjRoom', 
    //麻将房间内的预制体
    mj_playerInfo : 'SubLayer/Games/Qzmj/Prefab_mj_userInfoCtrl', 
    QzmjSettle : 'SubLayer/Games/Qzmj/Prefab_QzmjSettle',
    ChatNode : 'SubLayer/Games/Qzmj/Prefab_ChatNode',
    ChatTextItem : 'SubLayer/Games/Qzmj/Prefab_ChatTextItem',
    gameDetailResult:'SubLayer/Games/Qzmj/gameDetailResult/Prefab_gameDetailResultCtrl',
    RoomResult:'SubLayer/Games/Qzmj/gameTotalResult/Prefab_RoomResultLayerCtrl',
    RoomTtlResult:'SubLayer/Games/Qzmj/gameTotalResult/Prefab_RoomResultLayerTtlCtrl',
}

export default class QzmjEntry{ 
    private static _instance:QzmjEntry;
    constructor()
    { 
    }  
    public static getInstance ():QzmjEntry{
        if(!this._instance){
            this._instance = new QzmjEntry();
        }
        return this._instance;
    } 
    registerModules()
    {
        ModuleMgr.getInstance().registerGame(modules);
    }
}
