import Tools from "../../GameManager/inGlobal_Tools";
//加载界面的加载逻辑

const {ccclass, property} = cc._decorator;

@ccclass
export default class S_load_doLoading extends cc.Component{
    _curProgress : number                            //
    _maxProgress : number                            //
    _oneResProgress : number                         //

    _curLoadingNum : number                          //
    _toSceneName : string                            //
    _errTipStr : string                              //
    _callFunc_reloadDone : Function                  //加载完成
    _isResetLoad : Boolean                           //是否重新加载

    @property(cc.Node)
    node_lab_progress = null;

    onLoad () {
        
    }

    //初始化进度条
    initReload (sceneName, callFunc){
        this._curLoadingNum = 0;
        this._toSceneName = null;
        this._errTipStr = '';
        this._toSceneName = sceneName;
        this._callFunc_reloadDone = callFunc;

        this._preloadedScene(sceneName);
    }
    //开始进度条
    startProgress (){
        this._curProgress = 0;
        this._updateProgress(this._curProgress);
        this._maxProgress = 100;
        this._oneResProgress = Math.floor(this._maxProgress/this._curLoadingNum);
    }
    //注册一个资源加载
    registerReload (reloadNum = 1){
        this._curLoadingNum += reloadNum;
        return this._curLoadingNum
    }
    //完成一个资源加载
    oneCompleted (errInfo) {
        this._curLoadingNum -= 1;
        if(!errInfo) this._updateProgress(this._oneResProgress);
        if(this._curLoadingNum <= 0){
            this._whenProgressDone();
        }
    }
    //是否重新加载
    setIsResetLoad (isReset){
        this._isResetLoad = isReset;
    }
    //============================

    _preloadedScene (sceneName) {
        this._curLoadingNum += 1;
        let reloadIndex = this._curLoadingNum;
        cc.director.preloadScene(sceneName, (err)=> {
            if(err){
                this._reloadErr(reloadIndex);
            }
            this.oneCompleted(err);
        });
    }
    _updateProgress (progressValue){
        this._curProgress += progressValue;
        this._curProgress = Math.min(this._curProgress, this._maxProgress);
        this._setProgress(this._curProgress);
    }
    _setProgress (progress){
        if(this._errTipStr) {
            let errStr = '; reloadErrIndex: '+ this._errTipStr;
            this.node_lab_progress.getComponent(cc.Label).string = progress+'%'+errStr;
        }else{
            this.node_lab_progress.getComponent(cc.Label).string = progress+'%';
        }
    }
    _reloadErr (reloadIndex){
        this._errTipStr += reloadIndex + ',';
    }
    _whenProgressDone (){
        //this._comp_reloadLogic.whenProgressDone(this._errTipStr);
        if(this._callFunc_reloadDone){
            this._callFunc_reloadDone(this._errTipStr);
            this._callFunc_reloadDone = null;
        }
        if(!this._errTipStr) {
            this._setProgress(this._maxProgress);
            if(this._isResetLoad){
                this.getComponent('S_loading').initSceneData();
                this._isResetLoad = false;
            }else{
                Tools.getInstance().timeout(()=>{
                    cc.director.loadScene(this._toSceneName);
                }, 500)
            }
        }
    }

    // update (dt) {},
}