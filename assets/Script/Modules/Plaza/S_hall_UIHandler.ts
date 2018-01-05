import S_hall_manager from "./S_hall_manager"
import PagesMgr from "../../GameManager/inGlobal_pagesMgr";
import Tools from "../../GameManager/inGlobal_Tools";
import inGlobal_Enum from "../../Libs/Configs/inGlobal_Enum";
import Part_setClickEvent from "../../Libs/Components/Part_setClickEvent";

//大厅场景下的界面表现处理
const {ccclass, property} = cc._decorator;
let CLICK:Part_setClickEvent;

@ccclass
export default class S_hall_UIHandler extends cc.Component {
    //表现，头像
    @property(cc.Node)
    node_headImg = null
    //名字
    @property(cc.Label)
    lab_playerName = null
    //
    @property(cc.Label)
    lab_gold = null
    //
    @property(cc.Label)
    lab_jewel = null
    //ui容器
    @property(cc.Node)
    node_uiContainer : cc.Node = null

    //按钮, 底部按钮
    @property(cc.Node)
    node_bottomContainer = null
    //左边
    @property(cc.Node)
    node_leftContainer = null
    //右上角
    @property(cc.Node)
    node_rightTopContainer = null
    //入口按钮
    @property(cc.Node)
    node_enterContainer = null
    //获取金钱按钮
    @property(cc.Node)
    node_moneyContainer = null

    _comp_mgr : S_hall_manager = null

    // onLoad () {},

    start () {
        this._comp_mgr = this.getComponent(inGlobal_Enum.compName.hall_manager);
        PagesMgr.getInstance().initContainer(this.node_uiContainer);

        this._registerBtn();
    }

    setHead (){
        // this.node_headImg.spriteFrame =
    }
    setName (content:string){
        this.lab_playerName.string = Tools.getInstance().getNameLimit(content);
    }
    setGold (content:string){
        this.lab_gold.string = content;
    }
    setJewel (content:string){
        this.lab_jewel.string = content;
    }

    onPageAdd (typeName:string, data){

    }

    //================

    _registerBtn (){
        //注册按钮
        CLICK = this.getComponent(inGlobal_Enum.compName.clickAgent);
        let children,
            child;
        //bottom
        children = this.node_bottomContainer.children;
        for(let i = 0; i < children.length; i ++){
            child = children[i];
            CLICK.registerButton(child, this._onClick_bottom, this, i);
        }
        //left
        children = this.node_leftContainer.children;
        for(let i = 0; i < children.length; i ++){
            child = children[i];
            CLICK.registerButton(child, this._onClick_left, this, i);
        }
        //right top
        children = this.node_rightTopContainer.children;
        for(let i = 0; i < children.length; i ++){
            child = children[i];
            CLICK.registerButton(child, this._onClick_rightTop, this, i);
        }
        //money charge
        children = this.node_moneyContainer.children;
        for(let i = 0; i < children.length; i ++){
            child = children[i];
            CLICK.registerButton(child, this._onClick_charge, this, i);
        }
        //enter buttons
        children = this.node_enterContainer.children;
        for(let i = 0; i < children.length; i ++){
            child = children[i];
            CLICK.registerButton(child, this._onClick_enter, this, i);
        }
    }
    //click event
    _onClick_bottom (event, data){
        console.log('touch bottom', data)
        switch(data){
            case 0:
                //任务
                break;
            case 1:
                //竞赛
                break;
            case 2:
                //商城
                break;
            case 3:
                //邮件
                break;
            case 4:
                //背包
                break;
            case 5:
                //牌友
                break;
            case 6:
                //包厢
                break;
            default:
                break
        }
    }
    //click left
    _onClick_left (event, data){
        console.log('_onClick_left',data)
        if(data == 0){
            //first charge
        }else if(data == 1){
            //
        }
    }
    //click right top
    _onClick_rightTop (event, data){
        console.log('_onClick_rightTop',data)
        if(data == 0){
            //setting
            PagesMgr.getInstance().showPage(inGlobal_Enum.prefabName.setting, (uiComp)=>{
                uiComp.showLayer();
            })
        }else if(data == 1){
            //announce
        }else if(data == 2){
            //shared
        }
    }
    //click enter buttons
    _onClick_enter (event, data){
        console.log('_onClick_enter',data)
        if(data == 0){
            //thirteen game
        }else if(data == 1){
            //ma jiang
            
        }else if(data == 2){
            //bull game
        }
        PagesMgr.getInstance().showPage(inGlobal_Enum.prefabName.enterRoom, (uiComp)=>{
            uiComp.showLayer();
        })
    }
    //click charge
    _onClick_charge (event, data){
        console.log('_onClick_charge',data)
        if(data == 0){
            //gold
        }else if(data == 1){
            //jewel
        }
    }

    addUI (uiName:string, cb:Function){
        
    }

    // update (dt) {},
}
