 
export default class BaseView{
    model=null;
    protected ui={}
    node:cc.Node=null;
    constructor(model)
    {
        this.model=model; 
    }
    initUi()
    {
        
    }
    addPrefabNode(prefab)
    {       
        let prefabNode = cc.instantiate(prefab);
        this.node.addChild(prefabNode);
    }
}