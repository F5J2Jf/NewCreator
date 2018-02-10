/*
author: Justin
日期:2018-01-16 16:57:41
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_RoomSettingCtrl;
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		progress_Music : null,
		progress_Effect : null,
		slide_Effect : null,
		slide_Music : null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui.progress_Music = ctrl.MusicProgress;
		this.ui.progress_Effect = ctrl.EffectProgress;
		this.ui.slide_Music = ctrl.Music;
		this.ui.slide_Effect = ctrl.Effect;
		this.ui.progress_Effect.progress = this.ui.slide_Effect.progress;
		this.ui.progress_Music.progress = this.ui.slide_Music.progress;
	}
}
//c, 控制
@ccclass
export default class Prefab_RoomSettingCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
	CloseBtn : cc.Node = null;

	@property({
		tooltip : "方言类型:普通话",
		type : cc.Node
	})
	MandarinLanguage : cc.Node = null;

	@property({
		tooltip : "方言类型:地方话",
		type : cc.Node
	})
	LocalLanguage : cc.Node = null;

	@property({
		tooltip : "音乐",
		type : cc.Slider
	})
	Music : cc.Slider = null;

	@property({
		tooltip : "音效",
		type : cc.Slider
	})
	Effect : cc.Slider = null;

	@property({
		tooltip : "音乐进度条",
		type : cc.ProgressBar
	})
	MusicProgress : cc.ProgressBar = null;

	@property({
		tooltip : "音效进度条",
		type : cc.ProgressBar
	})
	EffectProgress : cc.ProgressBar = null;

	@property({
		tooltip : "桌面版本2D",
		type : cc.Node
	})
	DesktopModeTwo : cc.Node = null;

	@property({
		tooltip : "桌面版本3D",
		type : cc.Node
	})
	DesktopModeThree : cc.Node = null;

	@property({
		tooltip : "经典色",
		type : cc.Node
	})
	ClassicsColor : cc.Node = null;

	@property({
		tooltip : "蓝色",
		type : cc.Node
	})
	BlueColor : cc.Node = null;

	@property({
		tooltip : "绿色",
		type : cc.Node
	})
	GreenColor : cc.Node = null;

	@property({
		tooltip : "托管",
		type : cc.Node
	})
	HostingBtn : cc.Node = null;

	@property({
		tooltip : "退出游戏",
		type : cc.Node
	})
	ExitGameBtn : cc.Node = null;
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
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.MandarinLanguage, this.MandarinLanguage_cb, "普通话");
		this.connect(G_UiType.image, this.LocalLanguage, this.LocalLanguage_cb, "地方话");
		this.connect(G_UiType.image, this.DesktopModeTwo, this.DesktopModeTwo_cb, "桌面版2d");
		this.connect(G_UiType.image, this.DesktopModeThree, this.DesktopModeThree_cb, "桌面版3d");
		this.connect(G_UiType.image, this.ClassicsColor, this.ClassicsColor_cb, "经典色");
		this.connect(G_UiType.image, this.BlueColor, this.BlueColor_cb, "蓝色");
		this.connect(G_UiType.image, this.GreenColor, this.GreenColor_cb, "绿色");
		this.connect(G_UiType.image, this.HostingBtn, this.HostingBtn_cb, "托管");
		this.connect(G_UiType.image, this.ExitGameBtn, this.ExitGameBtn_cb, "退出游戏");
		this.connect(G_UiType.image, this.CloseBtn, this.CloseBtn_cb, "关闭按钮");
		this.Music.node.on("slide", this._onMusic.bind(this));
		this.Effect.node.on("slide", this._onEffect.bind(this));
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private MandarinLanguage_cb () : void {
		
	}
	private LocalLanguage_cb () : void {

	}
	private DesktopModeTwo_cb () : void {

	}
	private DesktopModeThree_cb () : void {

	}
	private ClassicsColor_cb () : void {

	}
	private BlueColor_cb () : void {

	}
	private GreenColor_cb () : void {

	}
	private HostingBtn_cb () : void {

	}
	private ExitGameBtn_cb () : void {

	}
	private _onMusic (event) : void {
		var slider = event.detail;
		this.MusicProgress.progress = slider.progress;
	}
	private _onEffect (event) : void {
		var slider = event.detail;
		this.EffectProgress.progress = slider.progress;
	}
	private CloseBtn_cb () : void {
		this.finish();
	}
	//end
}