//表格管理器（表格的加载与获取）

const {ccclass, property} = cc._decorator;

@ccclass


class tableObj{
    // _nameList : Array<string>;
    // _typeList : Array<string>;
    _firstDict : {};
    _dataDict : {};
    _typeDict : {};
    _keyList : Array<number>;
    _keyIndexName : string;
    constructor (){
        console.log('table obj constructor init')
    }

    setData (dataDict:{}){
        this._firstDict = dataDict;
        this._keyIndexName = 'key_int';
        this._typeDict = dataDict[this._keyIndexName];
    }

    getDataByID (keyID:number){
        if(!this._dataDict) this._dataDict = {};
        else if(this._dataDict[keyID]) return this._dataDict[keyID];
        let firstData = this._firstDict[keyID];
        if(!firstData) return null;

        let dataName, dataValue, newDict = {};
        for(let key in firstData){
            dataName = key;
            dataValue = firstData[key];
            newDict[dataName] = this._parseByType(dataValue, this._typeDict[dataName], '1');
        }
        this._dataDict[keyID] = newDict;
        return newDict;
    }
    getKeyList (){
        this._reloadAllData();
        return this._keyList;
    }
    //获取第一条信息的值
    getFirstData (){
        this._reloadAllData();
        var data;
        for(var key in this._firstDict){
            data = this.getDataByID(parseInt(key));
            if(data) break;
        }
        return data;
    }
    _reloadAllData (){
        if(this._keyList) return;
        this._keyList = [];

        let lineData,
            keyInt:number;
        for(let key in this._firstDict){
            keyInt = parseInt(key);
            if(key == this._keyIndexName) continue;
            lineData = this._firstDict[key];
            if(!lineData) continue;
            this.getDataByID(keyInt);
            this._keyList.push(keyInt);
        }
    }

    //获取所有的表格信息
    getAllData () {
        this._reloadAllData();
        var data = {};
        for(let keyID in this._dataDict){
            data[keyID] = this._dataDict[keyID];
        }
        return data;
    }

    _parseByType (data:any, type:string, objName:string){
        if(data === undefined || data === null) return null;

        try {
            switch (type) {
                case 'key_int':
                    return parseInt(data);
                case 'number':
                    return parseFloat(data);
                case 'string':
                    return data.toString();
                case 'json':
                    data = data.replace(/\'/g,'\"');
                    return JSON.parse(data);
                case 'calculate':
                    return data.toString();
                default:
                    return null;
            }
        } catch (e) {
            console.log(e)
            // console.log('table parse _______ fileName =' + this._fileName + ';  objName =' + objName + ';  error obj =' + data)
            return null;
        }
    }
}



export default class TableMgr{
    _tDict : {};
    _callFunc : Function;
    _list_reloadNames : Array<string>;
    init (){

    }

    getTable (tableName){
        return this._tDict[tableName];
    }

    //导入表格
    reloadTables (tableNames:any, callFunc:Function) {
        var type = Object.prototype.toString.call(tableNames);
        switch (type){
            case '[object String]':
                this._list_reloadNames = [tableNames];
                break;
            case '[object Array]':
                this._list_reloadNames = tableNames;
                break;
            case '[object Object]':
                this._list_reloadNames = [];
                for(var key in tableNames){this._list_reloadNames.push(tableNames[key]);}
                break;
            default:
                return;
        }
        this._callFunc = callFunc;
        this._loadStep();
    }
    _loadStep () {
        if(this._list_reloadNames.length <= 0){
            if(this._callFunc) {
                this._callFunc();
                this._callFunc = null;
            }
            return
        }
        //var name = this._list_reloadNames[0];
        var name=this._list_reloadNames.splice(0,1);
        this._loadTable(name);
    }
    _loadTable (tableName) {
        if(this._tDict && this._tDict[tableName]) {
            this._loadStep();
            return;
        }
        cc.loader.loadRes("Configs/"+tableName, function (err, data) {
            if(err){
                console.log(err)
                if(this._callFunc) {
                    this._callFunc();
                    this._callFunc = null;
                }
            }else{
                if(!this._tDict) this._tDict = {};
                this._tDict[tableName] = this._sortData(data);
                this._loadStep();
            }
        }.bind(this));
    }

    _sortData (xdata){
        if(!xdata) {
            console.log('table is null')
            return null;
        }
        // this._data = xdata;
        var table = new tableObj();
        table.setData(xdata);
        return table;
    }
    
    //单例处理
    private static _instance : TableMgr;
    public static getInstance (){
        if(!this._instance){
            this._instance = new TableMgr();
            this._instance.init();
        }
        return this._instance;
    }

    // update (dt) {},
}