//对象配置

const Objs = {
    data_changeScene (){
        return {
            sceneName : null,
        }
    },
    //http 请求
    data_http (){
        return {
            urlInterfac : null,                 //请求的接口
            sendObj : null,                     //发送的对象信息
            callFunc : null,                    //回调
            resetBaseIP : null,                 //可替换的基础IP
        }
    },
    data_scrollInit (){
        return {
            itemPrefab : null,
            itemFrame : null,
            lineNum : null,
            scrollType : null,
            offX : null,
            offY : null,
        }
    }
}

export default Objs;