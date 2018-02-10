import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BaseCtrl from "../../Libs/BaseCtrl";

const {ccclass, property} = cc._decorator;


let ctrl : Prefab_luckDrawTipCtrl;

class Model extends BaseModel{
    private content:string = null           //内容
    private buttonlab:string = null

    constructor()
    {
        super();
        this.buttonlab = '分享';

    }
    public setContentLab(content:string){
        this.content  = content;
    }
    public setButtonLab(buttonlab){
        this.buttonlab = buttonlab;
    }
}

class View extends BaseView{
    ui={
        label_contentLab:null,
        button_shareBtn:null,
        label_buttonLab:null,
    };
    node = null;
    constructor(model){
        super(model);
        this.node = ctrl.node;
        this.initUi();
        this.addGrayLayer();
    }

    initUi(){
        this.ui.label_contentLab = ctrl.contentLab;
        this.ui.button_shareBtn = ctrl.shareBtn;
        this.ui.label_buttonLab = ctrl.buttonLab;
    }

    public updateContent(){
        this.ui.label_contentLab.string = this.model.content;
    }
    public updateButtonLab(){
        this.ui.label_buttonLab.string = this.model.buttonlab;
    }
}
@ccclass
export default class Prefab_luckDrawTipCtrl extends BaseCtrl {

    @property(cc.Label)
    contentLab: cc.Label = null;

    @property(cc.Node)
    shareBtn: cc.Node = null;

    @property(cc.Label)
    buttonLab: cc.Label = null;


    private _cb_response:Function = null
    onLoad () {
        //创建mvc模式中模型和视图
        //控制器
        ctrl = this;
        //数据模型
        this.model = new Model();
        //视图
        this.view = new View(this.model);
        //引用视图的ui
        this.ui=this.view.ui;
        //定义网络事件
        this.defineNetEvents();
        //定义全局事件
        this.defineGlobalEvents();
        //注册所有事件
        this.regAllEvents()
        //绑定ui操作
        this.connectUi();
    },
    
    defineNetEvents(){
    
    }
    defineGlobalEvents(){
    }

    connectUi(){
        this.connect(G_UiType.button, this.ui.button_shareBtn, this.onClickCB, '点击确认')
    }
    
    public showTip (content:string, cb?:Function, buttonLab?:string){
        this._cb_response = cb;
        buttonLab = buttonLab ? buttonLab : this.model.buttonlab;
        this.model.setButtonLab(buttonLab);
        this.model.setContentLab(content);
        this.view.updateButtonLab();
        this.view.updateContent();
    }

    start () {

    },

    onClickCB(event){
        if (this.model.buttonlab == '分享'){
            console.log('分享') 
            this._doFinish();
        }
        else{
            this.finish();
        }
    }

    private _doFinish(){
        if(this._cb_response){
            this._cb_response();
        }
        this.finish();
    }
    // update (dt) {},
}
