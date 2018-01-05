import Part_setClickEvent from "../../Libs/Components/Part_setClickEvent";
import inGlobal_Enum from "../../Libs/Configs/inGlobal_Enum";
import DataTools from "../../GameManager/inGlobal_DataTools";
import BaseScene from "../../Libs/BaseScene";

//登录场景
const {ccclass, property} = cc._decorator;

@ccclass
export default class S_login_manager extends BaseScene {
    @property(cc.Node)
    node_qq = null

    @property(cc.Node)
    node_wx = null

    start () {
        let clickAgent:Part_setClickEvent = this.getComponent(inGlobal_Enum.compName.clickAgent);
        clickAgent.registerButton(this.node_qq, this._onClick_touch, this, 0);
        clickAgent.registerButton(this.node_wx, this._onClick_touch, this, 1);
    }

    _onClick_touch (event, dataIndex){
        console.log('_onClick_touch')
        let changeData = {};
        changeData['sceneName'] = inGlobal_Enum.sceneName.Hall;
        DataTools.getInstance().changeScene(changeData);
        
        if(dataIndex == 0){
            //qq登录
        }else if(dataIndex == 1){
            //微信登录
        }
    }

    // update (dt) {},
}
