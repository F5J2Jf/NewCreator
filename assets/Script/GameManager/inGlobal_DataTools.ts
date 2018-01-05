import Enum from '../Libs/Configs/inGlobal_Enum'

//游戏全局缓存数据处理
const {ccclass, property} = cc._decorator;

@ccclass
export default class DataTools{
    text: string = 'hello';
    init (){

    }
    //切换场景data : @sceneName准备跳转的场景名字
    changeScene (data){
        this.setChangeSceneData(data);
        cc.director.loadScene(Enum.sceneName.loadScene);
    }
    //场景相关
    getChangeSceneData (){
        let data = this['_changeSceneData'];
        this['_changeSceneData'] = null;
        return data;
    }
    setChangeSceneData(data){
        this['_changeSceneData'] = data;
    }
    
    //单例处理
    private static _instance : DataTools;
    public static getInstance (){
        if(!this._instance){
            this._instance = new DataTools();
            this._instance.init();
        }
        return this._instance;
    }

    // update (dt) {},
}