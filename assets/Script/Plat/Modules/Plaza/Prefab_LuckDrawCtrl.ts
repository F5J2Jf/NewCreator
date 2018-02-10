import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import SettingMgr from "../../GameMgrs/SettingMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import LuckDrawMgr from "../../GameMgrs/LuckDrawMgr";
import Prefab_luckDrawTipCtrl from "../../Modules/Plaza/Prefab_luckDrawTipCtrl";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_LuckDrawCtrl;
//模型，数据处理
class Model extends BaseModel{
    awardListInfo : any = {}
    luckDrawInfo : any = {}
    bDraw : bool = false
    wechatNum : string = ''
    propID : int = null
    propName : string = {}
	constructor()
	{
        super();
        this.awardListInfo = LuckDrawMgr.getInstance().getAwardList();
        this.luckDrawInfo = LuckDrawMgr.getInstance().getLuckDrawInfo();
        this.bDraw = this.luckDrawInfo.bDraw;
        this.wechatNum = this.luckDrawInfo.wechatNum; 
	}
    private setLuckDraw(){
        this.bDraw = true;
    }
    private setDrawResult(result){
        this.propID = result.propID
        this.propName = result.propName
    }
}

class View extends BaseView{
	ui={
        //在这里声明ui
        button_CloseBtn:null,
        button_CopyWechat:null,
        button_RewardRecord:null,
        button_StartDraw:null,
        node_RewardFrame:null,
        array_AwardList:[],
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
        let self = this
		this.ui.button_CloseBtn = ctrl.CloseBtn;
		this.ui.button_CopyWechat = ctrl.CopyWechat;
		this.ui.button_RewardRecord = ctrl.RewardRecord;
        this.ui.button_StartDraw = ctrl.StartDraw;
        this.ui.array_AwardList = ctrl.AwardList;
        this.ui.node_RewardFrame = ctrl.RewardFrame;
        this.ui.node_RewardFrame.active = false;
        for (let i = 0; i < 12; ++i){
            let sprite = this.ui.array_AwardList[i]
            let imagePath = this.model.awardListInfo[i].imagePath
            cc.loader.loadRes(imagePath, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) return cc.error("no find image path: %s", imagePath)
                sprite.spriteFrame = spriteFrame
            });
        }
    }

    FrameTurnAround(delTime, playCount, propID, propName){
        let self = this
        let pos = [];
        for(let i = 0; i < this.ui.array_AwardList.length; i++){
            console.log(i)
            let framePos = this.ui.array_AwardList[i].node.getPosition();
            pos.push(framePos);
        }
        let action = function (delTime, playCount, propID, propName) {
	        self.ui.node_RewardFrame.active = true
	        self.ui.node_RewardFrame.runAction(
	            cc.sequence(cc.delayTime(delTime),cc.callFunc(function(sender, data) {
	                playCount++
	                delTime += (delTime > 0.1 ? 0.02 : 0.001)
	                playCount = playCount<= 11 ? playCount : 0
	                if (playCount == 0) console.log(delTime)
	                sender.setPosition(pos[playCount]) 
	                if (delTime <= 0.5) {
                        if (delTime > 0.22 && propID == playCount){
                            self.ui.node_RewardFrame.runAction(
                                cc.sequence(cc.delayTime(1),cc.callFunc(function(){
                                    //回调分享接口
                                    //FrameMgr.getInstance().showMsgBox('恭喜！您获得了' + propName + '\n分享即可领取!',null ,'温馨提示');
                                    ctrl.showTipMsg('您获得了' + propName + '\n分享即可领取！', null, '分享');
                                }))
                            )
                            return
                        }
	                     action(delTime, playCount, propID, propName)
	                }
	        })))
        }
        action(delTime, playCount, propID, propName); 
    }
}

@ccclass
export default class Prefab_LuckDrawCtrl extends BaseControl {
	@property({
		tooltip : "关闭界面按钮",
		type : cc.Node
	})
	CloseBtn : cc.Node = null;

	@property({
		tooltip : "复制微信号",
		type : cc.Node
	})
	CopyWechat : cc.Node = null;

	@property({
		tooltip : "中奖记录",
		type : cc.Node
	})
	RewardRecord : cc.Node = null;

	@property({
		tooltip : "点击抽奖",
		type : cc.Node
	})
	StartDraw : cc.Node = null;

    @property({
        tooltip : "奖品列表"，
        type : cc.Sprite
    })
    AwardList : cc.Sprite[] = [];
    
    @property({
        tooltip : "抽奖框"，
        type : cc.Node
    })
    RewardFrame : cc.Node = null;

    onLoad () {
    	//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
    },

    //定义网络事件
    defineNetEvents()
    {
        this.n_events = {
            'http.reqDrawResult':this.reqDrawResultTurn;    
        } 
    }
    //定义全局事件
    defineGlobalEvents()
    {

    }

    connectUi()
    {
        this.connect(G_UiType.button, this.ui.button_CloseBtn, this.click_buttonCloseCB, '关闭界面按钮');
        this.connect(G_UiType.button, this.ui.button_CopyWechat, this.copyWechatCB, '复制微信号');
        this.connect(G_UiType.image, this.ui.button_RewardRecord, this.rewardRecordCB, '打开中奖记录');
        this.connect(G_UiType.button, this.ui.button_StartDraw, this.startDrawCB, '开始抽奖');
    }

    click_buttonCloseCB(){
        console.log('关闭界面');
        this.finish();
    }

    copyWechatCB(){
        console.log('复制了微信号');
    }

    rewardRecordCB(){
        console.log('打开中奖记录');
        if (this.model.bDraw){
            //回调分享接口
            this.showTipMsg('您获得了' + this.model.propName + '\n分享即可领取！', null, '分享');
        }
        else{
            this.showTipMsg('您今日还未抽奖！', null, '确定'); 
        }
    }

    reqDrawResultTurn(msg){
        this.model.setDrawResult(msg)
        this.view.FrameTurnAround(0.01, 0, this.model.propID, this.model.propName);
    }

    startDrawCB(){
        console.log('开始抽奖');
        if (this.model.bDraw) {
            this.showTipMsg('抽奖次数已经用完啦！\n明天记得来哦！', null, '确定');
            //FrameMgr.getInstance().showMsgBox('抽奖次数已经用完啦！');
            return
        }
        this.model.setLuckDraw();
        //这里向服务器请求开始抽奖
        //LuckDrawMgr.getInstance().http_reqDrawResult();
        //以下为抽奖结果
        let msg = {
            propID : 1,
            propName : '20元购物卡',
        }
        this.reqDrawResultTurn(msg);
    }

    public showTipMsg(content:string, okcb?:Function, btnLab?:string){
    	ModuleMgr.getInstance().start_sub_module(G_MODULE.LuckDrawTipPanel, (prefabComp:Prefab_luckDrawTipCtrl)=>{
            prefabComp.showTip(content, okcb, btnLab)
        })
    }

    start () {

    },

    // update (dt) {},
}
