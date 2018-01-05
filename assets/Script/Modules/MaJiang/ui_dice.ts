import BaseControl from "../../Libs/BaseControl";
import Tools from "../../GameManager/inGlobal_Tools";
//MVC编码示范
const {ccclass, property} = cc._decorator;

let moduleObj:Model,
    viewObj:View,
    ctrlObj:Dice;
//m，数据处理
class Model {
  
}
//v, 界面显示
class View {

}
moduleObj = new Model();
viewObj = new View();
//c, 控制
@ccclass
export default class Dice extends cc.Component {

    @property(cc.Node)
    nodeDice : cc.Node = null;

    @property(cc.SpriteAtlas)
    diceAtlas : cc.SpriteAtlas = null;

     _endCallFunc : Function =null;
    
    onLoad (){
         ctrlObj = this;
    }

    start () { 
    }

    openDice (diceDirection, endCallFunc){
        let nodeDice = this.nodeDice.children;
        for(let i in nodeDice){
            let animation = nodeDice[i].getComponent('cc.Animation');
            animation.play();
        }

        this._endCallFunc = function() {
            for(let i in nodeDice){
                let script = nodeDice[i].getComponent('cc.Sprite');
                script.spriteFrame = this.diceAtlas.getSpriteFrame("ThrowDiceResult_05");
            }
        };
        this.scheduleOnce(this._endCallFunc, 1);
        this.scheduleOnce(endCallFunc, 1.3);
        switch(diceDirection){
            case 0://东
            for(let i in nodeDice){
                nodeDice[i].setPositionY(nodeDice[i].getPositionY()-460)
                nodeDice[i].runAction(cc.spawn(
                    cc.moveBy(0.5, cc.p(0, 460)),
                    cc.scaleBy(0.5, 0.5, 0.5),
                ));
            }
            break;
            case 1://南
            for(let i in nodeDice){
                nodeDice[i].setPositionX(nodeDice[i].getPositionX()+780)
                nodeDice[i].runAction(cc.spawn(
                    cc.moveBy(0.5, cc.p(-780, 0)),
                    cc.scaleBy(0.5, 0.5, 0.5),
                ));
            }
            break;
            case 2://西
            for(let i in nodeDice){
                nodeDice[i].setPositionY(nodeDice[i].getPositionY()+460)
                nodeDice[i].runAction(cc.spawn(
                    cc.moveBy(0.5, cc.p(0, -460)),
                    cc.scaleBy(0.5, 0.5, 0.5),
                ));
            }
            break;
            case 3://北
            for(let i in nodeDice){
                nodeDice[i].setPositionX(nodeDice[i].getPositionX()-780)
                nodeDice[i].runAction(cc.spawn(
                    cc.moveBy(0.5, cc.p(780, 0)),
                    cc.scaleBy(0.5, 0.5, 0.5),
                ));
            }
            break;
        }
    }
}
