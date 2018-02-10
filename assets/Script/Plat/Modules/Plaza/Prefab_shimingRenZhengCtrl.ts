/*
author: tk
日期:2018-02-3 11:26
玩家个人详细信息界面
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import FrameMgr from "../../GameMgrs/FrameMgr";

const {ccclass, property} = cc._decorator;
let ctrl : Prefab_playerDetailCtrl;

//模型，数据处理
class Model extends BaseModel{
    realName:string = null
    PersonID:string = null
	constructor()
	{
        super();
    }

}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        node_submit:null,
        node_cancel:null,
        realName:null,
        PersonID:null
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
        this.ui.node_submit = ctrl.node_submit;
        this.ui.node_cancel = ctrl.node_cancel;
        this.ui.realName = ctrl.realName;
        this.ui.PersonID = ctrl.PersonID;
    }
}

//c, 控制
@ccclass
export default class Prefab_playerDetailCtrl extends BaseCtrl {

    @property(cc.Node)
    node_submit:cc.Node = null

    @property(cc.Node)
    node_cancel:cc.Node = null

	@property({
		tooltip : "真实姓名",
		type : cc.EditBox
	})
	realName : cc.EditBox = null;

	@property({
		tooltip : "身份证号",
		type : cc.EditBox
	})
	PersonID : cc.EditBox = null;
   
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
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
		this.connect(G_UiType.image, this.ui.node_cancel, this.node_cancel_cb, '点击取消');
		this.connect(G_UiType.image, this.ui.node_submit, this.node_submit_cb, '提交');
		this.connect(G_UiType.edit, this.ui.realName.node, this.realName_cb, '真实姓名');
		this.connect(G_UiType.edit, this.ui.PersonID.node, this.PersonID_cb, '身份证号');
	}
	start () {
	}
    // //网络事件回调begin
    // //玩家信息更新
    // private http_reqMyInfo (msg){
    // }

	/**
	 * 点击关闭
	 * @param event 
	 */
	private node_cancel_cb (event) : void {
		this.finish();
    }
    //提交
    private node_submit_cb(){
        if (this.model.realName == null || this.model.realName == '' ) {
            console.log("请填写真实名");
            FrameMgr.getInstance().showTips(cc.p(0,0), cc.color(220,24,63), "Arial", 35, "请填写真实名", 2, ()=>{
            //确认领取
            console.log("请填写真实名1");
            });
            return;
        }
        if (this.model.PersonID == null || this.model.PersonID == '') {
            console.log("请填写身份证");
            FrameMgr.getInstance().showTips(cc.p(0,0), cc.color(220,24,63), "Arial", 35, "请填写身份证!", 2, ()=>{
            //确认领取
            console.log("请填写身份证!");
            });
            return;
        }
        console.log(this.model.realName);
        console.log(this.model.PersonID);
        console.log('node_submit_cb');
    }
    //真实姓名
    private realName_cb(event){
        console.log('realName_cb');
        console.log(event.target.getComponent(cc.EditBox).string)
        this.model.realName = event.target.getComponent(cc.EditBox).string
    }
    //身份证号
    private PersonID_cb(event){
        console.log('PersonID_cb');
        this.model.PersonID = event.target.getComponent(cc.EditBox).string
    }
    
}
