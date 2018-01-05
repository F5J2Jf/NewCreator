cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        _playerName : null,
        _roomID : null
    },

    // use this for initialization
    onLoad: function () {
        let labNode = new cc.Node();
        labNode.parent = this.node;
        labNode.addComponent(cc.Label).string = 'Lets start'
        labNode.getComponent(cc.Label).fontSize = 80;
        labNode.getComponent(cc.Label).lineHeight = 80;
        labNode.on(cc.Node.EventType.TOUCH_START, this._onClick_start, this);
    },

    _onClick_start (){
        cc.log('this touch start----')

        this.testSocket()
    },

    onNameEdit (editComp){
        cc.log('name ======', editComp.string)
        this._playerName = editComp.string;
    },
    onRoomIDEdit (editComp){
        cc.log('roomID ======', editComp.string)
        this._roomID = editComp.string;
    },

    testHttp (){
        let sendData = {
            name : 123,
            password : 456
        }
        let sendInfo = {};
        sendInfo.sendObj = sendData;
        sendInfo.callFunc = (res)=>{
            cc.log('this get return info ', res)
        }
        sendInfo.urlInterfac = NET_NAME.encode(NET_NAME.main_account, NET_NAME.account_register);
        G_HTTP().send(sendInfo);
    },

    testSocket (){
        let testName = this._playerName;
        let testRoomID = this._roomID;

        let self = this;
        var host = "127.0.0.1";
        var port = "3014";
        pomelo.init({
            host: host,
            port: port,
            log: true
        }, ()=> {
            pomelo.request('gate.gateHandler.queryEntry', {
                uid: testName
            }, (data)=> {
                pomelo.disconnect();
                cc.log('in pomelo return ==================')
                cc.log(data)
                if(data.code === 500) {
                    return;
                }
                self._test_connect(data.host, data.port, testName, testRoomID);
            });
            //pomelo.request("connector.entryHandler.entry", "hello pomelo", function(data) {
            //    cc.log(data.msg);
            //});
        });
    },

    _test_connect (host, port, name, roomID){
        let self = this;

        pomelo.init({
            host: host,
            port: port,
            log: true
        }, function() {
            var route = "connector.entryHandler.entry";
            pomelo.request(route, {
                username: name,
                rid: roomID
            }, function(data) {
                cc.log('in pomelo return ================== connector')
                cc.log(data)
                if(data.error) {
                    return;
                }
                //setName();
                //setRoom();
                //showChat();
                //initUserList(data);
                self._test_packet();
            });
        });
    },

    _test_packet (){
        cc.log('request packet handler ====')
        let route = 'packetMain.packetHandler.entry'
        pomelo.request(route, {
            username: this._playerName,
            rid: this._roomID
        }, function(data) {
            cc.log('in pomelo return ================== _test_packet')
            cc.log(data)
            if(data.error) {
                return;
            }
            //setName();
            //setRoom();
            //showChat();
            //initUserList(data);
        });
    }

    // called every frame
    //update: function (dt) {
    //
    //},
});
