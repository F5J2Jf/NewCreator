 
export function g_deepClone(data){
    let str=JSON.stringify(data);
    let obj=JSON.parse(str)
    return obj;
} 
Array.prototype.removeByValue=function(value){
	var idx = this.findIdx(value);
	if (idx != -1) {
		this.splice(idx,1);
	}
}
Array.prototype.findIdx=function(value){
    for(var j = 0;j <this.length;j++){ 
        if (this[j] == value) {
            return j;
        }
    }
    return -1;
}