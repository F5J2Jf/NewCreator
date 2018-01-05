import inGlobal_ChineseConfig from "../../Libs/Configs/inGlobal_ChineseConfig";
import inGlobal_Enum from "../../Libs/Configs/inGlobal_Enum";
import BaseLayer from "../../Libs/BaseLayer";

/**
 * 聊天节点
 */

 const {ccclass, property} = cc._decorator;

 @ccclass
 export default class ChatNode extends BaseLayer {

    //表情预制资源
    @property(cc.Prefab)
    FaceItem : cc.Prefab = null;
    //常用语预制资源
    @property(cc.Prefab)
    TextItem : cc.Prefab = null;
    //聊天类型单选组
    @property(cc.ToggleGroup)
    ChatType : cc.ToggleGroup = null;
    //常用聊天单选
    @property(cc.Toggle)
    CommonType : cc.Toggle = null;
    //vip聊天单选
    @property(cc.Toggle)
    VipType : cc.Toggle = null;
    //聊天记录单选
    @property(cc.Toggle)
    HistoryType : cc.Toggle = null;
    //常用语列表
    @property(cc.ScrollView)
    ChatTextList : cc.ScrollView = null;
    //常用表情列表
    @property(cc.ScrollView)
    ChatFaceList : cc.ScrollView = null;
    //关闭
    @property(cc.Button)
    Close : cc.Button = null;
    @property(cc.SpriteAtlas)
    EmojiAtlas : cc.SpriteAtlas = null;

    _Buttonclick : any;

    onLoad () : void {
        let self = this;
        self._Buttonclick = self.node.getComponent(inGlobal_Enum.compName.clickAgent);
        self._Buttonclick.registerButton(self.CommonType.node, self.On_ButtonCommonType, self);
        self._Buttonclick.registerButton(self.VipType.node, self.On_ButtonVipType, self);
        self._Buttonclick.registerButton(self.HistoryType.node, self.On_ButtonHistoryType, self);
        self._Buttonclick.registerButton(self.Close.node, self.On_ButtonClose, self);
        self.On_ButtonCommonType(null);
    }

    _cleanInit () : void {
        
        let self = this;
        self.ChatTextList.content.removeAllChildren();
        self.ChatFaceList.content.removeAllChildren();
    }

    On_ButtonCommonType (event) : void {
        cc.log("常用");
        let self = this;
        let list = inGlobal_ChineseConfig.ChatText;
        let facelist = inGlobal_ChineseConfig.ChatPhoto;
        let content = self.ChatTextList.content;
        let width = content.getContentSize().width;
        content.removeAllChildren();
        content.setContentSize(new cc.Size(width, 0));
        for (let i in list) {
            let height = content.getContentSize().height;
            let item : cc.Node = cc.instantiate(self.TextItem);
            content.addChild(item);
            item.getComponent("cc.Label").string = list[i];
            height += item.getContentSize().height;
            self._Buttonclick.registerButton(item, self.On_ButtonChatMsg, self);
            content.setContentSize(new cc.Size(width, height));
        }

        let facecontent = self.ChatFaceList.content;
        let facewidth = facecontent.getContentSize().width;
        facecontent.removeAllChildren();
        facecontent.setContentSize(new cc.Size(width, 0));
        for (let i in facelist) {
            let height = facecontent.getContentSize().height;
            let item : cc.Node = cc.instantiate(self.FaceItem);
            facecontent.addChild(item);
            let sprite : cc.Sprite= item.getChildByName("face").getComponent("cc.Sprite");
            sprite.spriteFrame = self.EmojiAtlas.getSpriteFrame(facelist[i]);
            height += item.getContentSize().height;
            self._Buttonclick.registerButton(item.getChildByName("face"), self.On_ButtonChatMsg, self);
            facecontent.setContentSize(new cc.Size(width, height));
            item.getChildByName("face").name = facelist[i];
        }
        facecontent.setContentSize(new cc.Size(width, facecontent.getContentSize().height / 3));
    }

    On_ButtonVipType (event) : void {
        cc.log("VIP");
        this._cleanInit();
    }

    On_ButtonHistoryType (event) : void {
        cc.log("聊天历史");
        this._cleanInit();
    }

    On_ButtonChatMsg (event) : void {
        let label : cc.Label = event.target.getComponent("cc.Label");
        let string = "";
        if (label) {
            string = label.string;            
            // cc.log(string);        
        } else {
            string = event.target.name;
            // cc.log(string);
        }
        this.On_ButtonClose(null);
        this.node.parent.emit("chat", {msg : string});
    }

    On_ButtonClose (event) : void {
        let self = this;
        // self.node.parent.removeChild(self.node);
        self.node.active = false;
    }
 }