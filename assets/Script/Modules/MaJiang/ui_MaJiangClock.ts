import BaseControl from "../../Libs/BaseControl";
import Tools from "../../GameManager/inGlobal_Tools";
//MVC编码示范
const {ccclass, property} = cc._decorator;

let moduleObj:Model,
    viewObj:View,
    ctrlObj:MaJiangClock;
//m，数据处理
class Model {
    _isUpdate : boolean =  null;
    _runTime : number = null;
    _maxSec : number = null;
    _curSec :number = null;
}
//v, 界面显示
class View {

}
moduleObj = new Model();
viewObj = new View();
//c, 控制
@ccclass
export default class MaJiangClock extends BaseControl {

    @property(cc.Node)
    node_lab_time : cc.Node = null;
    @property(cc.Node)
    node_direction : cc.Node = null;
    _Tools : Tools;
    _directionChild : Array<cc.Node> = null;
    _listenerFunc : Function  = null;
    _endCallFunc : Function =null;
    
    onLoad (){
        ctrlObj = this;
        this._directionChild = this.node_direction.children;
    }

    start () { 
        
    }

    openClock (maxTime, endCallFunc){
        //if(this._Tools.isNumber(maxTime)){
            this._initClock(maxTime);
            this._endCallFunc = endCallFunc;
            moduleObj._isUpdate = true;
        //}
        this.ShowDirection(0);
    }
    
    ShowDirection(direction:number){
        this._directionChild[direction].active = true;
        this.fadeAction(this._directionChild[direction]);    
    }
    fadeAction(node:cc.Node){
        node.runAction(cc.sequence(
            cc.delayTime(0.05),
            cc.fadeOut(1),
            cc.delayTime(0.05),
            cc.fadeIn(1),
            cc.delayTime(0.05),
        ).repeatForever());
    }
    
    closeClock (){
        moduleObj._isUpdate = false;
    }

    addListenerFunc (func){
        this._listenerFunc = func;
    }

    _initClock (maxTime){
        moduleObj._isUpdate = false;
        moduleObj._runTime = 0;
        moduleObj._maxSec = maxTime;
        moduleObj._curSec = moduleObj._maxSec;
        this._setTime(moduleObj._curSec);
    }

    _delSec (){
        moduleObj._curSec -= 1;
        this._setTime(moduleObj._curSec);
        if(moduleObj._curSec < 1){
            moduleObj._isUpdate = false;
            if(this._endCallFunc){
                this._endCallFunc(this);
                this._endCallFunc = null;
            }
        }
    }

    _setTime (timeNum){
        this.node_lab_time.getComponent(cc.Label).string = timeNum;
    }

    update(dt) {
        if(moduleObj._isUpdate){
            if(moduleObj._runTime >= 1){
                moduleObj._runTime -= 1;
                this._delSec();
                if(this._listenerFunc){
                    this._listenerFunc();
                }
            }else moduleObj._runTime += dt;
        }
    }
}
