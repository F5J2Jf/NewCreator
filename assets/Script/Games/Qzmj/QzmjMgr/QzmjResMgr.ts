var cardpngs={
    //万
    17:'1',
    18:'2',
    19:'3',
    20:'4',
    21:'5',
    22:'6',
    23:'7',
    24:'8',
    25:'9',
    
    //条
    33:'21',
    34:'22',
    35:'23',
    36:'24',
    37:'25',
    38:'26',
    39:'27',
    40:'28',
    41:'29', 

    //筒
    49:'11',
    50:'12',
    51:'13',
    52:'14',
    53:'15',
    54:'16',
    55:'17',
    56:'18',
    57:'19', 



    //其他
    65:'31',  
    67:'32',  
    69:'33',  
    71:'34',    
    73:'35',   
    75:'36',  
    77:'37',

    81:'38',  
    83:'39',  
    85:'41', 
    87:'42',


    89:'43', 
    91:'44', 
    93:'45', 
    95:'46',  	
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
 
   
    jin=null;  
   
    private static _instance:QzmjResMgr;

 
    constructor()
    {
        this.jin=null;  
    }  
   
    clear()
    {
   
    } 
    public static getInstance ():QzmjResMgr{
        if(!this._instance){
            this._instance = new QzmjResMgr();
        }
        return this._instance;
    } 
 
    setJin(jin)
    {
        this.jin=jin;
    } 
 
    getCardTextureByValue(value)
    {
        if (value== 0 )
        {
            value=this.jin; 
        } 
        var cardName= QzmjResMgr.cardpngs[value];
        var texture=cc.loader.getRes(cc.url.raw(`resources/Games/Qzmj/MaJiang2d/${cardName}.png`)) 
        return texture;
    }
}
 