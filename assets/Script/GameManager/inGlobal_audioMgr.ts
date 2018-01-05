//音效管理器

import TableMgr from './inGlobal_TableMgr'
import Tools from './inGlobal_Tools'
import Enum from '../Libs/Configs/inGlobal_Enum'

const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioMgr{
    _reloadLoginURL : string                            //登录音效加载路径
    _reloadPlatformURL : string                         //大厅音效加载路径
    _reloadThirteenURL : string                         //十三水音效加载路径
    _reloadBullURL : string                             //牛牛音效加载路径

    _isOnLoad : Boolean                               //是否正在加载中
    _isReloadPlatform : Boolean                       //是否已经加载大厅音效
    _isReloadLogin : Boolean                          //是否已经加载登录音效
    _isReloadThirteen : Boolean                       //是否已经加载十三水音效
    _isReloadBull : Boolean                           //是否已经加载牛牛音效

    _lastMusicID : number                            //上次播放的背景音乐ID
    _dict_audioConfig : {}                           //音效配置
    _musicVolume : number                            //音乐音量
    _soundVolume : number                            //音效音量
    _bgMusicID : number                              //背景音乐的ID
    _dict_audioUrl : {}                              //存放所有音效的名字对应路径

    init (){
        this._musicVolume = 1;
        this._soundVolume = 1;
        this._dict_audioConfig = {'music':1,'sound':1};
        this._bgMusicID = -1;
        this._dict_audioUrl = {};

        // this.clearRes();
        //环境检测
        // this._environmentConfirm();
    }

    clearRes (){
        this._isOnLoad = false;
        this._isReloadPlatform = false;
        this._isReloadLogin = false;
        this._isReloadThirteen = false;
        this._isReloadBull = false;
    }

    //播放音乐
    playMusic (audioID) {
        if(!audioID) audioID = 1;
        if(this._lastMusicID === audioID) return;
        this._lastMusicID = audioID;

        var musicName = this.getAudioName(audioID);
        var url = this.getAudio(musicName);
        this._bgMusicID = cc.audioEngine.play(url, true, this._musicVolume);
    }

    //播放音效
    playSound (audioID) {
        if(this._soundVolume <= 0) return;
        var url = this.getAudio(this.getAudioName(audioID));
        return cc.audioEngine.play(url, false, this._soundVolume);
    }

    //调整音乐大小
    setMusicVolume (num) {
        this._musicVolume = num;
        cc.audioEngine.setVolume(0, num);
    }

    //调整音效大小
    setSoundVolume (num) {
        this._soundVolume = num;
        cc.audioEngine.setVolume(0, num);
    }

    //停止某个音效
    stopAudio (audioID) {
        cc.audioEngine.stop(audioID);
    }

    //获取音频文件
    getAudio (audioName) {
        if(!this._dict_audioUrl[audioName]) return cc.url.raw(Tools.getInstance().formatStr(Enum.localUrl.audio, audioName));
        // if(!this._dict_audioUrl[audioName]) return cc.url.raw("resources/music/platform/background.mp3", "background");
        return this._dict_audioUrl[audioName]
    }

    //=====================================
    //获取音效配置
    getAudioConfig () {
        return this._dict_audioConfig
    }
    //设置音效配置
    setAudioConfig (dict) {
        this.setMusicVolume(dict.music);
        this.setSoundVolume(dict.sound);
        this._dict_audioConfig['music'] = dict.music;
        this._dict_audioConfig['sound'] = dict.sound;
    }
    //保存音乐配置
    saveMusicConfig (volumeNum) {
        this.setMusicVolume(volumeNum);
        this._dict_audioConfig['music'] = volumeNum;
    }
    //保存音效配置
    saveSoundConfig (volumeNum) {
        this.setSoundVolume(volumeNum);
        this._dict_audioConfig['sound'] = volumeNum;
    }
    //=====================================
    //获取某个音频的名字
    getAudioName (audioID) {
        var tableObj = TableMgr.getInstance().getTable(Enum.dict_tablesName.audioName);
        var data = tableObj.getDataByID(audioID);
        if(data) return data.audioName;
        return null
    }

    //========================================预加载

    //加载登录音效
    reloadLoginAudio (callBack) {
        if(this._isOnLoad || this._isReloadLogin) {
            if(callBack){
                callBack();
                callBack = null;
            }
            return;
        }
        this._isOnLoad = true;
        let tables = [Enum.dict_tablesName.audioName];
        //G_TABLE().reloadTables(tables, callBack);
        TableMgr.getInstance().reloadTables(tables, function() {
            cc.loader.loadResDir(this._reloadLoginURL, (err, audioList) =>{
                this._isOnLoad = false;
                var isOk = false;
                cc.log('add musice success')
                //cc.log(audioList)
                if(err){
                    //加载音效发生问题
                    cc.error('reloadPlatformAudio ==  '+err)
                }else {
                    //cc.log(audioList);
                    this._parseReloadAudio(audioList);
                    this._isReloadLogin = true;
                    isOk = true;
                }
                if(callBack){
                    callBack(isOk);
                    callBack = null;
                }
            })
        }.bind(this));
    }
    //加载大厅音效
    reloadPlatformAudio (callBack) {
        if(this._isOnLoad || this._isReloadPlatform) {
            if(callBack){
                callBack();
                callBack = null;
            }
            return;
        }
        this._isOnLoad = true;
        cc.loader.loadResDir(this._reloadPlatformURL, (err, audioList) =>{
            this._isOnLoad = false;
            var isOk = false;
            if(err){
                //加载音效发生问题
                cc.error('reloadPlatformAudio ==  '+err)
            }else {
                //cc.log(audioList);
                if(audioList && audioList.length > 0) this._parseReloadAudio(audioList);
                this._isReloadPlatform = true;
            }
            if(callBack){
                callBack(isOk);
                callBack = null;
            }
        })
    }
    //加载十三水音效
    reloadThirteenAudio (callBack) {
        if(this._isOnLoad || this._isReloadThirteen) {
            if(callBack){
                callBack();
                callBack = null;
            }
            return;
        }
        this._isOnLoad = true;
        cc.loader.loadResDir(this._reloadThirteenURL, (err, audioList) =>{
            this._isOnLoad = false;
            var isOk = false;
            if(err){
                //加载音效发生问题
                cc.error('reloadPlatformAudio ==  '+err)
            }else {
                //cc.log(audioList);
                if(audioList && audioList.length > 0) this._parseReloadAudio(audioList);
                this._isReloadThirteen = true;
            }
            if(callBack){
                callBack(isOk);
                callBack = null;
            }
        })
    }
    //加载牛牛音效
    reloadBullAudio (callBack) {
        if(this._isOnLoad || this._isReloadBull) {
            if(callBack){
                callBack();
                callBack = null;
            }
            return;
        }
        this._isOnLoad = true;
        cc.loader.loadResDir(this._reloadBullURL, (err, audioList) =>{
            this._isOnLoad = false;
            var isOk = false;
            if(err){
                //加载音效发生问题
                cc.error('reloadPlatformAudio ==  '+err)
            }else {
                //cc.log(audioList);
                if(audioList && audioList.length > 0) this._parseReloadAudio(audioList);
                this._isReloadBull = true;
            }
            if(callBack){
                callBack(isOk);
                callBack = null;
            }
        })
    }

    //加载音效完成后的处理
    _parseReloadAudio (audioList){
        let audioUrl, urlEnd,audioName;
        for(var i = 0; i < audioList.length; i ++){
            audioUrl = audioList[i];
            urlEnd = audioUrl.substring(audioUrl.lastIndexOf('/')+1, audioUrl.length);
            audioName = urlEnd.split('.')[0];
            this._dict_audioUrl[audioName] = audioUrl;
        }
        cc.log(audioUrl, urlEnd);
    }

    //平台鉴定
    _environmentConfirm () {
        //switch (cc.sys.os){
        //    case cc.sys.OS_ANDROID:
        //        //android手机用ogg
        //        //this._reloadPlatformURL = 'Sounds/ogg_platform';
        //        //this._reloadGameRoomURL = 'Sounds/ogg_gameRoom';
        //        this._reloadPlatformURL = 'Sounds/mp3_platform';
        //        this._reloadGameRoomURL = 'Sounds/mp3_gameRoom';
        //        break
        //    case cc.sys.OS_IOS:
        //        //ios手机用mp3
        //        this._reloadPlatformURL = 'Sounds/mp3_platform';
        //        this._reloadGameRoomURL = 'Sounds/mp3_gameRoom';
        //        break
        //    default:
        //        break
        //}
        if(cc.sys.isNative){
            this._reloadLoginURL = 'Sounds/mp3_login';
            this._reloadPlatformURL = 'Sounds/mp3_platform';
            this._reloadThirteenURL = 'Sounds/mp3_thirteenGameRoom';
            this._reloadBullURL = 'Sounds/mp3_bullGameRoom';
        }else{
            var audio = new Audio();
            if(audio.canPlayType("audio/mp3")){
                this._reloadLoginURL = 'Sounds/mp3_login';
                this._reloadPlatformURL = 'Sounds/mp3_platform';
                this._reloadThirteenURL = 'Sounds/mp3_thirteenGameRoom';
                this._reloadBullURL = 'Sounds/mp3_bullGameRoom';
            }else if(audio.canPlayType("audio/ogg")){
                this._reloadLoginURL = 'Sounds/ogg_login';
                this._reloadPlatformURL = 'Sounds/ogg_platform';
                this._reloadThirteenURL = 'Sounds/ogg_thirteenGameRoom';
                this._reloadBullURL = 'Sounds/ogg_bullGameRoom';
            }
        }
    }
    
    //单例处理
    private static _instance : AudioMgr;
    public static getInstance (){
        if(!this._instance){
            this._instance = new AudioMgr();
            this._instance.init();
        }
        return this._instance;
    }

    // update (dt) {},
}