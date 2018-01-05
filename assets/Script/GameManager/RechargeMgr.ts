//
import BaseMgr from "./BaseMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RechargeMgr extends BaseMgr{
    billid:any = null
    routes:{} = null
    constructor (){
        super();

        this.billid=null;
        this.routes={
            'http.reqBill':this.http_reqBill.bind(this), 
            'onPay' : this.onPay.bind(this),
        }
    }

    onPay(msg){

    }
    http_reqBill(msg) {
        this.billid=msg;
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
    reqBuyGoods(goodstype,goodsid){
        let goodsinfo={
            'goodstype':goodstype, 
            'goodsid':goodsid, 
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