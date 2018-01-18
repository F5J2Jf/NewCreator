
# -*- coding: utf-8 -*- 
import sys; 
import os;
import os.path;	
from string import *; 
import sys; 
import time;
import json; 

members=[u'YOYO',u'JACKY',u'Justin']
class ModuleMvc:
	def input_class_name(self):
		while(1):
			print (u'请输入类名根名字,类名一定要驼峰命名,比如登陆界面,类名就是Login');
			print (u'如果是登陆界面,生成的模块文件夹就是Login,mvc代码文件就是LoginCtrl');
			print (u'按n键退出');
			a = raw_input();
			if a=='n':
				exit();
			self.m_class_name=a;
			break;
		#检查是否已存在此类
		result=self.check_class_exist();
		if result:
			self.show_create_files_menu();
	def check_class_exist(self): 
		self.m_ctrl_lua_name=self.m_class_name + 'Ctrl';  
		self.m_ctrl_cls_name=self.m_class_name + 'Ctrl'; 
		
		#判断路径是否已经存在
		self.m_dir='.';
		self.m_ctrl_lua_path=self.m_dir+'/'+self.m_ctrl_lua_name+'.ts';  
		return True
		
	def show_create_files_menu(self):
		while(1):
			print (u'选择作者即可创建,请输入序号');
			for i in range(len(members)):
				print (u'序号:%d名字:%s')%(i,members[i]);
			a = raw_input();
			mindex=int(a)
			if i>len(members):
				print("滚,这都会输错");
				self.input_class_name();
				return;
			self.author=members[mindex]
			self.time=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) 
			self.create_files();
	def create_files(self):
		print(u'你的控制器类名是'+self.m_ctrl_cls_name+u'文件路径是'+self.m_ctrl_lua_path); 
		self.create_ctrl_code(); 
		print(u'生成成功,请查看')
		os.system('explorer.exe ' + os.path.dirname(os.path.abspath(self.m_dir)));
	def create_ctrl_code(self):
		ctrl_file=open(self.m_ctrl_lua_path, 'w');
		ts_str=(
		    '/*\n'
			'author: %s\n'
			'日期:%s\n'
			'*/\n'
			'import BaseCtrl from "../../Libs/BaseCtrl";\n'
			'import BaseView from "../../Libs/BaseView";\n'
			'import BaseModel from "../../Libs/BaseModel";\n'
			'\n' 
			'//MVC模块,\n'
			'const {ccclass, property} = cc._decorator;\n'
			'let ctrl : %s;\n'
			'//模型，数据处理\n'
			'class Model extends BaseModel{\n'
			'	constructor()\n'
			'	{\n'
			'		super();\n'
            '\n'
			'	}\n'
			'}\n'
			'//视图, 界面显示或动画，在这里完成\n'
			'class View extends BaseView{\n'
			'	ui={\n'
			'		//在这里声明ui\n'
			'	};\n'
			'	node=null;\n'
			'	constructor(model){\n'
			'		super(model);\n'
			'		this.node=ctrl.node;\n'  
			'		this.initUi();\n'
			'	}\n'
			'	//初始化ui\n'
			'	initUi()\n'
			'	{\n' 
			'	}\n'
			'}\n'
			'//c, 控制\n'
			'@ccclass\n'
			'export default class %s extends BaseCtrl {\n'
			'	//这边去声明ui组件\n'
			'\n'	
			'	//声明ui组件end\n'
			'	//这是ui组件的map,将ui和控制器或试图普通变量分离\n' 
			'\n'  
			'\n'	
			'	onLoad (){\n'
			'		//创建mvc模式中模型和视图\n'
			'		//控制器\n'
			'		ctrl = this;\n'
			'		//数据模型\n'
			'		this.initMvc(Model,View);\n'
			'	}\n'
			'\n'
			'	//定义网络事件\n'
			'	defineNetEvents()\n'
			'	{\n' 
			'	}\n'
			'	//定义全局事件\n'
			'	defineGlobalEvents()\n'
			'	{\n'
			'\n'
			'	}\n' 
			'	//绑定操作的回调\n'
			'	connectUi()\n'
			'	{\n'  
			'	}\n'
			'	start () {\n'
			'	}\n'
			'	//网络事件回调begin\n' 
			'	//end\n'
			'	//全局事件回调begin\n'
			'	//end\n'
			'	//按钮或任何控件操作的回调begin\n' 
			'	//end\n'
			'}'
		)
		ts_str=ts_str%(self.author.encode('utf-8'),self.time,self.m_ctrl_cls_name,self.m_ctrl_cls_name);
		ctrl_file.write(ts_str);
		ctrl_file.close();
modulemvc = ModuleMvc();
modulemvc.input_class_name();


 