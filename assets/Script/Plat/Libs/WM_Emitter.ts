export default class WM_Emitter
{
    private m_listen_list=[];
    private m_next_id=1;
    private m_emitter_name=null;
    constructor(name)
    { 
        this.m_emitter_name=name; 
    }
    
    //注册一个事件
    on(event_id,call_back,listenler) { 
        //分配一个id,通过此id可以移除此监听
        var id=this.m_next_id;
        var event_item={};
        event_item['m_id']=this.m_next_id;
        event_item['m_call_back']=call_back;
        event_item['m_event_id']=event_id; 
        event_item['m_listenler']=listenler;
        this.m_listen_list.push(event_item);
        //并且自增长next_id
        this.m_next_id=this.m_next_id+1;
        return id;
    }    
    //发送一个事件
    emit(event_id,arg1,arg2)  
    {  
        for (var index = 0 ;index<this.m_listen_list.length;index++)
        {
            var event_item=this.m_listen_list[index] 
            if(event_item.m_event_id==event_id)
            {
                event_item.m_call_back(arg1,arg2); 
            }  
        }  
        
        //表示没有注册对应的消息 
        return true; 
    }
    remove_by_id(id) 
    {
        for (var index = 0 ;index<this.m_listen_list.length;index++)
        {
            var event_item=this.m_listen_list[index]
            if(event_item.m_id==id)
            {
                this.m_listen_list.slice(index,1); 
            }  
        }
    } 
    remove_by_listener(listenler){  
        var done=true;
        while(true){ 
            for (var index = 0 ;index<this.m_listen_list.length;index++)
            {
                var event_item=this.m_listen_list[index]
                if(event_item.m_listener==listenler)
                {
                    this.m_listen_list.slice(index,1); 
                    done=false;
                }
                if(done){
                    break;
                }  
            }
        } 
    } 
    clear()
    {
        this.m_listen_list=[];
        this.m_next_id=1;
        return true;
    } 
    reg_events(events,listenler) 
    {
        for(var event_id in events)
        {
            var callback=events[event_id];
            this.on(event_id,callback,listenler)
        }
    } 
}    
