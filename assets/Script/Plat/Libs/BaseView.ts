 
export default class BaseView{
    model=null;
    protected ui={}
    node:cc.Node=null;
    private _grayLayer:cc.Node = null
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

    public addGrayLayer (){
        cc.loader.loadRes('Icons/singleColor', cc.SpriteFrame, (err, spriteFrame:cc.SpriteFrame)=>{
            if(err){
                cc.error(err);
            }else{
                let _grayLayer = new cc.Node();
                _grayLayer.addComponent(cc.Sprite).spriteFrame = spriteFrame;
                _grayLayer.parent = this.node;
                
                let _size = cc.director.getWinSize();
                _grayLayer.width = _size.width;
                _grayLayer.height = _size.height;
                _grayLayer.color = cc.Color.BLACK;
                _grayLayer.opacity = 120;
                _grayLayer.zIndex = -1;
                _grayLayer.on(cc.Node.EventType.TOUCH_START, ()=>{
                    console.log('touch limit')
                }, this);
            }
        })
    }

}