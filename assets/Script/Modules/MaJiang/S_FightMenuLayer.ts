import inGlobal_Enum from "../../Libs/Configs/inGlobal_Enum";
const {ccclass, property} = cc._decorator;

@ccclass
export default class S_FightMenuLayer extends cc.Component {
    @property(cc.Node)
    Button_Chat : cc.Node = null;

    _Buttonclick : any;

    onLoad () : void {
        let self = this;
        self._Buttonclick = self.node.getComponent(inGlobal_Enum.compName.clickAgent);
        self._Buttonclick.registerButton(self.Button_Chat, self.On_ButtonChat, self);
        setTimeout(()=>{

        }, 1000);
    }

    On_ButtonChat () : void {
        let self = this;
        cc.loader.loadRes("Prefab_onLoad/PrefabChat/chatNode", cc.Prefab, (err : Error, res : any)=> {
            let node = cc.instantiate(res);
            cc.director.getScene().getChildByName("Canvas").addChild(node);
        });
    }

    goToMaJiang () : void {
        
    }

}
