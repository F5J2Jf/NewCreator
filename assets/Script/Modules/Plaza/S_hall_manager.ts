import POMELO from "../../NetCenter/inGlobal_Pomelo";
import NET_TYPE from "../../Libs/Configs/inGlobal_NetInterface";
import DATAOBJ from "../../Libs/Configs/inGlobal_dataObject";
import HTTP from "../../NetCenter/inGlobal_HTTP"
import TableMgr from "../../GameManager/inGlobal_TableMgr";
import Part_setClickEvent from "../../Libs/Components/Part_setClickEvent";
import Enum from "../../Libs/Configs/inGlobal_Enum";
import BaseScene from "../../Libs/BaseScene";

//大厅管理器
const {ccclass, property} = cc._decorator;
@ccclass
export default class Hall extends BaseScene{
    _clickEvent : Part_setClickEvent
    _page : any

    onLoad (){

    }

    start (){
        this._clickEvent = this.getComponent(Enum.compName.clickAgent);
        //加载配置文件
        TableMgr.getInstance().reloadTables(Enum.dict_tablesName.audioName, ()=>{
            console.log('table data =', TableMgr.getInstance().getTable(Enum.dict_tablesName.audioName))
        })
        
        //网络请求
        // this.testNet();
    }

    testNet (){
        //网络请求_HTTP
        let dataObj = {
            openid : '113322',
            nickname : 'name_super',
            headimgurl : ''
        }
        let sendData = DATAOBJ.data_http();
        sendData.urlInterfac = NET_TYPE.doHttp(NET_TYPE.main_login, NET_TYPE.wxLogin);
        sendData.sendObj = dataObj;
        sendData.callFunc = (netData)=>{
            console.log('get http return here===', netData)
        }
        HTTP.getInstance().send(sendData);
        //网络请求_SOCKET
        POMELO.init({
            host: '127.0.0.1',
            port: 3014,
            log: true
        }, ()=>{
            let sendData = {
                userID : 111,
                rid:222
            };
            POMELO.request("connector.entryHandler.entry", sendData, (data)=> {
                console.log('_loginConnector data == ', data);
            });
        })
    }

    // update (dt) {},
}