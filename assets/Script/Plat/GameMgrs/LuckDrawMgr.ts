import BaseMgr from "../Libs/BaseMgr";


export default class LuckDrawMgr  extends BaseMgr {
    awardListInfo : any =[]
    luckDrawInfo : any = {}
    drawResult : any = {}
    uid:any = null
    routes : any = {}
    constructor ()
    {
        super();
        this.awardListInfo = [
            {
                propID:1,
                propName:'iphoneX',
                imagePath:'Plat/LuckDraw/raffle_reward_1',
            },
            {
                propID:2,
                propName:'20元购物卡',
                imagePath:'Plat/LuckDraw/raffle_reward_2',
            },
            {
                propID:3,
                propName:'50元话费',
                imagePath:'Plat/LuckDraw/raffle_reward_3',
            },
            { 
                propID:4,
                propName:'3元红包',
                imagePath:'Plat/LuckDraw/raffle_reward_4',
            },
            { 
                propID:5,
                propName:'50元购物卡',
                imagePath:'Plat/LuckDraw/raffle_reward_5',
            },
            { 
                propID:6,
                propName:'1元红包',
                imagePath:'Plat/LuckDraw/raffle_reward_6',
            },
            { 
                propID:7,
                propName:'100元话费',
                imagePath:'Plat/LuckDraw/raffle_reward_7',
            },
            { 
                propID:8,
                propName:'2元红包',
                imagePath:'Plat/LuckDraw/raffle_reward_8',
            },
            { 
                propID:9,
                propName:'100元购物卡',
                imagePath:'Plat/LuckDraw/raffle_reward_9',
            },
            { 
                propID:10,
                propName:'5元红包',
                imagePath:'Plat/LuckDraw/raffle_reward_10',
            }, 
            { 
                propID:11,
                propName:'200元话费',
                imagePath:'Plat/LuckDraw/raffle_reward_11',
            }, 
            { 
                propID:12,
                propName:'10元红包',
                imagePath:'Plat/LuckDraw/raffle_reward_12',
            }, 
        ]
        this.luckDrawInfo = {
            bDraw : false,
            wechatNume : 'dzwp01',
        }
        this.drawResult = {
            propID : 12,
            propName : '10元话费',
        }
        this.routes = {
            'http.reqAwardList':this.http_reqAwardListCB,
            'http.reqDrawResult':this.http_reqDrawResultCB,
        }
    }

    getAwardList(){
        return this.awardListInfo;
    }

    getLuckDrawInfo(){
        return this.luckDrawInfo;
    }

    http_reqAwardList(msg){
        this.send_msg('http.reqAwardList', msg);
    }

    http_reqAwardListCB(msg){
        this.awardListInfo = msg;
    }

    http_reqDrawResult(msg){
        this.send_msg('http.reqDrawResult', msg);
    }

    http_reqDrawResultCB(msg){
        this.drawResult = msg;
    }

    private static _instance:LuckDrawMgr;
    public static getInstance():LuckDrawMgr{
        if(!this._instance){
            this._instance = new LuckDrawMgr;
        }
        return this._instance;
    }


}
