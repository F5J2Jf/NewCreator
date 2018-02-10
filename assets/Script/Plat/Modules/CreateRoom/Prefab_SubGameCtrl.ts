import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

const {ccclass, property} = cc._decorator;
let ctrl : Prefab_SubGameCtrl;
class Model extends BaseModel{

    constructor(){
        super();
    }
}

class View extends BaseView{
    ui={
        subgame_name:null
    }

    node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
    }
    
    initUi(){
        this.ui.subgame_name = ctrl.label;
    }
   

}
@ccclass
export default class Prefab_SubGameCtrl extends BaseCtrl {

    @property(cc.Label)
    label: cc.Label = null;

    onLoad(){
        ctrl = this;
        this.initMvc(Model,View);
     }

    start () {

    }

    
}
