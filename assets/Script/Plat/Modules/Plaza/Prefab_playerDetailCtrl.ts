/*
author: YOYO
日期:2018-01-13 16:02:51
玩家个人详细信息界面
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UserMgr from "../../GameMgrs/UserMgr";
import UiMgr from "../../GameMgrs/UiMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_playerDetailCtrl;
//模型，数据处理
class Model extends BaseModel{
    attr_realyName:string = null
    attr_address:string = null
    attr_iphone:number = null

    myInfo:{} = null

    dict_record:{} = null
    config_recordOffY:number = null
	constructor()
	{
        super();
    }
    
    updateMyInfo (){
        //测试
        this._test();

        this.myInfo = UserMgr.getInstance().getMyInfo();
    }
    //模拟
    private _test(){
        this.myInfo = {
            id:1,
            nickname : 'nickName',
            headurl : '',
            sex : 1,
            wincount: 1
        }
        //基础信息
        this.attr_realyName = 'realyName';
        this.attr_address = 'here';
        this.attr_iphone = 110;
        //游戏过程记录信息
        this.config_recordOffY = 20;
        this.dict_record = {
            1:{
                gameName:'majiang1',
                gameTimes:11,
                winTimes:1,
                winRate:(1/11).toFixed(2)
            },
            2:{
                gameName:'majiang2',
                gameTimes:11,
                winTimes:1,
                winRate:(1/11).toFixed(2)
            },
            3:{
                gameName:'majiang3',
                gameTimes:11,
                winTimes:1,
                winRate:(1/11).toFixed(2)
            },
            4:{
                gameName:'majiang4',
                gameTimes:11,
                winTimes:1,
                winRate:(1/11).toFixed(2)
            },
            5:{
                gameName:'majiang5',
                gameTimes:11,
                winTimes:1,
                winRate:(1/11).toFixed(2)
            },
            6:{
                gameName:'majiang6',
                gameTimes:11,
                winTimes:1,
                winRate:(1/11).toFixed(2)
            },
            7:{
                gameName:'majiang7',
                gameTimes:11,
                winTimes:1,
                winRate:(1/11).toFixed(2)
            }
        }
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        lab_id:null,
        lab_nickName:null,
        lab_realyName:null,
        lab_address:null,
        lab_iphone:null,
        node_sexMan:null,
        node_sexWomen:null,
        node_recordContent:null,
        Prefab_playerDetailCell:null,
        node_img_head:null
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
        this.ui.lab_id = ctrl.lab_id;
        this.ui.lab_nickName = ctrl.lab_nickName;
        this.ui.lab_realyName = ctrl.lab_realyName;
        this.ui.lab_address = ctrl.lab_address;
        this.ui.lab_iphone = ctrl.lab_iphone;
        this.ui.node_sexMan = ctrl.node_sexMan;
        this.ui.node_sexWomen = ctrl.node_sexWomen;
        this.ui.node_recordContent = ctrl.node_recordContent;
        this.ui.Prefab_playerDetailCell = ctrl.Prefab_playerDetailCell;
        this.ui.node_img_head = ctrl.node_img_head;
    }

    updateMyInfo (){
        this.updateID();
        this.updateNickName();
        this.updateRealyName();
        this.updateSex();
        this.updateAddress();
        this.updateIphone();
        this.updateHead();

        this.updateScroll();
    }
    
    private updateID(){
        this.ui.lab_id.string = this.model.myInfo.id;
    }
    private updateNickName(){
        this.ui.lab_nickName.string = this.model.myInfo.nickname;
    }
    private updateRealyName(){
        this.ui.lab_realyName.string = this.model.attr_realyName;
    }
    private updateAddress(){
        this.ui.lab_address.string = this.model.attr_address;
    }
    private updateIphone(){
        this.ui.lab_iphone.string = this.model.attr_iphone;
    }
    //1man, 2womon, 3保密
    private updateSex(){
        switch(this.model.myInfo.sex){
            case 1:
                //man
                this.ui.node_sexMan.children[0].active = true;
                this.ui.node_sexWomen.children[0].active = false;
                break;
            case 2:
                //women
                this.ui.node_sexMan.children[0].active = false;
                this.ui.node_sexWomen.children[0].active = true;
                break;
            case 3:
                //protected
                this.ui.node_sexMan.children[0].active = false;
                this.ui.node_sexWomen.children[0].active = false;
                break;
        }
    }
    private updateHead (){
        UiMgr.getInstance().setUserHead(this.ui.node_img_head, this.model.myInfo.headid, this.model.myInfo.headurl);
    }

    //滚动层
    private updateScroll (){
        let dict = this.model.dict_record;
        let value,
            index = 0,
            curNode,
            offY = this.model.config_recordOffY,
            curContentHeight;
        for(let key in dict){
            value = dict[key];
            curNode = this._addOneLine(value.gameName, value.gameTimes, value.winTimes, value.winRate);
            curNode.y = -(curNode.height/2 + (curNode.height/2 + offY) * index);
            index += 1;
        }
        curContentHeight = (curNode.height + offY) * index;
        this._resetContentSize(curContentHeight);
    }

    //增加一行
    private _addOneLine (str1:string,str2:string,str3:string,str4:string){
        let lineNode = cc.instantiate(this.ui.Prefab_playerDetailCell);
        lineNode.parent = this.ui.node_recordContent;

        let labNodes = lineNode.children;
        labNodes[0].getComponent(cc.Label).string = str1;
        labNodes[1].getComponent(cc.Label).string = str2;
        labNodes[2].getComponent(cc.Label).string = str3;
        labNodes[3].getComponent(cc.Label).string = str4;
        return lineNode
    }

    private _resetContentSize (curHeight:number){
        this.ui.node_recordContent.height = curHeight;
    }
}
//c, 控制
@ccclass
export default class Prefab_playerDetailCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property(cc.Node)
    node_close:cc.Node = null

    @property(cc.Label)
    lab_id:cc.Label = null

    @property(cc.Label)
    lab_nickName:cc.Label = null

    @property(cc.Label)
    lab_realyName:cc.Label = null

    @property(cc.Label)
    lab_address:cc.Label = null

    @property(cc.Label)
    lab_iphone:cc.Label = null

    @property(cc.Node)
    node_sexMan:cc.Node = null
    @property(cc.Node)
    node_sexWomen:cc.Node = null

    @property(cc.Node)
    node_btn_nickName:cc.Node = null

    @property(cc.Node)
    node_btn_realyName:cc.Node = null

    @property(cc.Node)
    node_btn_address:cc.Node = null

    @property(cc.Node)
    node_btn_iphone:cc.Node = null

    @property(cc.Node)
    node_recordContent:cc.Node = null

    @property(cc.Node)
    node_img_head:cc.Node = null

    @property(cc.Prefab)
    Prefab_playerDetailCell:cc.Prefab = null;
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
        this.n_events = {
            'http.reqMyInfo' : this.http_reqMyInfo
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image,this.node_close,this.node_close_cb,"点击关闭");
        this.connect(G_UiType.image,this.node_btn_nickName,this.node_btn_nickName_cb,"点击昵称");
        this.connect(G_UiType.image,this.node_btn_realyName,this.node_btn_realyName_cb,"点击实名");
        this.connect(G_UiType.image,this.node_btn_address,this.node_btn_address_cb,"点击地址");
        this.connect(G_UiType.image,this.node_btn_iphone,this.node_btn_iphone_cb,"点击电话");
        // this.connect(G_UiType.image,this.node_sexMan,this.node_sexMan_cb,"点击性别男");
        // this.connect(G_UiType.image,this.node_sexWomen,this.node_sexWomen_cb,"点击性别女");
	}
	start () {
        this.updateInfo();
	}
    //网络事件回调begin
    
    private http_reqMyInfo (msg){
        this.updateInfo();
    }

	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    private node_close_cb(){
        this.finish();
    }
    private node_btn_nickName_cb(){
        console.log('node_btn_nickName_cb')
    }
    private node_btn_realyName_cb(){
        console.log('node_btn_realyName_cb')
    }
    private node_btn_address_cb(){
        console.log('node_btn_address_cb')
    }
    private node_btn_iphone_cb(){
        console.log('node_btn_iphone_cb')
    }
    // private node_sexMan_cb(){
    //     console.log('node_sexMan_cb')
    //     this.view.chooseSex(1);
    // }
    // private node_sexWomen_cb(){
    //     console.log('node_sexWomen_cb')
    //     this.view.chooseSex(2);
    // }
    //end
    
    public updateInfo (){
        this.model.updateMyInfo();
        this.view.updateMyInfo();
    }
}