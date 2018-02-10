  
var QzmjDef={
};
   

//gm操作

QzmjDef.gmop_changecard=1;//gm换牌
QzmjDef.gmop_changewallorder=2;//gm更换牌墙顺序
QzmjDef.gmreq_cards=1;//gm请求牌型

//游金状态
QzmjDef.danyoustate_null=0;//单游
QzmjDef.danyoustate_danyou=1;//单游
QzmjDef.danyoustate_shuangyou=2;//单游
QzmjDef.danyoustate_sanyou=3;//单游




QzmjDef.state_idle=1;//等待状态
QzmjDef.state_chupai=2;//出牌状态
QzmjDef.state_event=3;//事件状态




QzmjDef.process_ready=1;//准备
QzmjDef.process_dingzhuang=2;//定桩
QzmjDef.process_fapai=3;//发牌
QzmjDef.process_buhua=4;//补花
QzmjDef.process_kaijin=5;//开金 
QzmjDef.process_loop=6;//牌局循环 
QzmjDef.process_gamesettle=7;//游戏结算
QzmjDef.process_shuangyou=8;//双游

//服务器检测各种时间的等级
 
//操作优先级从小到大 
QzmjDef.event_chupai=1;//出牌
QzmjDef.event_chi=2;//检测吃  
QzmjDef.event_peng=3;//检测碰
QzmjDef.event_gang=4;//检测杠
QzmjDef.event_angang=5;//检测暗杠
QzmjDef.event_bugang=6;//检测补杠
QzmjDef.event_zimo=7;//检测自摸
QzmjDef.event_sanjindao=8;//三金倒  
QzmjDef.event_hu=9;//检测胡
QzmjDef.event_qianggang_hu=10;//抢杠胡
QzmjDef.event_danyou=11;//单游
QzmjDef.event_shuangyou=12;//双游
QzmjDef.event_sanyou=13;//三游
QzmjDef.event_bazhanghua=14;//八张花

//玩家操作
 
QzmjDef.op_hu=1;//胡 
QzmjDef.op_angang=2;//暗杠
QzmjDef.op_gang=3;//杠
QzmjDef.op_peng=4;//碰
QzmjDef.op_chi=5;//吃
QzmjDef.op_chupai=6;//出牌
QzmjDef.op_bugang=7;//补牌 
QzmjDef.op_zimo=9;//自摸
QzmjDef.op_sanjindao=11;//三金倒
QzmjDef.op_qianggang_hu=12;//抢杠胡
QzmjDef.op_danyou=13;//游金
QzmjDef.op_shuangyou=14;//双游
QzmjDef.op_sanyou=15;//三游
QzmjDef.op_bazhanghua=16;//八张花
QzmjDef.op_cancel=20;//取消
 
 

//客户端通知事件
QzmjDef.onOp='onOp';//操作通知
QzmjDef.onSeatChange='onSeatChange';//牌权改变通知
QzmjDef.onEvent='onEvent';//牌事件通知
QzmjDef.onProcess='onProcess';//进度通知 
QzmjDef.onSyncData='onSyncData';//同步数据
QzmjDef.onDeposit='onDeposit';//托管
QzmjDef.onGmOp='onGmOp';//gm操作通知

QzmjDef.op_cfg={}
QzmjDef.op_cfg[QzmjDef.event_hu]=QzmjDef.op_hu;
QzmjDef.op_cfg[QzmjDef.event_angang]=QzmjDef.op_angang;
QzmjDef.op_cfg[QzmjDef.event_bugang]=QzmjDef.op_bugang;
QzmjDef.op_cfg[QzmjDef.event_gang]=QzmjDef.op_gang;
QzmjDef.op_cfg[QzmjDef.event_peng]=QzmjDef.op_peng;
QzmjDef.op_cfg[QzmjDef.event_chi]=QzmjDef.op_chi;
QzmjDef.op_cfg[QzmjDef.event_zimo]=QzmjDef.op_zimo;
QzmjDef.op_cfg[QzmjDef.event_chupai]=QzmjDef.op_chupai;
QzmjDef.op_cfg[QzmjDef.event_sanjindao]=QzmjDef.op_hu;
QzmjDef.op_cfg[QzmjDef.event_qianggang_hu]=QzmjDef.op_qianggang_hu;


QzmjDef.op_cfg[QzmjDef.event_danyou]=QzmjDef.op_danyou; 
QzmjDef.op_cfg[QzmjDef.event_shuangyou]=QzmjDef.op_shuangyou;
QzmjDef.op_cfg[QzmjDef.event_sanyou]=QzmjDef.op_sanyou;
QzmjDef.op_cfg[QzmjDef.event_bazhanghua]=QzmjDef.op_bazhanghua;
 



//按胡牌的时机 
//按胡牌的时机 
QzmjDef.hutime_zimo=5;//自摸
QzmjDef.hutime_danyou=6;//单游
QzmjDef.hutime_shuangyou=7;//双游
QzmjDef.hutime_sanyou=8;//三游
QzmjDef.hutime_bazhanghua=9;//八张花
QzmjDef.hutime_dianpao=10;//点炮 
QzmjDef.hutime_sanjindao=11;//三金倒


  

//胡牌类型
QzmjDef.hutype_normal=0;//普通

  


//可以吃的目标增量
QzmjDef.chiarr=[[1,2],[-1,1],[-2,-1]] 
   
export const QzmjDef=QzmjDef;
 
