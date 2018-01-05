//全局的玩家信息对象( 游戏中的玩家单例 )

const {ccclass, property} = cc._decorator;

@ccclass
export default class PLAYER{
    _sign : string                                                   //账户标志
    //用户信息
    _userGold : number                                              //金额
    _nickName : string                                               //名字
    _userID : number                                                 //玩家ID
    _headImgUrl : string                                             //玩家头像路径
    init (){

    }

    setPlayerData (playerData){
        this._setDefaultData(playerData);
    }
    _setDefaultData (curData){
        let keyName;
        for(let key in curData){
            keyName = '_'+key;
            this[keyName] = curData[key];
        }
    }

    //登录标志
    getSign (){
        return this._sign;
    }
    //金币
    getGold (){
        return this._userGold;
    }
    //名字
    getPlayerName (){
        return this._nickName;
    }
    //玩家ID
    getPlayerID (){
        return this._userID;
    }
    //玩家头像路径
    getHeadImg (){
        return this._headImgUrl;
    }
    
    //单例处理
    private static _instance : PLAYER;
    public static getInstance (){
        if(!this._instance){
            this._instance = new PLAYER();
            this._instance.init();
        }
        return this._instance;
    }

    // update (dt) {},
}