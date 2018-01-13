import GameNet from "../NetCenter/GameNet";
import NetNotify from "../NetCenter/NetNotify";
import LogMgr from "./LogMgr";

enum G_UiType
{
    button=1, 
    image,
    text,
    edit,
} 
window['G_UiType']=G_UiType;
//基础的管理器
export default class UiMgr{ 
    //按钮点击后的缩放幅度
    private _scaleRate:number = null
    //单例处理  
    private static _instance:UiMgr;
    public static getInstance ():UiMgr{
        if(!this._instance){
            this._instance = new UiMgr();
        }
        return this._instance;
    } 

    constructor(){
        this._scaleRate = 0.9;
    }

    connect(uitpye,node,callback,opname)
    {
        switch(uitpye)
        {
            case G_UiType.button:
                this.bindButton(node,callback,opname)
            break;
            case G_UiType.image:
                this.bindImage(node,callback,opname)
            break;
            case G_UiType.text:
                this.bindText(node,callback,opname)
            break;
            case G_UiType.edit:
                this.bindEdit(node,callback,opname);
        }
    }
    bindButton(node,callback,opname)
    {
        
    }
    bindEdit(node,callback,opname)
    {
        node.on('editing-did-ended',function(event)
        {
            LogMgr.getInstance().addOpreation(opname);
            console.log(`你输入了内容`)
            callback(event);
        }
        , this);
        
    }
    public bindImage(node:cc.Node, callback:Function, opname:string)
    {
        node['_isTouchEnabledEx'] = true;
        node.on(cc.Node.EventType.TOUCH_START, function (event) { 
            if(event.target._isTouchEnabledEx) {
                if(!event.target.lastScale) event.target.lastScale = event.target.scale;
                    event.target.scale = event.target.lastScale * this._scaleRate;
            }
        },this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            if(event.target.lastScale) event.target.scale = event.target.lastScale
        },this);
        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            //加入操作日志
            LogMgr.getInstance().addOpreation(opname);
            console.log(`你点击了图片"${opname}"`)
            if(event.target.lastScale) event.target.scale = event.target.lastScale
            if(event.target._isTouchEnabledEx) {
                // callBack.call(target, event, userData);
                if(callback){
                    callback(node,event); 
                }
            }
        },this);
    }

    //设置按钮是否可用
    public setBtnEnable (node:cc.Node, isEnable:Boolean, isNoGray?:Boolean) {
        if(isEnable){
            node.color = cc.Color.WHITE;
        }else{
            if(!isNoGray) node.color = cc.Color.GRAY;
        }
        node['_isTouchEnabledEx'] = isEnable;
    }

    bindText(obj,callback,opname)
    {

    } 
}
