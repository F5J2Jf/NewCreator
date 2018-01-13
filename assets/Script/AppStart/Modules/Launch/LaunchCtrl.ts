
const {ccclass, property} = cc._decorator;

let ctrl : LaunchCtrl;
//模型，数据处理
class Model {
    private state=0;
    private loadingprocess=0;
    private totalloading=100; 
    constructor()
    { 
        cc.director.setDisplayStats(false);
    }
    //进度条前进
    upgrade()
    {
        this.loadingprocess++;
    }
    //判断是否加载完成
    isFinishLoading()
    {
        return this.loadingprocess==this.totalloading;
    }
    getPercent()
    {
        return this.loadingprocess/this.totalloading;
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
        this.ui['prg_loading']=ctrl.prg_loading;
        this.ui['prg_loading'].progress =this.model.getPercent();

    }
    updateProgress()
    {
        this.ui['prg_loading'].progress =this.model.getPercent();
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

    } 

    update (dt) { 
        this.model.upgrade();
        this.view.updateProgress();
        if(this.model.isFinishLoading())
        { 
            cc.director.loadScene('Login')
        }
    } 
}
