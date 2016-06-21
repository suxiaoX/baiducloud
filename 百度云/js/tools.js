//封装的一些列公用的方法
(function(){
	var elements = {
		//封装获取元素的函数
		$:function(selector,context){
			var eleChar = selector.charAt(0);
			context = context || document;
			if(selector.indexOf(" ") !== -1){
				return context.querySelectorAll(selector);
			}else if(eleChar === "#"){
				return document.getElementById(selector.slice(1));
			}else if(eleChar === "."){
				return context.getElementsByClassName(selector.slice(1));
			}else{
				return context.getElementsByTagName(selector);
			}
		},
		//添加事件封装
		addEvent:function(obj,eventName,fn){
			obj.addEventListener(eventName,fn,false);
		},
		//删掉事件封装
		removeEvent:function(obj,eventName,fn){
			obj.removeEventListener(eventName,fn,false);
		},
		//找obj是否存在className
		findClass:function(obj,classNames){
			if(obj === document) return;
			var classNameArr = obj.className.split(" ");
			for(var i = 0;i<classNameArr.length;i++){
				if(classNameArr[i] === classNames){
					return true;
				}
			}
			return false;
		},
		//这个是为for循环封装
		each:function(obj,callBack){
			for(var i = 0;i<obj.length;i++){
				callBack(obj[i],i);
			}
		},
		//这个是为往上找到父级封装的函数，一般是判断事件源的时候用
		parents:function(obj,selector){
			if(selector.charAt(0)==="#"){
				while(obj && obj.id !== selector.slice(1)){
					obj = obj.parentNode;
				}
			}else if(selector.charAt(0)==="."){
				while(obj && !elements.findClass(obj,selector.slice(1))){
					obj = obj.parentNode;
				}
			}else{
				while(obj && obj.nodeName !== selector){
					obj = obj.parentNode;
				}
			}
			return obj;
		},
		//获取getBoundingClientRect()
		getRect:function(obj){
			return obj.getBoundingClientRect();
		},
		//碰撞检测的函数
		crashTest:function(obj1,obj2){
			var obj1Rect = elements.getRect(obj1);
			var obj2Rect = elements.getRect(obj2);
			if(obj1Rect.right<obj2Rect.left||obj1Rect.left>obj2Rect.right||obj1Rect.top>obj2Rect.bottom||obj1Rect.bottom<obj2Rect.top){
				return false;
			}else{
				return true;
			}
		},
		//这个是本地存储的函数
		store:function (namespace, data)  {
			if (data) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			}

			var store = localStorage.getItem(namespace);
			return (store && JSON.parse(store)) || [];
		},
		//这个是拷贝的函数
		extend: function(obj,beel){
			var newArr = obj.constructor === Array?[]:{};
			for(var attr in obj){
				if(typeof obj[attr] === Object && beel){
					newArr[attr] = extend(obj[attr]);
				}else{
					newArr[attr] = obj[attr];
				}
			}
			return newArr;
		},
		//距离算法的函数
		distance: function(obj1,obj2){
			var a = obj1.offsetLeft - obj2.offsetLeft;
			var b = obj1.offsetTop - obj2.offsetTop;
			return Math.sqrt(a*a+b*b);
		},
		//最近距离的函数
		nearestDistance: function(obj,all){
			var value = 99999;
			var key = -1;
			for(var i = 0;i<all.length;i++){
				if(elements.crashTest(obj,all[i]) && obj!=all[i]){
					var c = elements.distance(obj,all[i]);
					if(value>c){
						value = c;
						key = i;
					}
				}
			}
			if(key!=-1){
				return all[key];
			}else{
				return false;
			}
		}
	}
	window.elements = elements;
})()