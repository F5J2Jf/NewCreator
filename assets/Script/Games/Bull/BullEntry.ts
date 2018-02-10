import ModuleMgr from "../../Plat/GameMgrs/ModuleMgr";

let modules={
    
    BullRoom:'BullRoom', 
    Bull_calculate:"SubLayer/Games/Bull/Prefab_bull_calculateCtrl"
}

export default class BullEntry{ 
    private static _instance:BullEntry;
    constructor()
    { 
    }  
    public static getInstance ():BullEntry{
        if(!this._instance){
            this._instance = new BullEntry();
        }
        return this._instance;
    } 
    registerModules()
    {
        ModuleMgr.getInstance().registerGame(modules);
    }
}