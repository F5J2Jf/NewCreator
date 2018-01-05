//全局的监听机制

const {ccclass, property} = cc._decorator;

@ccclass
export default class Listener{
    _dict_listeners:any;
    _list_delIndex:Array<number>;
    _listenerIndex:number;

    init (){
        this._dict_listeners = {};
        this._list_delIndex = [];
        this._listenerIndex = 0;
    }
    //增加监听
    registerFunc (eventType:string, callFunc:Function) {
        if(Object.prototype.toString.call(callFunc) === "[object Function]"){
            if(!this._dict_listeners[eventType]) this._dict_listeners[eventType] = {};
            var listenerName;
            if(callFunc['name']) listenerName = callFunc['name']+'_'+this._getListenerIndex();
            else listenerName = "defaultName"+'_'+this._getListenerIndex();
            this._dict_listeners[eventType][listenerName] = callFunc;
            return listenerName
        }
        //registerFunc, error eventType== or error callFunc
        //debugger;
        cc.error('registerFunc, error eventType=='+eventType);
        return null
    }
    //去除监听
    delListen (eventType:string, listenerName:string) {
        if(!this._dict_listeners[eventType]) return;
        if(this._dict_listeners[eventType][listenerName]){
            this._whenCancelListener(listenerName);
            //有这个监听
            delete this._dict_listeners[eventType][listenerName];
            if(Object.keys(this._dict_listeners[eventType]).length < 1) this._dict_listeners[eventType] = null;
        }
    }
    //派送监听的事件
    dispatchEventEX (eventType:string, data){
        var listenersList = this._dict_listeners[eventType];
        if(listenersList){
            //存在监听对象
            var callFunc;
            for(var name in listenersList){
                callFunc = listenersList[name];
                if(cc.isValid(callFunc) && Object.prototype.toString.call(callFunc) === "[object Function]"){
                    callFunc(name, data);
                }else {
                    cc.log('delete no valid listenerFunc=='+eventType)
                    this.delListen(eventType, name);
                }
            }
        }
    }
    //监听被删除
    _whenCancelListener (listenerName:string){
        var indexList = listenerName.split('_');
        var listenerIndex = parseInt(indexList[indexList.length - 1]);
        this._list_delIndex.push(listenerIndex);
    }
    //获取可用的监听索引
    _getListenerIndex () {
        if(this._list_delIndex[0]){
            return this._list_delIndex.splice(0,1);
        }else{
            this._listenerIndex += 1;
            return this._listenerIndex
        }
    }

    //获取编辑好后的对象
    getTypeObj (patchType, listenerName){
        return {
            patchType : patchType,                                      //监听需要的类型
            listenerName : listenerName                                 //监听返回的类型
        }
    }

    //单例处理
    private static _instance : Listener;
    public static getInstance (){
        if(!this._instance){
            this._instance = new Listener();
            this._instance.init();
        }
        return this._instance;
    }

    // update (dt) {},
}