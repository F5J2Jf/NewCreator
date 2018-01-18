import { QzmjDef } from "./QzmjDef";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
Array.prototype.remove=function(index){
 
    for(var j = index;j <this.length-1;j++){ 
        this[j]=this[j+1]; 
    } 
    this.length = this.length-1;
}
Array.prototype.insert = function (index, item) {  
	this.splice(index, 0, item);  
};    
 
export default class QzmjPlayer
{
	deposit=false;//是否托管  
	tingarr=[]; 
	handcard=[];
	cardpool=[];
	huapais={};
	opcards=[];//操作的牌，如杠碰吃
	uid=null;
	seatid=null;
	logic=null;
	constructor()  
	{ 
		this.uid=null;//uid  
		this.seatid=null 
	} 
	getHuaCount()
	{
		var huacount=0;
		for(var cardvalue in this.huapais){
			var count=this.huapais[cardvalue];
			huacount=huacount+count;
		} 
		return huacount;
	} 
	getJinCount()
	{ 
		var jincount=0;
		for (var i = 0;i<this.handcard.length;++i)
		{
			if (this.handcard[i]==0)
			{
				jincount=jincount+1;
			}  
			return jincount;
		} 
	} 
	resetData()
	{ 
		// body
		this.deposit=false;//是否托管  
		this.tingarr=[]; 
		this.handcard=[];
		this.cardpool=[];
		this.huapais={};
		this.opcards=[];//操作的牌，如杠碰吃
	} 
	replaceJin()
	{
		for (var i = 0;i<this.handcard.length;++i)
		{
			if(this.handcard[i]==this.logic.jin)
			{
				this.handcard[i]=0;
			}
		} 
		this.sortCard()
	} 
	updateHandCard(handcard)
	{
 		this.handcard=handcard;
	} 
	getCard(index)
	{ 
		return this.handcard[index];
	} 
	pushCard(card)
	{
		// body
		if(!card){
			this.handcard.push(0)
		} 
		else{
			this.handcard.push(card)
		} 
	} 
	putInPool(card)
	{
		this.cardpool.push(card)
	} 
	removeCardFromPool()
	{
		this.cardpool.remove(this.cardpool.length-1);
	} 

	getChiCards(index)
	{ 
		// body  
		var curcard=this.logic.curcard; 
		var arr = QzmjDef.chiarr[index];
		var card1=curcard+arr[0];
		var card2=curcard+arr[1]; 
		var cards=[card1,card2] 
		return cards;
	} 
	removeCardByCount(card,count)
	{
		// body 
		for (var i = 0;i<count;++i)
		{ 
			this.removeCard(card);
		} 
	} 
	pushChi(index,cards) 
	{
		var chicards=cards;
	    chicards.insert(index,this.logic.curcard);
		var opinfo={
			'op':QzmjDef.op_chi,
			'value':chicards,
		}
		this.opcards.push(opinfo); 
	} 
	pushPeng(card)
	{
		// body
		var opinfo={
			'op':QzmjDef.op_peng,
			'value':card,
		}
		this.opcards.push(opinfo); 
	} 
	//加入杠
	pushGang(card)
	{
		// body 
		var opinfo={
			'op':QzmjDef.op_gang,
			'value':card,
		}
		this.opcards.push(opinfo);
	}  
	//加入暗杠
	pushAnGang(card)
	{
		// body 
		var opinfo={
			'op':QzmjDef.op_angang,
			'value':card,
		}
		this.opcards.push(opinfo); 
	} 
	removeCards(cards)
	{
		// body
		for(var i =0;i<cards.length;++i){ 
			this.removeCard(cards[i]);
		}
	} 
	removeCard(card)
	{
		// 移除手上的牌
		if(this.seatid==RoomMgr.getInstance().getMySeatId())
		{
			for (var i =0;i<this.handcard.length;++i)
			{
				var value=this.handcard[i];
				if (value==card)
				{ 
					this.handcard.remove(i);
					break;
				}  
			} 
		}
		else
		{ 
			this.handcard.remove(0);
		}
	} 
	init(seatid,logic)
	{ 
		this.seatid=seatid
		this.logic=logic;
	} 
	initHandCard(handcard)
	{
		this.handcard=handcard
		this.handcard.sort(function(a,b){
			return a-b;
		})
	}
	fillOthersCard(len)
	{
		this.handcard=[];
		for(var i = 0;i<len;++i)
		{
			this.handcard.push(0)
		} 
	} 

	buHua(huapaiarr,paiarr)  
	{
		for (var i=0;i<huapaiarr.length;++i)
		{ 
			this.putInHua(huapaiarr[i]);
		}
		if (this.seatid !=RoomMgr.getInstance().myseatid){ 
			return;
		}
		for(var i=0;i<huapaiarr.length;++i)
		{ 
			for (var j = 0;j<this.handcard.length;++j)
			{
				if (this.handcard[j] == huapaiarr[i]){

					this.handcard.remove(j)
					break;
				}  
			}  
		}  
		for (var i = 0;i<paiarr.length;++i)
		{
			this.handcard.push(paiarr[i])
		} 
		//补完牌就排序
    	this.sortCard();
	}
	sortCard()
	{
		this.handcard.sort(function(a,b){
			return a-b;
		})
	}
	putInHua(hua)
	{ 
		// body 
		if(!this.huapais[hua])
		{
			this.huapais[hua]=1;
		} 
		else
		{ 
			this.huapais[hua]=this.huapais[hua]+1;
		} 
	}
	findCard(value)
	{
		for (var i = 0;i<this.handcard.length;++i)
		{
			if(value==this.handcard[i])
			{
				return true;
			} 
		}  
		return false; 
	} 
	getCardsCandChi()
	{
		// body
		var cardsCanChi=[];
		var curcard=this.logic.curcard;
		for(let index=0;index <QzmjDef.chiarr.length;++index)
		{
			var arr=QzmjDef.chiarr[index];
			var card1=curcard+arr[0];
			var card2=curcard+arr[1]; 
			if	(this.findCard(card1) && this.findCard(card2))
			{ 
				var cards=[card1,card2]
				cards.insert(index,curcard);
				var chiinfo={
					'index':index,
					'cards':cards,
				}
				cardsCanChi.push(chiinfo); 
			}
		}
		return cardsCanChi;
	} 
	getCardsCanAnGang()
	{	// body
		var cardsCanAnGang=[];
		var curcard=this.logic.curcard;
		var cardcountmap={};
		for (var i=0;i<this.handcard.length;++i)
		{
			var card=this.handcard[i];
			if(!cardcountmap[card]){
				cardcountmap[card]=1;
			}
			else 
			{
				cardcountmap[card]=cardcountmap[card]+1;
			} 
		}  
		for (var cardvalue in cardcountmap){
			var count=cardcountmap[cardvalue]; 
			if (count==4)
			{
				console.log("QzmjPlayer:getCardsCanAnGang",cardvalue)
				cardsCanAnGang.push(cardvalue)
			} 
		} 
		console.log("cardnummap=")
		console.log(cardcountmap)
		console.log(cardsCanAnGang)
		return cardsCanAnGang;
	}
 
} 
