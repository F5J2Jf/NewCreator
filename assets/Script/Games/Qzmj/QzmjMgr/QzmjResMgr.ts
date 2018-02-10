

var MajiangType={}
MajiangType.emMJType_Wan    = 1; //万  
MajiangType.emMJType_Tiao   = 2; //条  
MajiangType.emMJType_Tong   = 3; //筒  
MajiangType.emMJType_Zi = 4; //字  
MajiangType.emMJType_Hua    = 5 ; //花  
   
 
var COB=function(  m,   n) {  
    return m << 4 | (n & 0x0F);  
}  
  
var  Majiang_Type=function(  m) {  
    return  m >> 4 ;  
}  
  
var  Majiang_Value=function(  m) {  
    return m & 0x0F;  
}  
  
var emMJ = {};
  
emMJ.emMJ_Joker = 0;     //变后的赖子  
emMJ.emMJ_1Wan = COB(MajiangType.emMJType_Wan, 1);  
emMJ.emMJ_2Wan = COB(MajiangType.emMJType_Wan, 2);  
emMJ.emMJ_3Wan = COB(MajiangType.emMJType_Wan, 3);  
emMJ.emMJ_4Wan = COB(MajiangType.emMJType_Wan, 4);  
emMJ.emMJ_5Wan = COB(MajiangType.emMJType_Wan, 5);  
emMJ.emMJ_6Wan = COB(MajiangType.emMJType_Wan, 6);  
emMJ.emMJ_7Wan = COB(MajiangType.emMJType_Wan, 7);  
emMJ.emMJ_8Wan = COB(MajiangType.emMJType_Wan, 8);  
emMJ.emMJ_9Wan = COB(MajiangType.emMJType_Wan, 9);  

emMJ.emMJ_1Tiao = COB(MajiangType.emMJType_Tiao, 1);  
emMJ.emMJ_2Tiao = COB(MajiangType.emMJType_Tiao, 2);  
emMJ.emMJ_3Tiao = COB(MajiangType.emMJType_Tiao, 3);  
emMJ.emMJ_4Tiao = COB(MajiangType.emMJType_Tiao, 4);  
emMJ.emMJ_5Tiao = COB(MajiangType.emMJType_Tiao, 5);  
emMJ.emMJ_6Tiao = COB(MajiangType.emMJType_Tiao, 6);  
emMJ.emMJ_7Tiao = COB(MajiangType.emMJType_Tiao, 7);  
emMJ.emMJ_8Tiao = COB(MajiangType.emMJType_Tiao, 8);  
emMJ.emMJ_9Tiao = COB(MajiangType.emMJType_Tiao, 9);  

emMJ.emMJ_1Tong = COB(MajiangType.emMJType_Tong, 1);  
emMJ.emMJ_2Tong = COB(MajiangType.emMJType_Tong, 2);  
emMJ.emMJ_3Tong = COB(MajiangType.emMJType_Tong, 3);  
emMJ.emMJ_4Tong = COB(MajiangType.emMJType_Tong, 4);  
emMJ.emMJ_5Tong = COB(MajiangType.emMJType_Tong, 5);  
emMJ.emMJ_6Tong = COB(MajiangType.emMJType_Tong, 6);  
emMJ.emMJ_7Tong = COB(MajiangType.emMJType_Tong, 7);  
emMJ.emMJ_8Tong = COB(MajiangType.emMJType_Tong, 8);  
emMJ.emMJ_9Tong = COB(MajiangType.emMJType_Tong, 9);  

emMJ.emMJ_DongFeng =     COB(MajiangType.emMJType_Zi, 1);//东 
emMJ.emMJ_NanFeng =      COB(MajiangType.emMJType_Zi, 3);//南  
emMJ.emMJ_XiFeng =       COB(MajiangType.emMJType_Zi, 5);//西  
emMJ.emMJ_BeiFeng =      COB(MajiangType.emMJType_Zi, 7);//北  

emMJ.emMJ_HongZhong =    COB(MajiangType.emMJType_Zi, 9);//中 
emMJ.emMJ_FaCai =        COB(MajiangType.emMJType_Zi, 11);//发 
emMJ.emMJ_BaiBan =       COB(MajiangType.emMJType_Zi, 13);//白  

//一副中花牌各只有一张  
emMJ.emMJ_Mei =  COB(MajiangType.emMJType_Hua, 1);//梅  
emMJ.emMJ_Lan =  COB(MajiangType.emMJType_Hua, 3);//兰  
emMJ.emMJ_Ju =   COB(MajiangType.emMJType_Hua, 5);//菊  
emMJ.emMJ_Zhu =  COB(MajiangType.emMJType_Hua, 7);//竹  
emMJ.emMJ_Chun =     COB(MajiangType.emMJType_Hua, 9);//春  
emMJ.emMJ_Xia =  COB(MajiangType.emMJType_Hua, 11);//夏  
emMJ.emMJ_Qiu =  COB(MajiangType.emMJType_Hua, 13);//秋  
emMJ.emMJ_Dong =     COB(MajiangType.emMJType_Hua,15)  //冬  



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
    666:'angang',
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

    get3DCardTextureByValue(value)
    {
        if (value== 0 )
        {
            value=this.jin;
        }
        var cardName= QzmjResMgr.cardpngs[value];
        var texture=cc.loader.getRes(cc.url.raw(`resources/Games/Qzmj/MaJiang3d/${cardName}.png`))
        return texture;
    }
}

