/*
author: YOYO
日期:2018-01-11 18:08:05
tip: 位置配置信息
*/
const {ccclass, property} = cc._decorator;

@ccclass
export default class BullSeatCfg extends cc.Component {
    @property({
        type:cc.Node,
        displayName:"seatConfig"
    })
    node_cfg_seatPos:cc.Node = null
    // onLoad () {},

    start () {

    }

    //获取玩家座位坐标信息
    getSeatPos(seatid:number):cc.Vec2{
        let child = this.node_cfg_seatPos.getChildByName('seat_'+seatid);
        if(child){
            return child.position;
        }
        return null
    }

    //获取准备图片的位置
    getReadyFlagPos(seatid:number):cc.Vec2{
        let child = this.node_cfg_seatPos.getChildByName('seat_'+seatid);
        if(child){
            let offW = child.width,
                offH = child.height;
            return this.parseDir(child, offW, offH);
        }
        return null
    }
    //四个方向偏移后的坐标
    private parseDir (child:cc.Node, offW:number, offH:number){
        let curPos;
        if(child.x > 0){
            //右
            if(child.y > 0){
                if(child.y > child.x){
                    //上
                    curPos = cc.p(child.x, child.y - offH);
                }else{
                    //右
                    curPos = cc.p(child.x - offW, child.y);
                }
            }else{
                if(Math.abs(child.y) > child.x){
                    //下
                    curPos = cc.p(child.x, child.y + offH);
                }else{
                    //右
                    curPos = cc.p(child.x - offW, child.y);
                }
            }
        }else {
            //左
            if(child.y > 0){
                if(child.y > Math.abs(child.x)){
                    //上
                    curPos = cc.p(child.x, child.y - offH);
                }else{
                    //左
                    curPos = cc.p(child.x + offW, child.y);
                }
            }else{
                if(Math.abs(child.y) > Math.abs(child.x)){
                    //下
                    curPos = cc.p(child.x, child.y + offH);
                }else{
                    //左
                    curPos = cc.p(child.x + offW, child.y);
                }
            }
        }
        return curPos
    }

    // update (dt) {},
}
