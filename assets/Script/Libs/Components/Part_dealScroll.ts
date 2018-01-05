//滚动层的封装，横，竖，背包

const {ccclass, property} = cc._decorator;

let SCROLLTYPE = cc.Enum({
    horizontal : 1,                                                                                                       //横向放置单元
    vertical : 2,                                                                                                         //竖向放置单元
    bag : 3,                                                                                                              //背包格式放置单元
})

@ccclass
export default class Part_dealScroll extends cc.Component{
    _itemPrefab : cc.Prefab                                                                                           //条目的复制体
    _showItemNum : number                                                                                             //显示的条目数量
    _itemHeight : number                                                                                              //条目的高度
    _itemWidth : number                                                                                               //条目的宽度
    _itemOffX : number                                                                                                //条目之间的间隔
    _itemOffY : number                                                                                                //条目之间的间隔
    _pool : cc.pool                                                                                                   //对象池
    _scrollType : number                                                                                              //滚动容器的类型
    _viewW2 : number                                                                                                  //可视区域宽度的一半
    //背包类型需要用到的属性
    _lineNum : number                                                                                                 //每一行的单元数量

    _itemInit_Frame : any

    // use this for initialization
    onLoad (){
        
    }
        
    setData (dataObj) {
        this._initData();
        this._itemPrefab = dataObj.itemPrefab;
        this._itemInit_Frame = dataObj.itemFrame;
        this._lineNum = dataObj.lineNum;
        this._scrollType = dataObj.scrollType;
        //设置间隔
        if(dataObj.offX){
            this._itemOffX = dataObj.offX;
        }else this._itemOffX = 0;
        if(dataObj.offY){
            this._itemOffY = dataObj.offY;
        }else this._itemOffY = 0;
        //默认类型
        if(!this._scrollType) this._scrollType = SCROLLTYPE.vertical;
        this._destroyChildren(this.node);
    }
    _initData () {
        this._showItemNum = 0;
        this._itemHeight = null;
        this._itemWidth = null;
        if(!this._viewW2) this._viewW2 = this.node.parent.width*0.5;
    }

    //添加一个条目
    addOneItem () {
        var item = this._getOnePoolNode();

        switch (this._scrollType){
            case SCROLLTYPE.vertical:
                item.anchorY = 0.5;
                item.y = -this._showItemNum * (this._itemHeight + this._itemOffY) - this._itemHeight/2;
                break;
            case SCROLLTYPE.horizontal://水平滚动层，需要去掉水平方向的widget
                var startPosX = -this._viewW2;
                item.x = startPosX + this._showItemNum * (this._itemWidth + this._itemOffY);
                break;
            case SCROLLTYPE.bag:
                item.anchorY = 1;
                var startPosX = -this._viewW2;
                var lineNum;
                if(this._showItemNum == 0) lineNum = 0;
                else lineNum = this._showItemNum%this._lineNum;
                var rowNum = Math.floor(this._showItemNum/this._lineNum);
                item.x = startPosX + lineNum * (this._itemWidth + this._itemOffX) + this._itemWidth/2;
                item.y = -rowNum * (this._itemHeight + this._itemOffY);
                break;
            default:
                break;
        }

        this._showItemNum += 1;
        this._resetContainerSize();
        return item
    }

    //获取某个条目(从0开始)
    getItemByIndex (index) {
        var items = this.node.children;
        var item = items[index];
        if(item) return item;
        return this.addOneItem();
    }

    //获取所有的条目
    getAllItems () {
        return this.node.children;
    }

    //清理条目（从0开始，清理index之后的条目, 不包括index）
    clearItems (index) {
        var items = this.node.children;
        for(var i = items.length-1; i > index; i --){
            if(items[i]) this._removePoolNode(items[i]);
        }
    }

    //直接设置容器的大小
    setContentSize (width, height) {
        if(width) this.node.width = width;
        if(height) this.node.height = height;
    }

    //=====================================================

    //获取一个条目
    _getOnePoolNode () {
        //if(!this._itemPrefab) return null;
        let target = this._itemPrefab ? this._itemPrefab : this._itemInit_Frame;
        let typeName = '_Obj_dealScroll'+target.name;
        if(!this[typeName]) this[typeName] = new cc.NodePool(typeName);

        var cNode = this[typeName].get();
        if(!cNode){
            if(this._itemPrefab){
                cNode = cc.instantiate(this._itemPrefab);
            }else{
                cNode = new cc.Node();
                cNode.addComponent(cc.Sprite).spriteFrame = this._itemInit_Frame;
            }
            this._itemHeight = cNode.height;
            this._itemWidth = cNode.width;
        }
        cNode.parent = this.node;
        cNode.active = true;
        return cNode;
    }

    _removePoolNode (cNode) {
        // cNode.active = false;
        let typeName = '_Obj_dealScroll'+this._itemPrefab.name;
        this[typeName].put(cNode);

        this._showItemNum -= 1;
        this._resetContainerSize();
    }

    _resetContainerSize () {
        var contentH, contentW;
        switch (this._scrollType){
            case SCROLLTYPE.vertical:
                contentW = this._itemWidth + this._itemOffX;
                contentH = this._showItemNum * (this._itemHeight + this._itemOffY);
                break;
            case SCROLLTYPE.horizontal:
                contentW = this._showItemNum * (this._itemWidth + this._itemOffX);
                contentH = this._itemHeight + this._itemOffY;
                break;
            case SCROLLTYPE.bag:
                contentW = this._lineNum * (this._itemWidth + this._itemOffX);
                var rowNum = Math.ceil(this._showItemNum/this._lineNum);
                contentH = rowNum * (this._itemHeight + this._itemOffY);
                break;
            default:
                break;
        }
        this.node.height = contentH;
        this.node.width = contentW;
    }

    //获取当前已经显示的条目数量
    getShowItemNum ():number{
        return this._showItemNum
    }

    //获取scrollview组件
    getScrollView ():cc.ScrollView {
        return this.node.parent.parent.getComponent(cc.ScrollView)
    }

    //注册滚动到底部的事件
    registerBottomEvent () {

    }

    //获取下一页的更新信息
    getNextPageList (dataList, intervalNum) {
        return dataList.splice(0,intervalNum);
    }

    //根据数量获取页数 从1开始
    getPageNoByNum (itemNum, firstNum):number{
        var pageNo = Math.floor(itemNum / firstNum);
        if(itemNum > pageNo * firstNum){
            pageNo += 1;
        }
        return pageNo
    }
    //移动到最顶部
    scrollToUp () {
        this.getScrollView().scrollToTop(0.2);
    }
    //获取滚动层的类型枚举
    getScrollType (){
        return SCROLLTYPE;
    }

    _destroyChildren (target:cc.Node){
        let curList = target.children,
            len = curList.length,
            i,
            child;
        for(i = 0; i < len; i ++){
            child = curList[i];
            if(child && cc.isValid(child)){
                child.destroy();
            }
        }
    }

    onDestroy () {
        if(this._itemPrefab){
            let typeName = '_Obj_dealScroll'+this._itemPrefab.name;
            if(this[typeName]) this[typeName].clear();
        }
    }
    // update (dt) {},
}