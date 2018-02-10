import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";

/*
author: TK
日期:2018-02-06 16:02:51
总结算
*/
 

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_RoomResultLayerTtlCtrl;
//模型，数据处理
class Model extends BaseModel{
    gameResultData:{} = null

	constructor()
	{
        super();
    }
    
    updateData (data){
    	gameResultData = data
    }
   
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        btn_ztj:null,
        btn_mjjf:null,
        btn_share:null,
        btn_exit:null
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
        this.ui.btn_ztj = ctrl.btn_ztj;
        this.ui.btn_mjjf = ctrl.btn_mjjf;
        this.ui.btn_share = ctrl.btn_share;
        this.ui.btn_exit = ctrl.btn_exit;
    }

}
//c, 控制
@ccclass
export default class Prefab_RoomResultLayerTtlCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property(cc.Node)
    btn_ztj:cc.Node = null

    @property(cc.Node)
    btn_mjjf:cc.Node = null

    @property(cc.Node)
    btn_share:cc.Node = null

    @property(cc.Node)
    btn_exit:cc.Node = null

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
        // this.n_events = {
        //     'http.reqMyInfo' : this.http_reqMyInfo
        // }
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image,this.btn_ztj,this.btn_ztj_cb,"总统计");
        this.connect(G_UiType.image,this.btn_mjjf,this.btn_mjjf_cb,"每局积分");
        this.connect(G_UiType.image,this.btn_share,this.btn_share_cb,"分享");
        this.connect(G_UiType.image,this.btn_exit,this.btn_exit_cb,"退出");
	}
	start () {
	}
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    private btn_exit_cb(){
        this.finish();
    }
    private btn_ztj_cb(){
        console.log('btn_ztj_cb')
    }
    private btn_mjjf_cb(){
        console.log('btn_mjjf_cb')
    }
    private btn_share_cb(){
        console.log('btn_share_cb')
    }
}