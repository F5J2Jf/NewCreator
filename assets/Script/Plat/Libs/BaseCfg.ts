 

export default class BaseCfg{
    rootPath='Configs/Plat/cfgs/'

    loaded=false;
    getFullPath(cfgName)
    {
        return `${this.rootPath}${cfgName}`
    }
    loadRes(name,cb)
    {
        cc.loader.loadRes(name, function (err, data) {
            if(err)
            {
                console.log(`cc.loader.loadRes err=,${JSON.stringify(err)},${name}`)
            }
            else
            {
                cb.bind(this)(name,data)
            }
        }.bind(this));
    } 
    isLoaded()
    {
        return this.loaded;
    }
}