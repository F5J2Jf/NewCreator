//
 
export default class BehaviorMgr{ 
    //单例处理

    //商店模块传值
    private goodsId = null;
    private goodsType = null;
    private goodsBuyId = null;
    private goodsBuyType = null;
    //排行模块传值
    private rankData = null;
    //gm换牌
    public changeSeatId = null;

    private static _instance:BehaviorMgr;
    
    public static getInstance ():BehaviorMgr{
        if(!this._instance){
            this._instance = new BehaviorMgr();
        }
        return this._instance;
    }
    //商店子元素点击按钮需要获取的数据
    setGoodsItemData(_id, _type){
        this.goodsId = _id;
        this.goodsType = _type;
    }
    getGoodsItemData(){
        return new Array(this.goodsId, this.goodsType);
    }
    //商店购买道具弹出窗需要获取的数据
    setGoodsBuyData(_id, _type){
        this.goodsBuyId = _id;
        this.goodsBuyType = _type;
    }
    getGoodsBuyData(){
        return new Array(this.goodsBuyId, this.goodsBuyType);
    }

    //排行榜传值 {index, id, icon, name, award, sex, site}
    setRankItemData(data){
        this.rankData = data;
    }
    getRankItemData(){
        return this.rankData;
    }
}