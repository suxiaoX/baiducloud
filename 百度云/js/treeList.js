//移动到
~function(){
	var treeBox = elements.$("#tree-box")
	var list = elements.$("#tree-list");
	var h2 = elements.$("h2",list);
	var spans = elements.$("span",list);
	var uls = elements.$("ul",list);
	var moveTo = elements.$("#move-to");
	var moveSure = elements.$("#move-sure");
	var moveCancel = elements.$("#move-cancel");

	elements.addEvent(moveTo,"click",function(){
		// datas = elements.store("baidu");
		treeBox.style.display = "block";
		 
	});
	elements.addEvent(moveSure,"click",function(){
		treeBox.style.display = "none";
		elements.store("baidu",datas);
		refreshPage(hiddenInput.value);
		convertPos();
	});
	elements.addEvent(moveCancel,"click",function(){
		treeBox.style.display = "none";
	});
	list.innerHTML = creatTree(datas.files,hiddenInput.value);
	function creatTree(arr,id){
		var str = "";
		for(var i = 0;i<arr.length;i++){
			if( id == arr[i].pid ){
				str += "<li id = '"+ arr[i].id +"'><h2><span>+</span>"+arr[i].name + "</h2><ul class = 'hide'>";
				str += creatTree(arr,arr[i].id);
				str += "</ul></li>";
			};
		}
		return str;
	}
	//移入状态
	var Last;
	elements.each(h2,function(item,key){
		elements.addEvent(item,"mouseenter",function(){
			for(var i = 0;i<h2.length;i++){
				h2[i].style.background = "";
			}
			if(Last){
				h2[Last].style.background = "#999";
			}
			this.style.background = "#999";
		});
		elements.addEvent(item,"click",function(){
			for(var i = 0;i<h2.length;i++){
				h2[i].style.background = "";
			}
			this.style.background = "#999";
			Last = key;
		})
		elements.addEvent(item,"mouseleave",function(){
			for(var i = 0;i<h2.length;i++){
				h2[i].style.background = "";
			}
			if(Last){
				h2[Last].style.background = "#999";
			}
		})
	})
	//点击状态
	for(var i = 0;i<h2.length;i++){
		if(h2[i].nextElementSibling.innerHTML == ""){//判断h2下面的ul是否有内容，没有的话，就不要ul了。
			h2[i].parentNode.removeChild(h2[i].nextElementSibling);
			h2[i].removeChild(h2[i].firstElementChild)
		}
		elements.addEvent(h2[i],"click",function(ev){
			var targetLi = elements.parents(ev.target,"LI")
			if(targetLi){
				for(var i = 0;i<datas.files.length;i++){
					elements.each(readyMove,function(item){
						if(datas.files[i].id == item.id){
							datas.files[i].pid = targetLi.id;
						}
					})
				}
			}
			var next = this.nextElementSibling;
			var ul1 = this.parentNode.parentNode.getElementsByTagName("ul");
			var span2 = this.parentNode.parentNode.getElementsByTagName("span");
			if(next){
				if(next.className != "show"){
					for(var j = 0;j<ul1.length;j++){
						ul1[j].className = "hide";
					}
					for(var k = 0;k<span2.length;k++){
						span2[k].innerHTML = "+";
					}
					next.className = "show";
					this.getElementsByTagName("span")[0].innerHTML = "-";
				}else{
					next.className = "hide";
					this.getElementsByTagName("span")[0].innerHTML = "+";
				};
			}
		})
	}
}();
