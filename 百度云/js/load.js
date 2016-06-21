(function($){
	var iWidth = $(window).width();
	var iHeight = $(window).height();
	var $loadItem = $(".load-item");
	window.timer = null;
	$loadItem.css({height:iHeight});
	function create(options,obj1,obj2){
		var $parent = this;
		// var timer = null;
		var timerStop = null;
		var num = 0;
		var defalts = {
			loadImg: ["img1/load-bg.jpg","img1/load-bg-2.jpg","img1/load-bg-3.jpg","img1/load-bg-4.jpg"]
		};
		var settings = {};
		$.extend(settings,defalts,options);
		creatImg(obj1);
		creatList(obj2);
		play();
		function creatImg(obj1){
			$.each(settings.loadImg,function(i,elem){
				var li = $("<li><img src='"+ settings.loadImg[i] +"'/></li>");
				li.css({width:iWidth,height:iHeight});
				li.addClass("item-img fl");
				obj1.append(li);
				obj1.css({width:(i+2)*iWidth});
			});
			//无缝轮播，多出来的一张照片
			var liLast = $("<li><img src='"+ settings.loadImg[0] +"'/></li>");
			liLast.css({width:iWidth,height:iHeight});
			liLast.addClass("item-img fl");
			obj1.append(liLast);
		};
		function creatList(obj2){
			$.each(settings.loadImg,function(i,elem){
				var li = $("<li>");
				if(i==0){
					li.addClass("active");
				};
				obj2.append(li);
				obj2.css({marginLeft:-li.width()*(i+1)/2});
				li.on("click",function(){
					clearInterval(timer);
					clearTimeout(timerStop);
					num = $(this).index();
					iconPlay( $(this).index());
					imgPlay( $(this).index()-1);
					timerStop = setTimeout(play,1500);
				})
			});
		};
		//轮播
		function play(){
			timer = setInterval(function(){
				imgPlay(num);
				num++;
				num%=settings.loadImg.length;
				iconPlay(num);
				
			},2000);
		};
		//图片移动
		function imgPlay(num){
			obj1.animate(
				{
					left:-(num+1)*iWidth
				},
				{
					duration:300,
					easing:"linear",
					complete:function(){
						if(num == settings.loadImg.length-1){
							obj1.css({left:0});
						}
					}
				}
			);
		};
		//小圈圈移动
		function iconPlay(num){
			obj2.find("li").removeClass("active");
			obj2.find("li").eq(num).addClass("active");
		}
	};
	//轮播函数的封装
	$.fn.extend({
		orderPlay:create
	});
})(jQuery);
//下面主要是登录框的操作
$(function(){
	//登陆界面
	var $load = $(".load");
	var $loginAccount = $(".login>input");//进入注册页面按钮
	var $passwordSure = $(".password-sure");//2次确认密码的父级
	var $load = $(".load");//登陆按钮---注册按钮
	var $userName = $("#username");//用户名输入框
	var $passWord = $("#password");//密码输入框
	var $passWord2 = $("#password2");//密码2输入框
	var $judge = $(".name>span");//用户名输入框后面那个钩钩
	var $passwordOk = $(".password-sure>span");//2次密码输入正确显示的那个钩钩标签
	var $loginOk = $(".login-ok");//注册成功显示的标识
	var $autoBox = $(".auto-load")//保存用户名和密码的块
	var $autoLoad = $("#auto-load");//保存用户名和密码的复选框
	var $autoLoadSpan = $(".auto-load>span").eq(0);//是否存储用户名和密码的那个勾勾的标签
	var userInfos = elements.store("userMessage");//取到本地存储的用户名和密码
	if(userInfos && !userInfos.info){
		userInfos = message;
	}
	//点击注册，进入注册页面
	$loginAccount.eq(0).on("click",function(){
		$(this).hide();
		$(this).prev().hide();
		$autoBox.hide();
		$(this).next().show();
		$passwordSure.show();
		$load.html("注册");
		$userName.get(0).value = "";
		$userName.get(0).placeholder = "以英文字母开头6~10位";
		$passWord.get(0).value = "";
		clearInterval(timer);//注册时，一心一意，不让图片滚动了。
	});
	//返回登陆页面
	$loginAccount.eq(1).on("click",function(){
		$(this).hide();
		$passwordSure.hide();
		$judge.hide();
		$(this).prevAll().show();
		$autoBox.show();
		$load.html("登陆");
		$userName.get(0).value = "";
		$passWord.get(0).value = "";
		$userName.get(0).placeholder = "请输入用户名";
	});
	//输入过程中，如果密码一致，则显示成功。
	$passWord2.on("input",function(){
		if($(this).get(0).value == $passWord.get(0).value){
			$passwordOk.show().css({color:"#0bfa2d"});
		}else{
			$passwordOk.hide();
		}
	});
	//注册时，判断
	var rePass = /^(?!\d+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/g;//6-10位且必须以字母开头
	/*
		^ 匹配一行的开头位置
		(?![0-9]+$) 预测该位置后面不全是数字
		(?![a-zA-Z]+$) 预测该位置后面不全是字母
		[0-9A-Za-z] {6,10} 由6-10位数字或这字母组成
		$ 匹配行结尾位置
	 */
	$userName.on("blur",function(){
		// var $inputPassword = $passWord.get(0).value;
		if($load.html() == "注册"){
			var reName = /^[a-zA-Z](\w){5,10}$/g;//匹配用户名
			var $inputName = $userName.get(0).value;
			var checkName;
			if($inputName != "" ){
				if(!reName.test($inputName)){
					alert("请用英文字母开头且6~10位");
					$userName.select();
				}else{
					for(var i = 0;i< userInfos.info.length;i++) {
						if($inputName == userInfos.info[i].username){
							checkName = userInfos.info[i].username;
						};
					};
					$judge.show();
					if(checkName){
						$judge.html("×");
						$judge.css({color:"red",fontWeight:"bold"});
						$userName.select();
						return;
					}else{
						$judge.html("✔");
						$judge.css({color:"#0bfa2d"});
					}
				}
			}
		}
	});
	//去判断某个元素是否在本地存储中
	function noInner(ele){//遍历注册名，是否已经存在
		$.each(userInfos.info,function(i,elem){
			if(ele == elem.username){
				return false;
			}
		})
	};
	//点击注册/登陆按钮
	$load.on("click",function(){//点击登陆或者注册
		var $inputName = $userName.get(0).value;//登陆或者注册用户名
		var $inputPassword = $passWord.get(0).value;//登陆或者注册时输入密码
		var $inputPassword2 = $passWord2.get(0).value;//注册时2次确认密码

		//处于登陆页面
		if($(this).html() == "登陆"){
			var uName,pword;//用于遍历数组，看用户名是否存在，且密码是否匹配。
			if($inputName == ""){
				alert("请输入用户名");
			}else{//不为空，登陆
				for(var i = 0;i< userInfos.info.length;i++) {
					if($inputName == userInfos.info[i].username){
						uName = userInfos.info[i].username;
						pword = userInfos.info[i].password;
					}
				};
				if(!uName){//遍历之后，没有找到。
					alert("用户名不存在");
					return;
				};
				if(uName && $inputName == uName){//如果本地有这个用户，那么判断密码是否正确
					if($inputPassword == pword){//正确登陆
						if($autoLoad.get(0).checked){
							elements.store("save",saveInfo)
						}else{
							elements.store("save",{});
						}
						alert("登陆成功");
						$load.get(0).href="baiduyunpan.html";
					}else{//用户名正确，密码不正确，密码和用户名不匹配
						alert("账户名和密码不匹配");
						$passWord.select();
					}
				};
			}
		}else if($(this).html() == "注册"){//处于注册页面
			//判断将用户名和数据传入本地存储
			if($inputName !=""){
				if(!noInner($inputName)){//不存在
					if(rePass.test($inputPassword)){
						if($inputPassword == $inputPassword2){//两次密码相同
							userInfos.info.push({
								username:$inputName,
								password:$inputPassword
							});
							elements.store("userMessage",userInfos);//将用户名和密码放进本地存储
							$loginOk.show();//注册成功提示
							setTimeout(function(){
								$loginOk.hide();
								$passWord.get(0).value = "";
								$passWord.select();
								$passwordSure.hide();
								$loginAccount.eq(1).hide();
								$loginAccount.eq(1).prevAll().show();
								$load.html("登陆");//进入登陆页面
							},500);
						}else{
							alert("两次密码输入不一致");
						};
					}else{
						alert("为了你的安全，请输入6-10以字母开头的密码")
					}
					
				};	
			}else{
				alert("用户名不能为空");
			};
		};
	});
	//下面是记住用户名和密码块
	var saveInfo = elements.store("save") || {};
	//给一个空对象，如果没有记住用户名和密码
	if(saveInfo && !saveInfo.name && !saveInfo.passw){
		saveInfo = {
			name:"",
			passw: ""
		}
	};
	//页面加载进来。如果是保存了用户名和密码的，那么就下次就可以直接保存用户名和密码。
	if(saveInfo.name != "" && saveInfo.passw != ""){
		$userName.get(0).value = saveInfo.name;
		$passWord.get(0).value = saveInfo.passw;
		$autoLoad.get(0).checked = true;
		$autoLoadSpan.html("✔");
	}else{
		$userName.get(0).value = "";
		$passWord.get(0).value = "";
		$autoLoad.get(0).checked = false;
		$autoLoadSpan.html("");
	};
	//点击自动保存复选框
	$autoLoad.on("click",function(){
		if($(this).get(0).checked){
			$autoLoadSpan.html("✔");
			saveInfo.name = $userName.get(0).value;
			saveInfo.passw = $passWord.get(0).value;
		}else{
			$autoLoadSpan.html("");
		};
	});

	var onoff = true;
	$("#close-ps").on("click",function(){
		$(".ps").toggle(400);
		if(onoff){
			$(this).html("展开");
		}else{
			$(this).html("收起");
		}
		onoff = !onoff;
	})
})