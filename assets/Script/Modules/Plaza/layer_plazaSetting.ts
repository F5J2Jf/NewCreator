import BaseLayer from "../../Libs/BaseLayer";
import Part_setClickEvent from "../../Libs/Components/Part_setClickEvent";
import inGlobal_Enum from "../../Libs/Configs/inGlobal_Enum";
import PagesMgr from "../../GameManager/inGlobal_pagesMgr";

const {ccclass, property} = cc._decorator;
let click : Part_setClickEvent;

@ccclass
export default class layer_plazaSetting extends BaseLayer {
    @property(cc.Label)
    NickName : cc.Label = null;

    @property(cc.Node)
    CloseBtn : cc.Node = null;

    @property(cc.Node)
    AgencyBtn : cc.Node = null;

    start () : void {

        click = this.getComponent(inGlobal_Enum.compName.clickAgent);
        click.registerButton(this.CloseBtn, this._onClick_close.bind(this), this);
        click.registerButton(this.AgencyBtn, this._onClick_Agency.bind(this), this);


    }

    _onClick_close (event, data) : void {
        this.hideLayer();
    }

    _onClick_Agency (event, data) : void {
        this.hideLayer();
        PagesMgr.getInstance().showPage(inGlobal_Enum.prefabName.agencyBind, (uiComp)=>{
            uiComp.showLayer();
        })
    }


}