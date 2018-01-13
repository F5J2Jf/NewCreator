  
var QzmjDef={
};


QzmjDef.process_ready=1;//准备
QzmjDef.process_dingzhuang=2;//定桩
QzmjDef.process_fapai=3;//发牌
QzmjDef.process_buhua=4;//补花
QzmjDef.process_kaijin=5;//开金 
QzmjDef.process_loop=6;//牌局循环 
QzmjDef.process_gamesettle=7;//游戏结算


//服务器检测各种时间的等级
 

QzmjDef.event_hu=1;//检测胡
QzmjDef.event_angang=2;//检测暗杠
QzmjDef.event_bugang=3;//检测补杠
QzmjDef.event_gang=4;//检测杠
QzmjDef.event_peng=5;//检测碰
QzmjDef.event_chi=6;//检测吃
QzmjDef.event_qiangjinhu=7;//检查抢金胡
QzmjDef.event_tianhu=8;//天胡,只针对庄家
QzmjDef.event_zimo=9;//检测自摸
QzmjDef.event_chupai=10;//出牌
QzmjDef.event_sanjindao=11;//三金倒  


//玩家操作
 
QzmjDef.op_hu=1;//胡 
QzmjDef.op_angang=2;//暗杠
QzmjDef.op_gang=3;//杠
QzmjDef.op_peng=4;//碰
QzmjDef.op_chi=5;//吃
QzmjDef.op_chupai=6;//出牌
QzmjDef.op_bugang=7;//补牌
QzmjDef.op_jiagang=8;//加牌
QzmjDef.op_zimo=9;//自摸
QzmjDef.op_qiangjinhu=10;//取消
QzmjDef.op_sanjindao=11;//取消
QzmjDef.op_cancel=20;//取消
QzmjDef.op_restartgame=21;//重新开始游戏
 

//客户端通知事件
QzmjDef.onOp='onOp';//操作通知
QzmjDef.onSeatChange='onSeatChange';//牌权改变通知
QzmjDef.onEvent='onEvent';//牌事件通知
QzmjDef.onProcess='onProcess';//进度通知 
QzmjDef.onSyncData='onSyncData';//同步数据
QzmjDef.onDeposit='onDeposit';//托管

QzmjDef.op_cfg={}
QzmjDef.op_cfg[QzmjDef.event_hu]=QzmjDef.op_hu;
QzmjDef.op_cfg[QzmjDef.event_angang]=QzmjDef.op_angang;
QzmjDef.op_cfg[QzmjDef.event_bugang]=QzmjDef.op_bugang;
QzmjDef.op_cfg[QzmjDef.event_gang]=QzmjDef.op_gang;
QzmjDef.op_cfg[QzmjDef.event_peng]=QzmjDef.op_peng;
QzmjDef.op_cfg[QzmjDef.event_chi]=QzmjDef.op_chi;
QzmjDef.op_cfg[QzmjDef.event_zimo]=QzmjDef.op_zimo;
QzmjDef.op_cfg[QzmjDef.event_chupai]=QzmjDef.op_chupai;
QzmjDef.op_cfg[QzmjDef.event_qiangjinhu]=QzmjDef.op_hu;
QzmjDef.op_cfg[QzmjDef.event_tianhu]=QzmjDef.op_hu;
QzmjDef.op_cfg[QzmjDef.event_sanjindao]=QzmjDef.op_hu;
 



//按胡牌的时机
QzmjDef.hutime_tianhu=1;//天胡
QzmjDef.hutime_qiangjin=2;//抢金
QzmjDef.hutime_dihu=3;//地胡
QzmjDef.hutime_zimo=5;//自摸
QzmjDef.hutime_dianpao=6;//点炮
QzmjDef.hutime_lastfour=7;//最后四张


  

//胡牌类型
QzmjDef.hutype_normal=0;//普通
QzmjDef.hutype_sanjindao=1;//三金倒
QzmjDef.hutype_jinque=2;//金雀
QzmjDef.hutype_jinkang=3;//金坎
QzmjDef.hutype_jinlong=4;//金龙
QzmjDef.hutype_chunqingyise=5;//纯清一色
QzmjDef.hutype_hunqingyise=6;//混清一色
QzmjDef.hutype_xianjin=7;//闲金
QzmjDef.hutype_dandiao=8;//单钓 

  

 
//可以吃的目标增量
QzmjDef.chiarr=[[1,2][-1,1],[-2,-1]];

export const QzmjDef=QzmjDef;
 
