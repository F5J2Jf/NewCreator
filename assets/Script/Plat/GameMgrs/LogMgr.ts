//
 
export default class LogMgr{
    private oplist=[]; 
    //单例处理
    private static _instance:LogMgr;
    //加入操作记录
    addOpreation(op)
    {
        this.oplist.push(op)
    }
    showModule(sceneName)
    {
        this.oplist.push(`跳转场景:${sceneName}`)
    }
    showSubModule(prefabName)
    {
        this.oplist.push(`显示预制体:${prefabName}`)
    }
    public static getInstance ():LogMgr{
        if(!this._instance){
            this._instance = new LogMgr();
        }
        return this._instance;
    }
}