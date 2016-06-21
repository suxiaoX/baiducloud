/*拖拽预览,上传预览*/
~function(){
	var file = elements.$("#file");
	
	file.onchange = function(){
		var img1 = elements.$("img",folderList)[0];
		if(img1){
			folderList.removeChild(img1)
		}
		
		var file = this.files[0];
		// console.log(file);---可以查看数据的各种信息，这里提炼出来type属性
		if(file.type.indexOf('image') == -1 ){
				alert('只能预览图片');
				return;
		}
		
		/*
			HTML5定义了FileReader作为文件API的重要成员用于读取文件，
			根据W3C的定义，FileReader接口提供了读取文件的方法和包含读取结果的事件模型。
		*/
		
		var fr = new FileReader();
		// var img = null;
		//读取完成触发
		fr.onload = function(ev){
			// console.log(img);
			// if(img){
			// 	folderList.removeChild(img);
			// }
			if(file.type.indexOf('image') != -1){
				var img = new Image();
				img.src = ev.target.result;
				img.style.marginLeft = "-20px";
				img.style.width = folderList.offsetWidth -10 + 'px';
				img.style.height = folderList.offsetHeight  + 'px';
				folderList.appendChild(img);
			}
		}
		//读取图片
		if(file.type.indexOf('image') != -1){
			fr.readAsDataURL(file);
		}
		
		
		//读取文本。
//		fr.readAsText(file,'utf-8');
	}
	folderList.ondragenter = function(){
		console.log('拖入');
		return false;
	}
	//当拖拽在该元素上移动时触发。
	folderList.ondragover = function(){
		console.log('移动');
		return false;
	}
	//当拖拽离开元素时触发。
	folderList.ondragleave = function(){
		console.log('离开');		
	}
	//当拖拽过程中鼠标松开时触发
	folderList.ondrop = function(ev){
		var img1 = elements.$("img",folderList)[0];
		if(img1){
			folderList.removeChild(img1)
		}
		//拖拽过来的文件集合。
		var files = ev.dataTransfer.files;
		// console.log(ev.dataTransfer.files);
		for(var i=0;i<files.length;i++){
			var fr = new FileReader();
			fr.onload = function(ev){
				var img = new Image();
				console.log(img)
				img.src = ev.target.result;
				img.style.marginLeft = "-20px";
				img.style.width = folderList.offsetWidth -10 + 'px';
				img.style.height = folderList.offsetHeight  + 'px';
				folderList.appendChild(img);
			}	
			fr.readAsDataURL(files[i]);
		}
		return false;
	}
}();