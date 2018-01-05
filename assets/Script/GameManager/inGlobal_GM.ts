import TopMgr from "./inGlobal_TopMgr";

//GM
(<any>window).GM = {
    hideHere (){
        TopMgr.getInstance().hideNetRequest();
    }
};