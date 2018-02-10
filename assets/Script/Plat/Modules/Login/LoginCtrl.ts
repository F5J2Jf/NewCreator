import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import UiMgr from "../../GameMgrs/UiMgr";
import LoginMgr from "../../GameMgrs/LoginMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import WxSdkMgr from "../../SdkMgrs/WxSdk";
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
    ui={
        btn_phone_login:null,
        btn_visitor_login:null,
        testBtns:[],
    }
    constructor(model){
        super(model);
        this.node=ctrl.node;  
        this.initUi();
    } 
    initUi()
    {
        this.ui.btn_phone_login=ctrl.btn_phone_login;
        this.ui.btn_visitor_login=ctrl.btn_visitor_login;
        
        //测试按钮
        this.showTestBtns();
        //this.addToggl1e();
    }
    showTestBtns()
    {
        let startx=-400;
        let starty=-200;
        let interX=140;
        let interY=60;
        let linecount=6;
        for(var i = 0;i<10;++i)
        { 
            let curNode = new cc.Node();
            let curLab = curNode.addComponent(cc.Label);
            curLab.string=`test${i+1}`;
            curNode.parent = this.node;
            curNode.position=cc.p(startx+(i%linecount)*interX,starty-interY*parseInt(i/linecount));
            this.ui.testBtns.push(curNode)
        }
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
        
        for(let i = 0;i<this.ui.testBtns.length;++i)
        {
            var item=this.ui.testBtns[i];
            item.on(cc.Node.EventType.TOUCH_END, function (event) {
                //加入操作日志
            //去登录服务器
            var msg={
                'username':`test${i+1}`,
                'password':`test${i+1}`,
            }  
            LoginMgr.getInstance().reqLogin(msg); 
            },this);
        }
    }
    start () {
    }
    //网络事件回调begin
    connector_entryHandler_enterPlat(msg)
    {
        //进入加载页面
        this.start_module(G_MODULE.LoadingPlat); 
    }
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
 
    btn_visitor_login_cb(node,event)
    {
        //去登录服务器
        // var msg={
        //     'username':'test1',
        //     'password':'test1'
        // }
        // LoginMgr.getInstance().reqLogin(msg); 
        var getRandomArea=function (downNum:number, upNum:number) {
            return parseInt(Math.random() * (upNum - downNum + 1) + downNum + '');
        } 
        var msg={
            'username': getRandomArea(100,1000000),
            'password': getRandomArea(100,1000000),
        }
        LoginMgr.getInstance().reqRegister(msg);
    } 
    btn_phone_login_cb(node,event)
    { 
        // this.start_sub_module(G_MODULE.UserLogin); 
        WxSdkMgr.getInstance().InitWXSdk(this._wechatLogin.bind(this));
    }
    //微信登录成功回调
    _wechatLogin (data) : void {
        
    }
    //end
}
