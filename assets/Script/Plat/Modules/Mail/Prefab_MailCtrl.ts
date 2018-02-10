import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import MailMgr from "../../GameMgrs/MailMgr"

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_MailCtrl;
//模型，数据处理
class Model extends BaseModel{
    public MailList : Array<any>;   // 邮件数据
	constructor()
	{
		super();
		this.updateMailData();
	}

    updateMailData () {
        this.MailList = MailMgr.getInstance().getMailData();
    }

    setReadMailID (emailID) {
        MailMgr.getInstance().setCurReadMailID(emailID);
    }
    getReadMailID () {
        return MailMgr.getInstance().getCurReadMailID();
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_ExitsMail : null,
		node_NotExitsMail : null,
		scroll_MailList : null,
		prefab_MailItem : null,
        CloseBtn : null,
		OkBtn : null,
		RefreshBtn : null,
		ReadAllBtn : null,
		GetAllBtn : null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.addGrayLayer();
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui.prefab_MailItem = ctrl.Prefab_MailItem;
		this.ui.scroll_MailList = ctrl.Scroll_MailList;
		this.ui.node_ExitsMail = ctrl.ExitsMail;
		this.ui.node_NotExitsMail = ctrl.NotExitsMail;
        this.ui.CloseBtn = ctrl.CloseBtn;
        this.ui.OkBtn = ctrl.OkBtn;
        this.ui.RefreshBtn = ctrl.RefreshBtn;
        this.ui.ReadAllBtn = ctrl.ReadAllBtn;
        this.ui.GetAllBtn = ctrl.GetAllBtn;
		this.ui.node_ExitsMail.active = true;
		this.ui.node_NotExitsMail.active = false;
	}

	updateMailItem () : void {
		let list = this.model.MailList;
		let content : any = this.ui.scroll_MailList.content;
		let width = content.height;
        content.height = 0;
        content.removeAllChildren(); // 进行刷新前先清除掉所有旧 item
		for (let i = 0; i < list.length; i ++) {
			let item = cc.instantiate(this.ui.prefab_MailItem);
			content.addChild(item);
			item.getChildByName("FriendMail").getComponent(cc.Label).string = list[i].name;
			item.getChildByName("MailDetails").getComponent(cc.Label).string = list[i].detail;
			item.name = list[i].id+"";
            let readbtn = item.getChildByName("btn_readed");
            ctrl.connect(G_UiType.image, readbtn, ctrl.ReadMail_cb, "id:"+list[i].id+"一封邮件");
			content.height += item.height + content.getComponent(cc.Layout).spacingY;
		}
        let mailItemNum = content.getChildren().length;
        this.ui.node_ExitsMail.active = mailItemNum;
        this.ui.node_NotExitsMail.active = !mailItemNum;
	}
}
//c, 控制
@ccclass
export default class Prefab_MailCtrl extends BaseControl {
	//这边去声明ui组件
	@property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
	CloseBtn : cc.Node = null;

	@property({
		tooltip : "确定按钮",
		type : cc.Node
	})
	OkBtn : cc.Node = null;
	
	@property({
		tooltip : "不存在邮件节点界面",
		type : cc.Node
	})
	NotExitsMail : cc.Node = null;
	
	@property({
		tooltip : "存在邮件节点界面",
		type : cc.Node
	})
	ExitsMail : cc.Node = null;
	
	@property({
		tooltip : "一键领取",
		type : cc.Node
	})
	GetAllBtn : cc.Node = null;
	
	@property({
		tooltip : "一键阅读",
		type : cc.Node
	})
	ReadAllBtn : cc.Node = null;
	
	@property({
		tooltip : "刷新列表",
		type : cc.Node
	})
	RefreshBtn : cc.Node = null;
	
	@property({
		tooltip : "邮件列表",
		type : cc.ScrollView
	})
	Scroll_MailList : cc.ScrollView = null;
	
	@property({
		tooltip : "邮件列表部件",
		type : cc.Prefab
	})
	Prefab_MailItem : cc.Prefab = null;

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
        this.initMvc(Model, View);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {
            'http.reqMailData' : this.updateMailItemView,
            'http.reqReadMail' : this.updateMailItemView,
            'http.reqReceiveMail' : this.updateMailItemView,
            'http.reqReadAllMail' : this.updateMailItemView,
            'http.reqReceiveAllMail' : this.updateMailItemView,
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events = {
            'http.reqMailData' : this.updateMailItemView.bind(this),
            'http.reqReadMail' : this.updateMailItemView.bind(this),
            'http.reqReceiveMail' : this.updateMailItemView.bind(this),
            'http.reqReadAllMail' : this.updateMailItemView.bind(this),
            'http.reqReceiveAllMail' : this.updateMailItemView.bind(this),
        }
	}
	//绑定操作的回调
	connectUi()
	{
        this.updateMailItemView();
		this.connect(G_UiType.image, this.ui.CloseBtn, this.CloseBtn_cb, "关闭按钮");
		this.connect(G_UiType.image, this.ui.OkBtn, this.CloseBtn_cb, "关闭按钮");
		this.connect(G_UiType.image, this.ui.RefreshBtn, this.RefreshBtn_cb, "刷新按钮");
		this.connect(G_UiType.image, this.ui.ReadAllBtn, this.ReadAllBtn_cb, "一键阅读按钮");
		this.connect(G_UiType.image, this.ui.GetAllBtn, this.GetAllBtn_cb, "一键领取按钮");
	}
	start () {
	}
	//网络事件回调begin
    updateMailItemView () {
        //TODO 用本地数据进行刷新 这里最终要在进行确认一下
        console.log("刷新邮件列表");
        this.model.updateMailData();
        this.view.updateMailItem();
    }
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private CloseBtn_cb (event) : void {
        // 关闭界面的时候静默刷新一次邮件数据
        MailMgr.getInstance().http_reqMailData();
		this.finish();
	}
	private RefreshBtn_cb (event) : void {
        MailMgr.getInstance().http_reqMailData();
	}
	private ReadAllBtn_cb (event) : void {
        MailMgr.getInstance().http_reqReadAllMail();
	}
	private GetAllBtn_cb (event) : void {
        MailMgr.getInstance().http_reqReceiveAllMail();
	}
	public ReadMail_cb (event) : void {
        this.model.setReadMailID(parseInt(event.parent.name));
		this.start_sub_module(G_MODULE.MailItem);
	}
	//end
}
