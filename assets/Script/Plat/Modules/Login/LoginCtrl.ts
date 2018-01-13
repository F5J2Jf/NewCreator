import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import UiMgr from "../../GameMgrs/UiMgr";
import LoginMgr from "../../GameMgrs/LoginMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
//MVC编码示范,
const {ccclass, property} = cc._decorator;
let ctrl : LoginCtrl;
//模型，数据处理
class Model extends BaseModel {
    private username=''
    private password=''
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
    initUi()
    {
        this.ui['btn_phone_login']=ctrl.btn_phone_login;
        this.ui['btn_visitor_login']=ctrl.btn_visitor_login;
    }
}
//c, 控制
@ccclass
export default class LoginCtrl extends BaseCtrl {
    //这边去声明ui组件
    @property(cc.Node)
    btn_visitor_login = null;
    @property(cc.Node)
    btn_phone_login = null; 
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
        this.n_events={
            'connector.entryHandler.enterPlat':this.connector_entryHandler_enterPlat,
        }
    }
    //定义全局事件
    defineGlobalEvents()
    {

    } 
    //绑定操作的回调
    connectUi()
    {  
        this.connect(G_UiType.image,this.ui.btn_visitor_login,this.btn_visitor_login_cb,'游客登录');
        this.connect(G_UiType.image,this.ui.btn_phone_login,this.btn_phone_login_cb,'手机登录');
    }
    start () {
    }
    //网络事件回调begin
    connector_entryHandler_enterPlat(msg)
    {
        //进入加载页面
        this.start_module(G_MODULE.Plaza); 
    }
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    btn_visitor_login_cb(node,event)
    {
        //去登录服务器
        var msg={
            'username':'test1',
            'password':'test1'
        }
        LoginMgr.getInstance().reqLogin(msg); 
    } 
    btn_phone_login_cb(node,event)
    { 
        this.start_sub_module(G_MODULE.UserLogin); 
    }
    //end
}
