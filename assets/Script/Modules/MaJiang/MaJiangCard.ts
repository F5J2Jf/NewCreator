import BaseLayer from "../../Libs/BaseLayer";
const {ccclass, property} = cc._decorator;

@ccclass
export default class MaJiangCard extends BaseLayer {
    @property(cc.SpriteAtlas)
    MaJiangAtlas : cc.SpriteAtlas = null;
    _endFun:Function = null;
    onLoad () : void {
        let self = this;
        let nNum : cc.Node[] = self.node.children;
        for (let i in nNum) {
            nNum[i].active = false;
            if (nNum[i].getChildByName("sign")) nNum[i].getChildByName("sign").getComponent("cc.Sprite").spriteFrame = self.MaJiangAtlas.getSpriteFrame("four_mj_b12");
        }

        self.schedule(self.fGoToCard, 0.1, nNum.length);
     }

     setEndFun(endFun:Function){
        this._endFun = endFun;
     }

    start () : void {
        let self = this;
    }

    fGoToCard () : void {
        let self = this;
        let nNum : cc.Node[] = self.node.children;
        for (let i in nNum) {
            if (!nNum[i].active){
                nNum[i].active = true;
                if(parseInt(i) == nNum.length-1){
                    //判断结束
                    this._endFun();
                }
                return;
            }
        }
    }
}
