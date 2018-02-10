/**
 * 邮件数据层
 * TODO:
 *  邮件服务端目前未有数据, 一切网络事件先用全局事件模拟操作
 */
import BaseMgr from "../Libs/BaseMgr";

export default class MailMgr extends BaseMgr{

    _mailData = null;
    _curReadMailID = null;
    routes:{} = null;

    constructor () {
        super();
        this.routes = {
            'http.reqMailData' : this.http_reqMailDataCB,
            'http.reqReadMail' : this.http_reqReadMailCB,
            'http.reqReceiveMail' : this.http_reqReceiveMailCB,
            'http.reqReadAllMail' : this.http_reqReadAllMailCB,
            'http.reqReceiveAllMail' : this.http_reqReceiveAllMailCB,
        }
        this._mailData = this.getTestMailData();
    }

    getTestMailData () {
        let localMailData = [
			{
                id : 1,                         // 邮件ID
                name : "[系统邮件]",            // 邮件标题
                detail : "这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件",    // 邮件文本内容
				read : false,                   // 是否已读
                receive : false,                // 是否领取奖励
                prize : null                    // 附件 如果这项没有数据默认为没有物品的邮件
			},
			{
				id : 2,
				name : "[好友邮件]",
				detail : "这是一封有附件的好友邮件",
				read : false,
                receive : false,
                prize : {
                    gold: {},
                    masonry: {},
                    exchange: {},
                    giftBag: {}
                }
			},
			{
				id : 3,
				name : "[抽奖邮件]",
				detail : "这是一封抽奖邮件",
                read : false,
                receive : false,
                prize : null
			},
			{
				id : 4,
				name : "[比赛邮件]",
				detail : "这是一封比赛邮件",
                read : false,
                receive : false,
                prize : null
			}
        ]
        return localMailData;
    };
    
    // 请求邮件数据
    http_reqMailData (msg) {
        console.log("http 请求邮件数据");
        //this.send_msg('http.reqMailData', msg);
        // 假装有数据
        this._mailData = this.getTestMailData();
        this.http_reqMailDataCB(this._mailData);
    }

    // 存储邮件数据
    http_reqMailDataCB (data) {
        console.log("http 请求回调,收到邮件数据将其存储");
        // 策划案只需要 50 条邮件, 真实数据到来之后这里做个数据截取
        // 没显示的邮件状态不会改变, 也不会消失, 等待玩家下次的邮件列表请求显示
        this._mailData = data;
        this.gemit('http.reqMailData');
    }

    // 通知服务器阅读了指定邮件
    http_reqReadMail () {
        let emailID = this.getCurReadMailID();
        console.log("阅读ID="+emailID+"的邮件");
        //this.send_msg("http.reqReadMail", emailID)
        //假装有数据
        this.http_reqReadMailCB({emailID: emailID, readState: true});
    }

    // 邮件阅读结果
    http_reqReadMailCB (data) {
        console.log("阅读邮件结果", data);
        let localMailData = [];
        // 过滤邮件
        for (let i = 0; i < this._mailData.length; i++) {
            let mailItemData = this._mailData[i];
            // 根据结果设置本地数据
            if (mailItemData.id == data.emailID) {
                mailItemData.read = data.readState;
            }
            this.filterMailData(mailItemData, localMailData);
        }
        this._mailData = localMailData;
        this.gemit('http.reqReadMail');
    }

    // 通知服务器领取指定邮件奖励
    http_reqReceiveMail () {
        let emailID = this.getCurReadMailID();
        console.log("领取ID="+emailID+"的邮件邮件奖励")
        //this.send_msg('http.reqReceiveMail', emailID)
        // 假装有数据
        this.http_reqReceiveMailCB({emailID: emailID, receiveState: true})
    }

    // 邮件奖励领取结果
    http_reqReceiveMailCB (data) {
        console.log("邮件奖励领取结果", data);
        let localMailData = [];
        for (let i = 0; i < this._mailData.length; i++) {
            let mailItemData = this._mailData[i];
            // 根据结果设置本地数据
            if (mailItemData.id == data.emailID) {
                mailItemData.receive = data.receiveState;
                // 领取奖励默认为阅读
                mailItemData.read = data.receiveState;
            }
            this.filterMailData(mailItemData, localMailData)
        }
        this._mailData = localMailData;
        this.gemit('http.reqReceiveMail');
    }

    // 阅读所有邮件
    http_reqReadAllMail (msg) {
        console.log("阅读所有邮件");
        //this.send_msg('http.reqReadAllMail', msg);
        // 假装有数据
        this.http_reqReadAllMailCB({allMailReadState: true});
    }

    // 阅读所有邮件结果
    http_reqReadAllMailCB (data) {
        console.log("阅读所有邮件结果", data);
        let localMailData = [];
        for (let i = 0; i < this._mailData.length; i++) {
            let mailItemData = this._mailData[i];
            // 根据结果设置本地数据
            mailItemData.read = data.allMailReadState;
            this.filterMailData(mailItemData, localMailData);
        }
        this._mailData = localMailData;
        this.gemit('http.reqReadAllMail');
    }

    // 领取所有邮件奖励
    http_reqReceiveAllMail (msg) {
        console.log("领取所有邮件奖励");
        //this.send_msg('http.reqReceiveAllMail', msg);
        // 假装有数据
        this.http_reqReceiveAllMailCB({allMailReceiveState: true});
    }

    // 领取所有邮件奖励结果
    http_reqReceiveAllMailCB (data) {
        console.log("领取所有邮件奖励结果", data)
        let localMailData = [];
        for (let i = 0; i < this._mailData.length; i++) {
            let mailItemData = this._mailData[i];
            // 根据结果设置本地数据
            mailItemData.receive = data.allMailReceiveState;
            // 如果是一键领取都默认为阅读了
            mailItemData.read = data.allMailReceiveState;
            this.filterMailData(mailItemData, localMailData);
        }
        this._mailData = localMailData;
        this.gemit('http.reqReceiveAllMail');
    }

    // 过滤邮件
    filterMailData (mailItemData, localMailData) {
        // 过滤无奖励品并且已读的邮件
        if (!mailItemData.prize && !mailItemData.read) {
            localMailData.push(mailItemData);
        }
        // 过滤有奖励品并且已领取的邮件
        if (mailItemData.prize && !mailItemData.receive) {
            localMailData.push(mailItemData);
        }
    }

    // 获取邮件数据
    getMailData () {
        console.log("获取邮件数据");
        return this._mailData;
    }

    // 设置当前阅读的邮件ID
    setCurReadMailID (emailID) {
        this._curReadMailID = emailID;
    }
    // 获取当前阅读的邮件ID
    getCurReadMailID () {
        return this._curReadMailID;
    }
    // 获取当前阅读的邮件内容
    getCurReadMailContent () {
        let curReadMailID = this.getCurReadMailID();
        let curReadMailContent = null;
        for (let i = 0; i < this._mailData.length; i++) {
            let mailItemData = this._mailData[i];
            if (mailItemData.id == curReadMailID) {
                curReadMailContent = mailItemData;
                break;
            }
        }
        return curReadMailContent;
    }

    // 单例模式
    private static _instance:MailMgr;
    public static getInstance ():MailMgr {
        if (!this._instance) {
            this._instance = new MailMgr();
        }
        return this._instance;
    }
}
