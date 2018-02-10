import ServerMgr from "../../AppMgrs/ServerMgr";


const {ccclass, property} = cc._decorator;

let ctrl : LaunchCtrl;
//模型，数据处理
class Model { 
    constructor()
    { 
        
    }
 
}
//视图, 界面显示或动画，在这里完成
class View {
    ui={};
    private node=null;
    private model:Model=null

    constructor(model)
    { 
        this.model=model; 
        this.node=ctrl.node;  
        this.initUi();
    } 
    initUi()
    {   

    }
    updateProgress()
    { 
    }
}
//控制器
@ccclass
export default class LaunchCtrl extends cc.Component { 
    
    @property(cc.ProgressBar)
    prg_loading=null; 
    private model:Model = null;
    private view:View = null;
    private ui=null;
    onLoad (){ 
        //创建mvc模式中模型和视图
        //控制器
        ctrl = this;
        //数据模型
        this.model = new Model();
        //视图
        this.view = new View(this.model);
        //引用视图的ui  
        this.ui=this.view.ui; 
        //绑定ui操作
        this.connectUi();
    }
    connectUi()
    {

    }
    start () {
        ServerMgr.getInstance().loadLoacalSetting(this.loadDataCb.bind(this));
    } 

    update (dt) { 
 
    } 
    loadDataCb(){
        cc.director.loadScene('Login')
    }
}
