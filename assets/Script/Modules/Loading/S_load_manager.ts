//加载界面管理
import S_load_doLoading from './S_load_doLoading'
import Enum from '../../Libs/Configs/inGlobal_Enum';
import Objs from '../../Libs/Configs/inGlobal_dataObject';
import DataTools from '../../GameManager/inGlobal_DataTools';
import BaseScene from '../../Libs/BaseScene';

const {ccclass, property} = cc._decorator;

@ccclass
export default class S_load_manager extends BaseScene{
    _isResetLoad : Boolean                            //是否重新加载
    _comp_loading : S_load_doLoading
    _clickEvent : any    
    onLoad () {
        // GG.loadMgr = this;
        this._comp_loading = this.getComponent("S_load_doLoading");
    }

    start () {
        this.initSceneData();
    }

    initSceneData (){
        let curDataTools = DataTools.getInstance();
        let data = curDataTools.getChangeSceneData();
        if(data){
            //有数据，是从其他场景过来
            this.toScene(data.sceneName);
            curDataTools.setChangeSceneData(data);
        }else {
            //没有数据，是从游戏外部进来.默认进入登录界面
            let data = Objs.data_changeScene();
            data.sceneName = Enum.sceneName.Hall;
            curDataTools.setChangeSceneData(data);
            this.toScene(data.sceneName);
            this._whenGameStart();
        }
    }
    //是否重新加载
    setIsResetLoad (isReset){
        this._comp_loading.setIsResetLoad(isReset);
    }

    toScene (sceneName){
        this._comp_loading.initReload(sceneName, this._onReloadDone.bind(this));
        cc.log("跳转到此场景", sceneName);
        //====================test
        //this._comp_loading.registerReload();
        //setTimeout(()=>{
        //    this._comp_loading.oneCompleted();
        //}, 500);
        //
        //this._comp_loading.registerReload();
        //setTimeout(()=>{
        //    this._comp_loading.oneCompleted();
        //}, 1000);

        //预加载配置
        //switch (sceneName){
        //    case G_ENUM().sceneName.login:
        //        //登录
        //        this._comp_loading.registerReload();
        //        G_AUDIO().reloadLoginAudio(() =>{
        //            this._comp_loading.oneCompleted();
        //        });
        //        break;
        //    case G_ENUM().sceneName.platform:
        //        //大厅
        //        this._comp_loading.registerReload();
        //        G_AUDIO().reloadPlatformAudio(() =>{
        //            this._comp_loading.oneCompleted();
        //        });
        //        break;
        //    case G_ENUM().sceneName.Room_Thirteen:
        //        //十三水
        //        this._comp_loading.registerReload();
        //        G_AUDIO().reloadThirteenAudio(() =>{
        //            this._comp_loading.oneCompleted();
        //        });
        //        break;
        //    case G_ENUM().sceneName.Room_TB:
        //        //牛牛
        //        this._comp_loading.registerReload();
        //        G_AUDIO().reloadBullAudio(() =>{
        //            this._comp_loading.oneCompleted();
        //        });
        //        break;
        //    default:
        //        break;
        //}

        this._comp_loading.startProgress();
    }
    _onReloadDone (errLog){
        console.log('_onReloadDone---------------')
    }

    _whenGameStart (){
        // G_WEB().initWeb();
        // G_LISTENER_FUNC().registerFuncs();
    }
    
    // update (dt) {},
}