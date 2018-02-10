//
import BaseMgr from "../Libs/BaseMgr";
import UserMgr from "./UserMgr";

 
export default class RechargeMgr extends BaseMgr{
    billid:any = null
    routes:{} = null
    constructor (){
        super();

        this.billid=null;
        this.routes={
            'http.reqBill':this.http_reqBill, 
            'onPay' : this.onPay,    
        }
    }
   
    onPay(msg){ 
        //不直接刷新我的物品信息，要点击领取后主动获取
    }
    http_reqBill(msg) {
        this.billid=msg.billid; 
        this.send_msg('http.reqPay',{billid:this.billid});
    }

    reqBill(id){
        let billinfo={ 
            'id':id,
        }
        this.send_msg('http.reqBill',billinfo);
    }
    reqPay(billid){
        let billinfo={
            'billid':billid, 
        }
        this.send_msg('http.reqPay',billinfo);
    } 
    //goodstype:1表示钻石/元宝 2表示房卡，3表示金币
    //goodsid是列表中的id
    reqBuyGoods(goodstype,goodsid,goodnum){
        let goodsinfo={
            'goodstype':goodstype, 
            'goodsid':goodsid, 
            'goodnum':goodnum,
        }
        this.send_msg('http.reqBuyGoods',goodsinfo);
    }


    //单例处理
    private static _instance:RechargeMgr;
    public static getInstance ():RechargeMgr{
        if(!this._instance){
            this._instance = new RechargeMgr();
        }
        return this._instance;
    }
}