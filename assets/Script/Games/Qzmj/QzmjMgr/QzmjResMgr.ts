var cardpngs={

    
    17:'mahjong_1',
    18:'mahjong_2',
    19:'mahjong_3',
    20:'mahjong_4',
    21:'mahjong_5',
    22:'mahjong_6',
    23:'mahjong_7',
    24:'mahjong_8',
    25:'mahjong_9',

    
    33:'mahjong_17',
    34:'mahjong_18',
    35:'mahjong_19',
    36:'mahjong_20',
    37:'mahjong_21',
    38:'mahjong_22',
    39:'mahjong_23',
    40:'mahjong_24',
    41:'mahjong_25', 

    49:'mahjong_33',
    50:'mahjong_34',
    51:'mahjong_35',
    52:'mahjong_36',
    53:'mahjong_37',
    54:'mahjong_38',
    55:'mahjong_39',
    56:'mahjong_40',
    57:'mahjong_41', 


    65:'mahjong_49',  
    67:'mahjong_50',  
    69:'mahjong_51',  
    71:'mahjong_52',    
    73:'mahjong_65',   
    75:'mahjong_66',  
    77:'mahjong_67',

    81:'mahjong_81',  
    83:'mahjong_82',  
    85:'mahjong_83', 
    87:'mahjong_84',


    89:'mahjong_97', 
    91:'mahjong_98', 
    93:'mahjong_99', 
    95:'mahjong_100',   
}
 
var huanames={
    65:'东',  
    67:'南',  
    69:'西',  
    71:'北',    
    73:'中',   
    75:'发',  
    77:'白',

    81:'梅',  
    83:'兰',  
    85:'竹', 
    87:'菊',


    89:'春', 
    91:'夏', 
    93:'秋', 
    95:'东',  	
}
 
export default class QzmjResMgr{
    static cardpngs=cardpngs;
    static huanames=huanames; 
 
    cards=[]
    wallcards=[]
    jin=null;  
    csbpath="3dres/mj/mj.c3b";
    cardcount=144+10;
    wallcount=144;
    private static _instance:QzmjResMgr;

    getTotalCount()
    {
        return this.cardcount+this.wallcount;
    } 
    loadCards(cb)
    { 
        this.cards=[]; 
        // for (var i = 1;i<this.cardcount;++i)
        // { 
        //     cc.Sprite3D:createAsync(this.csbpath, function(card)
        //         card:retain();
        //         card:setVisible(false)
        //         local info={};
        //         info.node=card;
        //         info.inuse=false;
        //         table.insert(this.cards,info)
        //         cb();
        //     end) 
        // end 
    }   
    loadWalls(cb)
    { 
        this.wallcards=[]; 
        //创建3d麻将资源 
        // for i = 1,this.wallcount do 
        //     cc.Sprite3D:createAsync(this.csbpath, function(card)
        //         card:retain();
        //         card:setVisible(false)
        //         local info={};
        //         info.node=card;
        //         info.inuse=false;
        //         table.insert(this.wallcards,info)
        //         cb();
        //     end) 
        // end 
    } 
    constructor()
    {
        this.jin=null; 
        this.cards=[]; 
        this.csbpath="3dres/mj/mj.c3b";
        this.cardcount=144+10;
        this.wallcount=144;
    }  
   
    clear()
    {
        // body
        for (var i = 0;i<this.cards.length;++i){ 
            var info=this.cards[i];
            info.node.setVisible(false);
            info.inuse=false; 
        }
        for (var i = 1;i<this.wallcards.length;++i){ 
            var info=this.wallcards[i];
            info.node.setVisible(false);
            info.inuse=false; 
        } 
    } 
    public static getInstance ():QzmjResMgr{
        if(!this._instance){
            this._instance = new QzmjResMgr();
        }
        return this._instance;
    } 
    getCardName(value)
    {
        if (value == 0){ 
            value=this.jin
        }  
        return `res/cocosstudio/pics/fqmj/tileface/${QzmjResMgr.cardpngs[value]}.png` 
    }
    setJin(jin)
    {
        this.jin=jin;
    } 
    removeCard(card)
    {
        // body
        card.inuse=false;
        card.node.setVisible(false);
    } 
    getCard(value)
    {
        // body
        for (var i = 0;i<this.cards.length;++i){
            var card=this.cards[i];
            if (! card.inuse){ 
                card.inuse=true;
                card.node.setVisible(true) 
                //替换金
                if (value && value== 0 )
                {
                    value=this.jin; 
                } 
                if (value && QzmjResMgr.cardpngs[value])
                {
                    //card.node.setTexture('res/3dres/mj/' .. QzmjResMgr.cardpngs[value] .. '.jpg',2)
                }
                return card
            } 
        }
        return null
    } 

    getWallCard()
    { 
        // body
        for (var i = 0;i<this.wallcards.length;++i)
        {
            var card=this.wallcards[i];
            if(card.inuse){ 
                card.inuse=true;
                card.node.setVisible(true)
                return card
            } 
        }
        return null
    }

    updateCard(card,value)
    {
        // body  
        if (value && QzmjResMgr.cardpngs[value])
        { 
            //card.node.setTexture('res/3dres/mj/' .. QzmjResMgr.cardpngs[value] .. '.jpg',2)
        }
    }
}
 