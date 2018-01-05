#统计代码数量
import sys; 
import os;
import os.path;	
from string import *; 
import sys; 
import time;
import json; 

 
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
		self.m_dir='../../assets/Script/Modules/'+self.m_class_name;
		self.m_ctrl_lua_path=self.m_dir+'/'+self.m_ctrl_lua_name+'.ts'; 
		if os.path.exists(self.m_ctrl_lua_path):
			print (u'此类已存在,请确认assets/Script/Modules下的模块类');
			self.input_class_name();
			return False;
		return True;
		
	def show_create_files_menu(self):
		while(1):
			print (u'按y生成代码');
			print (u'按n取消并返回菜单');
			a = raw_input();
			if a=='y':
				self.create_files();
				break;
			if a=='n':
				self.input_class_name();
				break;
	def create_files(self):
		os.mkdir(self.m_dir);
		print(u'你的控制器类名是'+self.m_ctrl_cls_name+u'文件路径是'+self.m_ctrl_lua_path); 
		self.create_ctrl_code(); 
		print(u'生成成功,请查看')
		os.system('explorer.exe ' + os.path.dirname(os.path.abspath(self.m_dir)));
	def create_ctrl_code(self):
		ctrl_file=open(self.m_ctrl_lua_path, 'w');
		ts_str=(
			"import BaseControl from '../libs/BaseControl';\n" 
			"//MVC编码示范,\n"
			"const {ccclass, property} = cc._decorator;\n"

			"let moduleObj : Model,\n"
			"    viewObj : View,\n"
			"    ctrlObj : %s;\n"
			"//m，数据处理\n"
			"class Model {\n"
			"}\n"
			"//v, 界面显示\n"
			"class View {\n"

			"}\n"
			"moduleObj = new Model();\n"
			"viewObj = new View();\n"
			"//c, 控制\n"
			"@ccclass\n"
			"export default class %s extends BaseControl {\n"
			"    @property(cc.Label)\n"
			"    label: cc.Label = null;\n"

			"    onLoad (){\n"
			"        ctrlObj = this;\n"
			"    }\n"

			"    start () {\n" 
			        
			"    }\n"
			"}\n"
		)
		ts_str=ts_str%(self.m_ctrl_cls_name,self.m_ctrl_cls_name);
		ctrl_file.write(ts_str);
		ctrl_file.close();
modulemvc = ModuleMvc();
modulemvc.input_class_name();


 