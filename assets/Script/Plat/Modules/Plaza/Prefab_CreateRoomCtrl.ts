/*
author: Justin
日期:2018-01-13 16:32:58
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import RoomMgr from "../../GameMgrs/RoomMgr";

import GameId from "../../CfgMgrs/GameIdCfg";
import BetCfg from "../../CfgMgrs/BetCfg"

import {g_deepClone} from "../../Libs/Gfun";
import Prefab_GoldModeCtrl from "./Prefab_GoldModeCtrl";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_CreateRoomCtrl;
//模型，数据处理
class Model extends BaseModel{
	GameType : number;
	//左边子游戏列表的
	private _leftBtnName = null;
	private _roomInfo=null;					

    private _gameIds=null;
	//设置房间配置的位置
	
	constructor()
	{
		super();
		this._gameIds= GameId.getInstance().getGameIds();
		this._roomInfo=BetCfg.getInstance().getFangKaCfg(1);	//根据游戏ID得到数据
		this._roomInfo=g_deepClone(this._roomInfo);				//深拷贝
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	private _moreGame = null;
	private _moreItem = null;
	private _showItemNum = null
	private _nodeHeight = null			
	private _nodeWidth = null
	private _nodeOffX = null
    private _nodeOffY = null
	private _subGameRowNum = null
	private _roomInfoRowNum = null			//行
	private _startPosX = null	
	private _roomListPosX = null
	private _roomListPosY = null
	private g_index= null;
	private _leftBtn = null; 
	private _GrayLayer =null;
	private _Parten =null;
	private _pageNum =null;
	private _obj = null;
	private _subGameType = null;
	ui={
		//在这里声明ui
		prefab_moreItem:null,
		prefab_editBox:null,
		prefab_discount:null,
		prefab_free:null,
		btn_majong:null,
		btn_poker:null,
		btn_chess:null,
		btn_close : null,
		btn_crtete : null,
		btn_defaultRule:null,
		btn_rule:null,
		node_roomInfoList : null,	//房间信息列表
		node_leftBtnsList : null,	//左游戏列表
		prefab_leftBtn : null,
		prefab_toggleGroup :null,
		prefab_toggle: null,
		prefab_label : null,
		prefab_checkToggle : null,
		prefab_textBox:null,
		prefab_scrollView:null,
		prefab_dropDownBox:null,
		prefab_layout:null,
		prefab_page_1: null,
		prefab_page_2:null,

		compbuttons:[],				//存的按钮
		complayouts:[],
		
	};

	node=null;
	constructor(model){
		super(model);
		this.node= ctrl.node;

		this._subGameType = 0;
		this._nodeOffX = 25;			//间隔				
        this._nodeOffY = 65;			//间隔
		this._showItemNum = 1;	
		this._subGameRowNum = 0;		
		this._roomInfoRowNum = 0;
		this._leftBtn = new Array(); 

		this.initUi();
		this.addGrayLayer();
		this.setStartPosX(-this.ui.node_roomInfoList.width/2-20);
		this.addSubGameList();
		this.addRoomInfo();
	}
	//初始化ui
	initUi()
	{	
		this.ui.prefab_moreItem = ctrl.MoreItemBtn;
		this.ui.prefab_editBox = ctrl.EditBox;
		this.ui.prefab_discount = ctrl.Discount;
		this.ui.prefab_free = ctrl.Free;
		this.ui.btn_majong = ctrl.MajongBtn;
		this.ui.btn_poker = ctrl.PokerBtn;
		this.ui.btn_chess = ctrl.ChessBtn;
		this.ui.btn_close = ctrl.CloseBtn;
		this.ui.btn_crtete = ctrl.CreateBtn;
		this.ui.node_leftBtnsList = ctrl.LeftBtnNode;
		this.ui.node_roomInfoList = ctrl.RoomInfoNode;
		this.ui.prefab_leftBtn = ctrl.LeftBtn;
		this.ui.prefab_label = ctrl.Label;
		this.ui.prefab_toggle  = ctrl.Toggle;
		this.ui.prefab_toggleGroup = ctrl.ToggleGroup;
		this.ui.prefab_checkToggle = ctrl.CheckToggle;
		this.ui.prefab_scrollView = ctrl.ScrollView;
		this.ui.prefab_textBox = ctrl.TextBox;
		this.ui.prefab_dropDownBox = ctrl.DropDownBox;
		this.ui.prefab_layout = ctrl.Layout;
		this.ui.prefab_page_1 = ctrl.Page_1;
		this.ui.prefab_page_2 = ctrl.Page_2;
		this.ui.btn_defaultRule = ctrl.DefaultRuleBtn;
		this.ui.btn_rule = ctrl.RuleBtn;
	}
	//创建一个点击层，点击取消列表的出现
	addLayoutGrayLayer (parent){
		this._GrayLayer = new cc.Node();
		this._GrayLayer.parent =parent;
		this._GrayLayer.width = parent.width;
		this._GrayLayer.height = parent.height;
		this._GrayLayer.position = cc.p(0,-parent.height/2);
		this._GrayLayer.color = cc.Color.BLACK;
		this._GrayLayer.opacity = 0;
		this._GrayLayer.on(cc.Node.EventType.TOUCH_START, () => {
			this.removeLayout();
			this._GrayLayer.destroy();
		}, this);
	}
	removeLayoutGrayLayer(){
		this._GrayLayer.destroy();
	}
	setSubGameType(subGameType){
		this._subGameType =subGameType;
	}
	//增加房间信息列表行数
	addRoomInfoRowNum(curNum:number=1){
		this._roomInfoRowNum += curNum;
	};
	subRoomInfoRowNum(curNum:number =1){
		this._roomInfoRowNum -=curNum;
	}
	//增加子游戏名字列表行数
	addItem(curNum:number=1){
        this._subGameRowNum += curNum;
	}
	
	initSize(curNode: cc.Node){		//可重复使用
            this._nodeWidth = curNode.width;
	}
	//设置一开始房间配置布局中第一个元素放的位置
	setStartPosX(curPosX:Number){
		this._startPosX = curPosX;
	}
	//游戏越多，框就越大。
	getContentHeight (){					//设置子游戏列表的contenHeight
        let contentH:number = this._subGameRowNum * (this._nodeHeight+50);
        return contentH;
	}
	//得到子游戏列表位置
	getItemPos (){				//这边设置子游戏列表的位置
		var posX,
		posY;
		posX = 0;
		posY = -this._subGameRowNum * (this._nodeHeight);
		return cc.p(posX, posY);
	}
	//得到每个元素放在RoomList中的位置
	getRoomListPos (){
		//这里如果行变了，则X重置
        this._roomListPosX += this._nodeWidth + this._nodeOffX;
        this._roomListPosY = -this._roomInfoRowNum * (this._nodeOffY) - this._nodeOffY/2;
		return cc.p( this._roomListPosX, this._roomListPosY);
	}
	//根据文字的大小改变节点的大小
	initTitleSize(node:cc.Node,string:string){
		if(string.length >= 5){
			this._nodeWidth =node.width+(string.length-5)*10;
		}else {
			this._nodeWidth = node.width;
		}
	}
	//得到单选按钮的位置
	initBtnsPos(nodeSel:cc.Node,node:cc.Node){
		let Posx
		Posx = node.x+nodeSel.width;
		return cc.p(Posx);
	}
	//得到单选框的位置，因为要让他居中，就不用改变他的x.而getRoomListPos()会改变x
	getToggleGroupPosY(node:cc.Node){
		
		let PosY = node.y;
		return PosY;
	}
	//得到单选框的位置，因为要让他居中，就不用改变他的x.而getRoomListPos()会改变x
	setFistNodeH(pos:Number){
		this._nodeHeight = pos;
	}
	//设置this._roomListPosX
	setRoomListPosX(){
		this._roomListPosX = this._startPosX;
	}
	//创建更多游戏预制节点
	createMoreGame(){
		this._moreGame = cc.instantiate(this.ui.prefab_leftBtn);
		if(this._leftBtn.length= 0 ){
			this.setFistNodeH(this._moreGame.height);
		}
		this.addItem();
		let labelNode = this._moreGame.getChildByName("Label");
		let label = labelNode.getComponent(cc.Label);
		label.string ="更多游戏";
		this._moreGame.parent = this.ui.node_leftBtnsList;
		this._moreGame.position = this.getItemPos();
	}
	//根据配表把子游戏按钮添加到node_leftBtnsList中
	addLeftBtnList(){
		if(this.ui.node_leftBtnsList.children[0]){
			this.removeSubGameList();
		}
		this._subGameRowNum = 0;
		for(let i=0;i< this.model._gameIds.length;++i){
			let curNode:cc.Node = cc.instantiate(this.ui.prefab_leftBtn);
			let label = curNode.getChildByName("Label");
			let temp = label.getComponent(cc.Label);
			temp.string = this.model._gameIds[i].name;
			this._leftBtn.push(curNode);
			this.initSize(curNode);	
			this.setFistNodeH(curNode.height);
			curNode.parent = this.ui.node_leftBtnsList;
			this.addItem();
			curNode.position = this.getItemPos();
			this._resetContentSize();
			switch(i){
				case 0:
				break;
				case 1:
				let DiscountNode =cc.instantiate(this.ui.prefab_discount);
				DiscountNode.parent = curNode;
				DiscountNode.x = -curNode.width/2;
				break;
				case 2:
				let FreeNode =cc.instantiate(this.ui.prefab_free);
				FreeNode.parent = curNode;
				FreeNode.x = -curNode.width/2;
				break;
				case 3:
				break;
			}
		}
	}
	//设置contentSize
	_resetContentSize (){	//没有这个content有时候会小于View就会呈现不用滚动的情况
        let contentH = this.getContentHeight();
        this.ui.node_leftBtnsList.height = contentH;
	}
	addSubGameList(){		//根据游戏类型生成游戏列表
		if(this._subGameType == 0){
			this.removeSubGameList();
			this.addLeftBtnList();
		}else if(this._subGameType == 1){
			this.removeSubGameList();
		}else if(this._subGameType == 2){
			this.removeSubGameList();
			this.createMoreGame();
		}
	}
	removeSubGameList(){
		for(let i=0; i< this.ui.node_leftBtnsList.childrenCount; ){
			this.ui.node_leftBtnsList.children[i].removeFromParent();
			this._leftBtn.shift();
			if(this.ui.node_leftBtnsList.childrenCount==0){
				i++;
				this._subGameRowNum =0;
			}
		}
	}
	//移除列表  创一个消除一个，永远只有一个下拉框
	removeLayout(){	
		var layout= this.ui.complayouts[0];
		if (layout){
			this.ui.complayouts.shift();
			layout.removeFromParent();
		}
	}
	//创建列表视图
	createLayout(node,index,index2){
		//创建一个点击层
		let obj,
		parent;
		if(index<this.model._roomInfo.baseic.length){
			obj = this.model._roomInfo.baseic;
			parent = this.ui.prefab_page_1;
		}else if(index<this.model._roomInfo.baseic.length+this.model._roomInfo.more.length){
			obj = this.model._roomInfo.more;
			parent = this.ui.prefab_page_2;
		}
		this.addLayoutGrayLayer(parent);
		var LayoutNode = cc.instantiate(this.ui.prefab_layout);
		var Layout = LayoutNode.getChildByName("Layout");
		Layout.x = node.x+LayoutNode.width/2;
		Layout.y = node.y-LayoutNode.height/2-node.height/2;
		Layout.parent = node.parent;
		Layout.tag = index;
		this.ui.complayouts.push(Layout);
		for(let j=0; j<obj[index2].items.length; j++){
			//创建label
			let labelNode = cc.instantiate(this.ui.prefab_label);			//创建出来label预制体
			let label= labelNode.getChildByName("Label");
			let temp= label.getComponent(cc.Label);					//得到label标签
			temp.string = obj[index2].items[j].txt;
			labelNode.width = Layout.width;
			labelNode.parent = Layout;
		}
	}
	setParent(node:cc.Node){
		this._Parten = node;
	}
	//移除房间配置
	removeRoomInfo(page1,page2){
		if (page1) {
			for (let i = 0; i < page1.childrenCount;) {
				page1.children[i].removeFromParent();
				if (page1.childrenCount == 0) {
					i++;
				}
			}
		}
		if (page2) {
			for (let i = 0; i < page2.childrenCount;) {
				page2.children[i].removeFromParent();
				if (page2.childrenCount == 0) {
					i++;
				}
			}
		}
		if(this.ui.compbuttons){
			for(let i=0;i<this.ui.compbuttons.length;){
				this.ui.compbuttons.shift();
				if(this.ui.compbuttons.length == 0){
					i++;
				}
			}
		}
	}
	//添加创建房间配置
	addRoomInfo(){  
		this.removeRoomInfo(this.ui.prefab_page_1,this.ui.prefab_page_2);
		this.setParent(this.ui.prefab_page_1);
		this._roomInfoRowNum = 0;
		this._obj = this.model._roomInfo.baseic;
		let index = 0;
		let length = this.model._roomInfo.baseic.length+this.model._roomInfo.more.length;
		for(let i =0; i<length; i++){
			
			if (i === this.model._roomInfo.baseic.length) {
				this.setParent(this.ui.prefab_page_2);
				this._roomInfoRowNum = 0;
				this._obj = this.model._roomInfo.more;
				index = i-this.model._roomInfo.baseic.length;
			}
			//不换行重置X的值直接往后排版
			if(this._obj[index].type == "edit"&&index!=0 &&this._obj[index].type == this._obj[index-1].type){
				this.subRoomInfoRowNum();
			}else {
				this.setRoomListPosX();
			}
			//主标签
			let LabelNode = cc.instantiate(this.ui.prefab_label);	//创建出来label预制体
			let label= LabelNode.getChildByName("Label");
			let temp= label.getComponent(cc.Label);					//得到label标签
			temp.string = this._obj[index].title;			//改变标签string
			this.initTitleSize(LabelNode,temp.string);	
			this.setFistNodeH(LabelNode.height);
			LabelNode.position = this.getRoomListPos();
			if(this._obj[index].type == "edit"&&index!=0 &&this._obj[index].type == this._obj[index-1].type){
				LabelNode.x+=LabelNode.width;
			}
			LabelNode.parent =this._Parten;
			//单选框组
			if(this._obj[index].type =='radio'|| this._obj[index].type == 'check'){
				var groupNode = cc.instantiate(this.ui.prefab_toggleGroup);		//创建出来预制体
				groupNode.y = this.getToggleGroupPosY(LabelNode);	//设置每个预制单选框的位置
				groupNode.parent = this._Parten;
				var group = groupNode.getComponent(cc.ToggleGroup);				//得到cc.ToggleGroup
				groupNode.zIndex = 1;
				this.ui.compbuttons.push(groupNode);
				for(let j=0; j<this._obj[index].items.length; j++){
					//文本框
					if(this._obj[index].type!=="select"){
						let textBoxNode = cc.instantiate(this.ui.prefab_textBox);
						textBoxNode.position = this.getRoomListPos();
						//console.log(`的位置"${textBoxNode.position}"`);
						let aLabel = textBoxNode.getChildByName("Label");					//得到label标签
						let temp1 = aLabel.getComponent(cc.Label);
						temp1.string = this._obj[index].items[j].txt;
						this.initTitleSize(textBoxNode, temp1.string);
						textBoxNode.parent = this._Parten;
					//单选按钮
					if(this._obj[index].type == "radio"){
						
						var toggleNode = cc.instantiate(this.ui.prefab_toggle);		//创建出来一个单选按钮节点
						toggleNode.parent = groupNode;
						toggleNode.position = this.initBtnsPos(toggleNode,textBoxNode);
						group.toggleItems.push(toggleNode.getComponent(cc.Toggle));
						toggleNode.getComponent(cc.Toggle).toggleGroup = group;//把3个节点挂在同一个组中
						}
					//复选按钮
					else if ( this._obj[index].type == "check"){
					
						var checktoggleNode = cc.instantiate(this.ui.prefab_checkToggle);		//创建出来一个单选按钮节点 
						checktoggleNode.parent = groupNode;
						checktoggleNode.position = this.initBtnsPos(checktoggleNode,textBoxNode);	
						}
					}
			    }
			}
			//下拉框
			else if (this._obj[index].type == "select") {
				
				var DropDownBox = cc.instantiate(this.ui.prefab_dropDownBox);
				var tempLabelNode = DropDownBox.getChildByName("Label");
				var tempLabel = tempLabelNode.getComponent(cc.Label);
				tempLabel.string = this._obj[index].items[0].txt;
				DropDownBox.parent = this._Parten;
				this.ui.compbuttons.push(DropDownBox);
				DropDownBox.position = this.getRoomListPos();
			}
			//输入框
			else if(this._obj[index].type == "edit"){
				let subLabel = cc.instantiate(this.ui.prefab_label);
				let slabel= subLabel.getChildByName("Label");
				let stemp= slabel.getComponent(cc.Label);					//得到label标签
				stemp.string = this._obj[index].des;			//改变标签string
				this.initTitleSize(subLabel,stemp.string);	
				subLabel.position = LabelNode.position;
				subLabel.y-=LabelNode.height/2;
				subLabel.parent = this._Parten;
				let EditBoxNode = cc.instantiate(this.ui.prefab_editBox);
				EditBoxNode.position =this.getRoomListPos();
				if(this._obj[index].type == "edit"&&index!=0 &&this._obj[index].type == this._obj[index-1].type){
					EditBoxNode.x+=LabelNode.width;
				}
				this.initSize(EditBoxNode);
				EditBoxNode.parent = this._Parten;
				this.ui.compbuttons.push(EditBoxNode);
			}
			this.addRoomInfoRowNum();
			index++;
		}
		this._moreItem = cc.instantiate(this.ui.prefab_moreItem);
		this._moreItem.position = this.getRoomListPos();
		this._moreItem.x = (-this.ui.node_roomInfoList.width/8);
		this._moreItem.parent = this._Parten;
	}
}
//c, 控制
@ccclass
export default class Prefab_CreateRoomCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip : "麻将",
		type : cc.Node
	})
	MajongBtn : cc.Node = null;

	@property({
		tooltip : "扑克",
		type : cc.Node
	})
	PokerBtn : cc.Node = null;

	@property({
		tooltip : "棋",
		type : cc.Node
	})
	ChessBtn : cc.Node = null;

	@property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
	CloseBtn : cc.Node = null;

	@property({
		tooltip : "创建按钮",
		type : cc.Node
	})
	CreateBtn : cc.Node = null;

	@property({
		tooltip : "子游戏列表",
		type : cc.Node
	})
	LeftBtnNode : cc.Node = null;

	@property({
		tooltip : "房间详情",
		type : cc.Node
	})
	RoomInfoNode : cc.Node = null;
	
	@property({
		tooltip : "子游戏预制体",
		type : cc.Prefab
	})
	LeftBtn : cc.Prefab = null;

	@property({
		tooltip : "房间详情标签",
		type : cc.Prefab
	})
	Label : cc.Prefab = null;

	@property({
		tooltip : "单选框",
		type : cc.Prefab
	})
	ToggleGroup : cc.Prefab = null;

	@property({
		tooltip : "单选按钮",
		type : cc.Prefab
	})
	Toggle : cc.Prefab = null;

	@property({
		tooltip : "复选按钮",
		type : cc.Prefab
	})
	CheckToggle : cc.Prefab = null;
	
	@property({
		tooltip : "文本框",
		type : cc.Prefab
	})
	TextBox : cc.Prefab = null;

	@property({
		tooltip : "滚动视图",
		type : cc.Prefab
	})
	ScrollView : cc.Prefab = null;
	
	@property({
		tooltip : "下拉框",
		type: cc.Prefab
	})
	DropDownBox : cc.Prefab = null;

	@property({
		tooltip:"布局",
		type : cc.Prefab
	})
	Layout : cc.Prefab = null; 

	@property({
		tooltip:"页面1",
		type : cc.Node
	})
	Page_1 : cc.Node = null; 
	@property({
		tooltip:"页面2",
		type : cc.Node
	})
	Page_2 : cc.Node = null; 

	@property({
		tooltip:"默认规则",
		type: cc.Node
	})
	DefaultRuleBtn :cc.Node = null;

	@property({
		tooltip: "说明",
		type: cc.Node
	})
	RuleBtn :cc.Node = null;
	
	@property({
		tooltip: "打折",
		type:cc.Prefab
	})
	Discount : cc.Prefab = null;

	@property({
		tooltip: "免费",
		type:cc.Prefab
	})
	Free : cc.Prefab = null;

	@property({
		tooltip: "输入框",
		type: cc.Prefab
	})
	EditBox : cc.Prefab = null;

	@property({
		tooltip: "更多选项",
		type:cc.Prefab
	})
	MoreItemBtn :cc.Prefab = null;
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
		this.connect(G_UiType.image, this.MajongBtn, this.Majong_cb, "麻将");
		this.connect(G_UiType.image, this.PokerBtn, this.Poker_cb, "扑克");
		this.connect(G_UiType.image, this.ChessBtn, this.Chess_cb, "棋类");
		this.connect(G_UiType.image, this.CloseBtn, this.CloseBtn_cb, "关闭按钮");
		this.connect(G_UiType.image, this.CreateBtn, this.CreateBtn_cb, "创建按钮");
		this.connect(G_UiType.image, this.DefaultRuleBtn, this.DefaultRule_cb, "默认规则按钮");
		this.connect(G_UiType.image, this.RuleBtn, this.Rule_cb, "游戏规则说明");
		this.connect(G_UiType.image, this.view._moreItem, this.moreItemBtn_cb, "更多选项");
		//this.connect(G_UiType.image, this.view._moreGame, this.moreGameBtn_cb, "更多选项");
		//绑定视图页面的所有绑定事件
		let length = this.model._roomInfo.baseic.length + this.model._roomInfo.more.length+1;
		for (let i = 0; i < this.ui.compbuttons.length; i++) {
			let group = this.ui.compbuttons[i];
			let item;
			if (i < this.model._roomInfo.baseic.length) {
				item = this.model._roomInfo.baseic[i];
			} else {
				item = this.model._roomInfo.more[i - this.model._roomInfo.baseic.length]
			}
			//复选框
			if (item.type == 'check') {
				for (let j = 0; j < group.childrenCount; j++) {
					let child = group.children[j];
					let compCheckToggleCb = function () {
						this.compCheckToggle_cb(i, j);
					}
					this.connect(G_UiType.image, child, compCheckToggleCb, "复选框");
				}
			}
			//单选框
			else if (item.type == 'radio') {
				for (let j = 0; j < group.childrenCount; j++) {
					let child = group.children[j];
					let compToggleCb = function () {
						this.compToggle_cb(i, j);
					}
					this.connect(G_UiType.image, child, compToggleCb, "单选框");
				}
			}
			//下拉选择
			else if (item.type == 'select') {
				let index;
				if (i >= this.model._roomInfo.baseic.length) {
					index = i - this.model._roomInfo.baseic.length;
				} else {
					index = i;
				}
				let selectCb = function () {
					this.select_cb(group, i, index);
				}
				this.connect(G_UiType.text, group, selectCb, "单选框");
			}
			else if(item.type == 'edit'){
				var node = this.view._Parten.getChildByName("Prefab_EditBox");
				var string = node.getComponent(cc.EditBox);
				var value = string.placeholder;
				item.value  = Number(value);
			 }
		}
		//子游戏列表
		for (let i = 0; i < this.view._leftBtn.length; i++) {
			let compBtnCb = function () {
				this.switchGame_cb(i);
			}
			this.connect(G_UiType.image, this.view._leftBtn[i], compBtnCb, "切换游戏");
		}
		//创建出来的视图里面Label的点击事件
		for (let i = 0; i < this.ui.complayouts.length; i++) {
			let layout = this.ui.complayouts[i];
			let index = layout.tag;
			let obj;
			if (index < this.model._roomInfo.baseic.length) {
				obj = this.model._roomInfo.baseic;
			} else if (index < this.model._roomInfo.baseic.length + this.model._roomInfo.more.length) {
				obj = this.model._roomInfo.more;
				index -= this.model._roomInfo.baseic.length;
			}
			for (let j = 0; j < layout.childrenCount; j++) {
				let LabelNode = layout.children[j].getChildByName("Label");
				let Label = LabelNode.getComponent(cc.Label);
				let string = Label.string;
				let layoutItemsCb = function () {
					this.layoutItems_cb(string, index, j, obj);
				}
				this.connect(G_UiType.image, layout.children[j], layoutItemsCb, "下拉框的选择");
			}
		}
	} 
	layoutItems_cb(string,index, j,obj){
		cc.log("点击到了0"+j);
		var Node = this.ui.compbuttons[this.view.g_index];
		var labelNode = Node.getChildByName("Label");
		var label = labelNode.getComponent(cc.Label);
		label.string = string;
		obj[index].sel=j; 
		this.view.removeLayout();
		this.view.removeLayoutGrayLayer();
	}
	//子游戏列表绑定事件
	switchGame_cb(index)
	{
		cc.log(index);
		//根据子游戏切换房间信息配置
		if(index == 0){
			this.view.addRoomInfo();
			this.connectUi();
		}else if(index == 1){
			this.view.removeRoomInfo(this.ui.prefab_page_1,this.ui.prefab_page_2);
		}else if(index == 2){

		}else if(index == 3){

		}
	}
	//单选框绑定事件
	compToggle_cb(Groupindex,index){				//node 文本框按钮
		let checkboxes=this.ui.compbuttons[Groupindex].children[index];
		checkboxes.sel =index;
		cc.log(checkboxes.sel);
	}
	//复选框绑定事件
	compCheckToggle_cb(Groupindex,index){
		let checkboxes=this.ui.compbuttons[Groupindex].children[index];
		checkboxes.value=!checkboxes.value;
		cc.log(checkboxes.value);
	}
	
	//下拉框绑定事件
	select_cb(node,Groupindex,index){	
		this.view.createLayout(node,Groupindex,index);
		this.view.g_index = Groupindex;
		this.connectUi();
	}
	
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private moreGameBtn_cb(): void{
		cc.log("点击了更多游戏");
	}
	private moreItemBtn_cb(): void {
		cc.log("点击了更多选项");
	}
	private CloseBtn_cb () : void {
		this.finish();
	}
	private CreateBtn_cb () : void {
		//走创建房间流程
		RoomMgr.getInstance().reqCreateFangKaVerify();
	}
	private DefaultRule_cb() : void{
		cc.log("点击到了默认规则按钮");
	}
	private Rule_cb() : void{
		cc.log("点击到了游戏说明");
	}
	//0代表麻将，1代表扑克，2代表棋
	private Majong_cb() : void{
		cc.log("点击到了麻将");
		this.view.setSubGameType(0);
		this.view.addSubGameList();
		this.connectUi();
	}
	private Poker_cb() : void{
		cc.log("点击到了扑克");
		this.view.setSubGameType(1);
		this.view.addSubGameList();
		this.connectUi();
	}
	private Chess_cb() : void{
		cc.log("点击到了棋类");
		this.view.setSubGameType(2);
		this.view.addSubGameList();
		this.connectUi();
	}
	//end
}