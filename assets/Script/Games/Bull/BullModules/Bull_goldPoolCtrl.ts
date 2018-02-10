/*
author: YOYO
日期:2018-02-06 20:36:26
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Bull_goldPoolCtrl;
//模型，数据处理
class Model extends BaseModel{
    onceFlyNum:number = null                    //单次飞行金币的数量
    minFlySpeed:number = null                   //最低飞行速度
    maxFlySpeed:number = null                   //最高飞行速度
    resultGoldUpH:number = null                 //结算金币升高的高度
	constructor()
	{
		super();

        this.onceFlyNum = 7;
        this.minFlySpeed = 30;
        this.maxFlySpeed = 70;
        this.resultGoldUpH = 100;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    private _list_cache:Array<cc.Node> = null
    private _list_hideGold:Array<cc.Node> = null
	ui={
        //在这里声明ui
        sprite_goldImg:null,
        node_seatPos:null,
        node_resultGold:null
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        
        this._list_cache = [];
        this._list_hideGold = [];
	}
	//初始化ui
	initUi()
	{
        this.ui.sprite_goldImg = ctrl.sprite_goldImg;
        this.ui.node_seatPos = ctrl.node_seatPos;
        this.ui.node_resultGold = ctrl.node_resultGold;
    }
    /**
     * 根据初始id和目标id，飞行一组金币
     * @param startLogicId 起始的座位逻辑id
     * @param targetLogicId 目标的座位逻辑id
     * @param cb 飞行结束的回调
     */
    flyGold(startLogicId:number, targetLogicId:number, cb?:Function){
        let startPos = this.getPosByLogicSeatId(startLogicId);
        let targetPos = this.getPosByLogicSeatId(targetLogicId);
        let golds = this._createGroupGold(this.model.onceFlyNum, startPos);
        this.flyGroupToTarget(golds, targetPos, cb);
    }
    //根据位置显示结算后的金币
    showOneResultGold(viewSeatId:number, value){
        let targetNode = this.ui.node_resultGold.children[viewSeatId];
        if(targetNode){
            value = parseInt(value);
            if(value > 0) value = '+'+value;
            targetNode.getComponent(cc.Label).string = value;
            this.playResultGoldAni(targetNode);
        }
    }
    
    //=================

    private flyGroupToTarget(groupList:Array<cc.Node>, targetPos:cc.Vec2, cb:Function){
        let i,
            curNodeNum = groupList.length;
        for(i = 0; i < groupList.length; i ++){
            let goldNode = groupList[i];
            let act1 = cc.moveTo(this.getRandomArea(this.model.minFlySpeed, this.model.maxFlySpeed)/100, targetPos);
            let act2 = cc.callFunc(function(){
                goldNode.active = false;
                curNodeNum -= 1;
                if(curNodeNum < 1){
                    if(cb){
                        cb();
                        cb = null;
                    }
                }
            }, this);
            goldNode.runAction(cc.sequence(act1, act2));
        }
    }
    private _createGroupGold(num:number, targetPos:cc.Vec2){
        let i,
            goldNode:cc.Node,
            list_golds = [];
        for(i = 0; i < num; i ++){
            goldNode = this._getOneGold();
            goldNode.position = this._getRandomPos(targetPos);
            list_golds.push(goldNode);
        }
        return list_golds
    }
    private _getOneGold(){
        let curNode = this._list_hideGold.pop();
        if(!curNode){
            curNode = new cc.Node();
            curNode.parent = this.node;
            curNode.addComponent(cc.Sprite).spriteFrame = this.ui.sprite_goldImg;
            this._list_cache.push(curNode);
        }
        curNode.active = true;
        return curNode;
    }
    private _getRandomPos(curPos:cc.Vec2){
        let curW = 25,
            curH = 50;
        let nodeW = this.getRandomArea(0, curW) * (Math.random() > 0.5 ? 1 : -1),
            nodeH = this.getRandomArea(0, curH) * (Math.random() > 0.5 ? 1 : -1);
        return cc.p(curPos.x + nodeW, curPos.y + nodeH);
    }
    //返回数值包括最大最小值
    private getRandomArea (downNum, upNum){
        return parseInt(Math.random()*(upNum - downNum + 1) + downNum);
    }
    //根据座位id获取座位坐标
    private getPosByLogicSeatId(logicSeatId:number){
        let viewSeatId = RoomMgr.getInstance().getViewSeatId(logicSeatId);
        let targetNode = this.ui.node_seatPos.children[viewSeatId];
        if(targetNode){
            return targetNode.position;
        }
        return null
    }
    private playResultGoldAni(curNode:cc.Node){
        curNode.active = true;
        if(!curNode['_initPosY']) curNode['_initPosY'] = curNode.y;
        curNode.scale = 0.2;
        let time1 = 0.5;
        let act1 = cc.moveTo(time1, curNode.x, curNode.y + this.model.resultGoldUpH);
        let act2 = cc.scaleTo(time1, 1);
        let act3 = cc.delayTime(time1+0.5);
        let act4 = cc.callFunc(function(){
            curNode.y = curNode['_initPosY'];
            curNode.active = false;
        }, this);
        curNode.runAction(cc.spawn(act1, act2));
        curNode.runAction(cc.sequence(act3, act4));
    }
}
//c, 控制
@ccclass
export default class Bull_goldPoolCtrl extends BaseCtrl {
    view:View = null
    model:Model = null
	//这边去声明ui组件
    @property({
        type:cc.SpriteFrame,
        displayName:"goldImg"
    })
    sprite_goldImg:cc.SpriteFrame = null
    @property({
        type:cc.Node,
        displayName:"seatPos"
    })
    node_seatPos:cc.Node = null
    @property({
        type:cc.Node,
        displayName:"resultGold"
    })
    node_resultGold:cc.Node = null
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
	}
	start () {
        
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
    //end
    
    /**
     * 根据输赢飞行金币, dataList 需要按照注释中的格式
     * 这里的id是逻辑位置id，即服务器位置id
     */
    // dataList = [
    //     {
    //         winId: 0,
    //         failIdList : [1, 2, 3]
    //     },
    //     {
    //         winId: 2,
    //         failIdList : [0, 1, 3]
    //     }
    // ]
    flyGolds(dataList:Array<{}>){
        dataList = dataList.concat([]);
        let flyData;
        let flyFunc = ()=>{
            let i,
                j,
                curId,
                curGroupNum;

            curGroupNum = flyData.failIdList.length;
            for(j = 0; j < flyData.failIdList.length; j ++){
                curId = flyData.failIdList[j];
                this.view.flyGold(curId, flyData.winId, ()=>{
                    curGroupNum -= 1;
                    if(curGroupNum < 1){
                        //一个回合飞行结束
                        flyData = dataList.splice(0, 1)[0];
                        if(flyData) flyFunc();
                    }
                })
            }
        }
        flyData = dataList.splice(0, 1)[0];
        if(flyData) flyFunc();
    }

    showGoldsResult(dataList){
        dataList = [
            {
                viewSeatId:0,
                goldValue: 1000
            },
            {
                viewSeatId:1,
                goldValue: -1000
            },
            {
                viewSeatId:2,
                goldValue: 1000
            },
            {
                viewSeatId:3,
                goldValue: -1000
            },
        ]
        let i,
            data;
        for(i = 0; i < dataList.length; i ++){
            data = dataList[i];
            this.view.showOneResultGold(data.viewSeatId, data.goldValue);
        }
    }
}