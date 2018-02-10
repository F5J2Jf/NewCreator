//大厅控制管理
import BaseModel from "../../Libs/BaseModel";
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MoreCtrl;
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
    ui={
        allBtnParent: ctrl.allBtnParent,
        btn_playMethod: ctrl.btn_playMethod,
        btn_record: ctrl.btn_record,
        btn_cusService: ctrl.btn_cusService,
        btn_setUp: ctrl.btn_setUp
    };
	//初始化ui
	initUi(){
	}
    //界面显示动画
    showAni (action) {
        this.ui.allBtnParent.runAction(action)
    }
    //界面关闭动画
    closeAni (action) {
        this.ui.allBtnParent.runAction(action)
    }
}
//c, 控制
@ccclass
export default class MoreCtrl extends BaseCtrl {
    //这边去声明ui组件
    @property({
        tooltip: "按钮父节点",
        type: cc.Node
    })
    allBtnParent: cc.Node = null;
    @property({
        tooltip: "玩法",
        type: cc.Node
    })
    btn_playMethod: cc.Node = null;

    @property({
        tooltip: "战绩",
        type: cc.Node
    })
    btn_record: cc.Node = null;

    @property({
        tooltip: "客服",
        type: cc.Node
    })
    btn_cusService: cc.Node = null;

    @property({
        tooltip: "设置",
        type: cc.Node
    })
    btn_setUp: cc.Node = null;
	//声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad () {
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View); 
        let action = cc.sequence(
            cc.hide(),
            cc.scaleTo(0.001, 0.1, 0.1),
            cc.show(),
            cc.scaleTo(0.3,1,1)
        )
        this.view.showAni(action)
	}

	//定义网络事件
	defineNetEvents () {}
	//定义全局事件
	defineGlobalEvents () {}
	//绑定操作的回调
    connectUi () {
        this.connect(G_UiType.button, this.ui.btn_playMethod, this.onClick_playMethod, "玩法")
        this.connect(G_UiType.button, this.ui.btn_record, this.onClick_record, "战绩")
        this.connect(G_UiType.button, this.ui.btn_cusService, this.onClick_cusService, "客服")
        this.connect(G_UiType.button, this.ui.btn_setUp, this.onClick_setUp, "设置")
        this.connect(G_UiType.button, this.node, this.onClick_close, "更多界面的背景")
	}
	//网络事件回调begin
 
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    private onClick_playMethod () {
        this.start_sub_module(G_MODULE.RuleDescription)
    }
    private onClick_record () {
    }
    private onClick_cusService () {
    }
    private onClick_setUp () {
        this.start_sub_module(G_MODULE.PlazaSetting)
    }
    private onClick_close () {
        let action = cc.sequence(
            cc.scaleTo(0.2, 0.1, 0.1),
            cc.callFunc(function(sender, data){
                ctrl.finish()
            })
        )
        this.view.closeAni(action)
    }
    //end
}
