import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import RoomMgr from "../../GameMgrs/RoomMgr";
import VerifyMgr from "../../GameMgrs/VerifyMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import Prefab_GoldModeCtrl from "./Prefab_GoldModeCtrl";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : NodeRightCtrl;
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
        btn_createRoom:ctrl.CreateRoom,
        btn_joinRoom:ctrl.JoinRoom,
        btn_club:ctrl.Club,
        btn_match:ctrl.Match
	};
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		
	}
}
//c, 控制
@ccclass
export default class NodeRightCtrl extends BaseControl {
	//这边去声明ui组件
    @property({
		tooltip : "创建房间按钮",
		type : cc.Node
	})
    CreateRoom:cc.Node = null;

    @property({
		tooltip : "加入房间按钮",
		type : cc.Node
	})
    JoinRoom : cc.Node = null;

    @property({
        tooltip : "俱乐部",
        type : cc.Node
    })
    Club:cc.Node = null;

    @property({
        tooltip : "比赛",
        type : cc.Node
    })
    Match : cc.Node = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
    
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
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.button,this.ui.btn_createRoom,this.CreateRoom_cb,'创建房间');
        this.connect(G_UiType.button,this.ui.btn_joinRoom,this.JoinRoomBtn_cb,'加入房间');
        this.connect(G_UiType.button,this.ui.btn_club,this.Clud_cb,'俱乐部');
        this.connect(G_UiType.button,this.ui.btn_match,this.Match_cb,'比赛');
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private JoinRoomBtn_cb (event) {
		this.start_sub_module(G_MODULE.joinRoom);
	}

	private CreateRoom_cb (event) {
		this.start_sub_module(G_MODULE.createRoom);
    }
    private Match_cb (event) {
        this.start_sub_module(G_MODULE.GoldMode, (uiComp:Prefab_GoldModeCtrl)=>{
            //HardCode_ 写死，牛牛gameid是4
            uiComp.setGameID(4);
        });
    }
	private Clud_cb (event) {
        this.start_sub_module(G_MODULE.GoldMode, (uiComp:Prefab_GoldModeCtrl)=>{
            //HardCode_ 写死，麻将gameid是1
            uiComp.setGameID(1);
        });
	}
	//end
}
