import BaseLayer from "../../Libs/BaseLayer";
import DataTools from "../../GameManager/inGlobal_DataTools";
import DataObj from "../../Libs/Configs/inGlobal_dataObject";
import Part_dealScroll from "../../Libs/Components/Part_dealScroll";
import inGlobal_Enum from "../../Libs/Configs/inGlobal_Enum";
import Part_setClickEvent from "../../Libs/Components/Part_setClickEvent";

//create room page
const {ccclass, property} = cc._decorator;
let click:Part_setClickEvent;

@ccclass
export default class layer_createRoom extends BaseLayer {

    @property(cc.Node)
    node_close:cc.Node = null;

    @property(cc.Node)
    node_create = null;

    @property(Part_dealScroll)
    scroll:Part_dealScroll = null;

    @property(cc.Node)
    node_content:cc.Node = null

    @property(cc.Label)
    lab_gold = null

    @property(cc.Label)
    lab_jewel = null

    @property(cc.SpriteFrame)
    frame_choose = null
    // LIFE-CYCLE CALLBACKS:

    _node_imgs : cc.Node = null
    _node_labs : cc.Node = null

    // onLoad () {},

    start () {
        this._registerButton();
        this._parseUI();
    }

    _parseUI (){
        //设置滚动层信息
        let dataObj = DataObj.data_scrollInit();
        dataObj.itemFrame = this.frame_choose;
        // dataObj.lineNum = 3;
        dataObj.scrollType = this.scroll.getScrollType().vertical;
        dataObj.offX = 8;
        dataObj.offY = 15;

        this.scroll.setData(dataObj);

        let str = ['十三水','牛牛','泉州麻将']
        for(let i = 0; i < 3; i ++){
            let item = this.scroll.getItemByIndex(i);
            if(item){
                item
                this._addTitle(item, str[i]);
                click.registerButton(item, this._onClick_choose.bind(this), this);
            }
        }

        //content
        this._node_imgs = this.node_content.getChildByName('images');
        this._node_labs = this.node_content.getChildByName('labels');
        let target,
            targetChild,
            children = this._node_imgs.children;
        for(let i = 0; i < children.length; i ++){
            target = children[i];
            for(let j = 0; j < target.children.length; j ++){
                targetChild = target.children[j];
                click.registerButton(targetChild, this._onClick_toggle.bind(this), this, i+'_'+j);
            }
        }
    }

    _registerButton (){
        click = this.getComponent(inGlobal_Enum.compName.clickAgent);
        click.registerButton(this.node_close, this._onClick_close.bind(this), this);
        click.registerButton(this.node_create, this._onClick_create.bind(this), this);
    }

    _onClick_close (){
        console.log('_onClick_close')
        this.hideLayer();
    }

    _onClick_create (){
        console.log('_onClick_create')

        let changeData = {};
        changeData['sceneName'] = inGlobal_Enum.sceneName.MaJiang;
        DataTools.getInstance().changeScene(changeData);
    }

    _onClick_choose (event, index){
        console.log('_onClick_choose')
    }

    _onClick_toggle (event, tagStr){
        console.log('_onClick_toggle=', tagStr);

        this._setToggle(event.target);
    }

    _addTitle (target, title){
        let labNode = new cc.Node();
        labNode.parent = target;
        labNode.addComponent(cc.Label).string = title;
    }

    _setToggle (btn){
        let child = btn.children[0];
        if(child){
            child.active = !child.active;
        }
    }

    setCreateInfo (lineNum:number, index:number, info:string){
        let labName = "lab_" + lineNum + "_" + index;
        let targetLab:cc.Node = this._node_labs.getChildByName(labName);
        if(targetLab){
            targetLab.getComponent(cc.Label).string = info;
        }
    }

    setMoneyInfo (goldValue:number, jewelValue:number){
        this.lab_gold.string = goldValue;
        this.lab_jewel.string = jewelValue;
    }

    // update (dt) {},
}
