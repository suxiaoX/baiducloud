//获取的是全局变量
//(function(){
	/*从本地存储上获取数据*/
	var datas = elements.store("baidu");
	if(datas && !datas.files){//如果本地存储没有数据，那么冲本地获取数据，如果有了的话，就不用了。
		datas = data;
	};
//	console.log(datas);
	var folderList = elements.$("#folder-list");
	//用于判断是否属于显示大图模式；
	var bigImgModel = elements.findClass(folderList,"right-folder");
	//获取全部的文件夹区域所有li
	var allLi = elements.$("li",folderList);
	//加载进来，共有多少个文件夹
	var folderNumber = elements.$(".folder-number")[0];
	//点击新建的按钮
	var createNew = elements.$("#creat-folder");
	//隐藏的input，用来接收全局变量，存储Pid，操作元素的时候使用。
	var hiddenInput = elements.$(".hiddenInput")[0];
	//有文件被选中，显示操作栏
	var checkAllShow = elements.$(".checkall-show")[0];
	var checkAll = elements.$("#checkall");
	
	
	var choiceFolder = elements.$("#choice-folder");//记录选中了多少个。
	var numFolder = 0;//数字去记录
	var operateList = elements.$(".operate-list")[0];
	var checkAll = elements.$("#checkall");
	var checkInputs = elements.$(".checkInput",folderList);
	var icon = elements.$(".icon",folderList);
	var folderCheck = elements.$(".folder-check",folderList);
	
	var reName = elements.$("#rename");//重命名
//})();
	