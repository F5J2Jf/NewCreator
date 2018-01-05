import PagesMgr from "../../GameManager/inGlobal_pagesMgr";
import DataTools from "../../GameManager/inGlobal_DataTools";
import ResLoadMgr from "../../GameManager/inGlobal_ResLoadMgr";
import inGlobal_CommonConfig from "../../Libs/Configs/inGlobal_CommonConfig";
import BaseLayer from "../../Libs/BaseLayer";
import inGlobal_Enum from "../../Libs/Configs/inGlobal_Enum";
import Part_setClickEvent from "../../Libs/Components/Part_setClickEvent";

//enter room page
const {ccclass, property} = cc._decorator;
let click : Part_setClickEvent;
const roomidLen = inGlobal_CommonConfig.roomidLen;

@ccclass
export default class layer_enterRoom extends BaseLayer {

    @property(cc.Node)
    node_close = null

    @property(cc.Node)
    node_create: cc.Node = null

    @property(cc.Node)
    node_numContainer : cc.Node = null

    @property(cc.EditBox)
    edit_showNum : cc.EditBox = null

    // LIFE-CYCLE CALLBACKS:

    _string_inEdit : string = null
    //房间id的长度
    _idLen : number = null

    // onLoad () {},

    start () {
        click = this.getComponent(inGlobal_Enum.compName.clickAgent);120
        let children = this.node_numContainer.children;
        for(let i = 0; i < children.length; i ++){
            let numBtn = children[i];
            click.registerButton(numBtn, this._onClick_number.bind(this), this, i+1);
        }

        click.registerButton(this.node_close, this._onClick_close.bind(this), this);
        click.registerButton(this.node_create, this._onClick_create.bind(this), this);

        this._string_inEdit = "";
        this._idLen = 0;
    }

    _onClick_number (event, index){
        console.log('_onClick_number', index);

        if(index < 10){
            //number
            this._addEditStr(index);
        }else if(index == 10){
            //reset edit
            this._resetEditStr();
        }else if(index == 11){
            //zero 0
            this._addEditStr(0);
        }else if(index == 12){
            //delete
            this._delEditStr();
        }
        this.edit_showNum.string = this._string_inEdit;
    }
    _onClick_close (){
        console.log('_onClick_close');
        this.hideLayer();
    }
    _onClick_create (){
        console.log('_onClick_create');
        this.hideLayer();

        PagesMgr.getInstance().showPage(inGlobal_Enum.prefabName.createRoom, (uiComp)=>{
            uiComp.showLayer();
        })
    }

    _addEditStr (num:number){
        if(this._idLen < roomidLen){
            this._string_inEdit += '  ' + num;
            this._idLen += 1;
            if(this._idLen >= roomidLen){
                //go to room
                let changeData = {};
                changeData['sceneName'] = inGlobal_Enum.sceneName.MaJiang;
                DataTools.getInstance().changeScene(changeData);
            }
        }
    }

    _delEditStr (){
        this._string_inEdit = this._string_inEdit.substring(0, this._string_inEdit.length - 3);
        this._idLen -= 1;
        this._idLen = Math.max(this._idLen, 0);
    }

    _resetEditStr (){
        this._string_inEdit = "";
        this._idLen = 0;
    }

    // update (dt) {},
}
