//pomelo 代理
let G_Pomelo = (<any>window).pomelo;

const POMELO = {
    init (params:{}, cb:Function){
        G_Pomelo.init(params, cb);
    },

    request (route:string, sendData:{}, cb:Function){
        G_Pomelo.request(route, sendData, cb);
    },

    getRootObj (){
        return G_Pomelo
    }
}

export default POMELO;