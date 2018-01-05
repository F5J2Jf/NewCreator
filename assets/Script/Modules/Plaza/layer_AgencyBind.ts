import BaseLayer from "../../Libs/BaseLayer";
import Part_setClickEvent from "../../Libs/Components/Part_setClickEvent";
import inGlobal_Enum from "../../Libs/Configs/inGlobal_Enum";

const {ccclass, property} = cc._decorator;
let click : Part_setClickEvent;

@ccclass
export default class layer_AgencyBind extends BaseLayer {
    @property(cc.EditBox)
    Code : cc.EditBox = null;

    @property(cc.Node)
    CloseBtn : cc.Node = null;

    start () : void {

        click = this.getComponent(inGlobal_Enum.compName.clickAgent);
        click.registerButton(this.CloseBtn, this._onClick_close.bind(this), this);
        
    }

    _onClick_close (event, data) : void {
        this.hideLayer();
    }
}