//(function(){
	var folderList = elements.$("#folder-list");//右键操作
	var nowPid = 0;
	var targetLi = null;
	var targetCheck = null;
	elements.addEvent(folderList,"contextmenu",function(ev){
		if(elements.parents(ev.target,"LI")){
			targetLi = elements.parents(ev.target,"LI");
			targetCheck = elements.$(".checkInput",targetLi)[0]
			targetCheck.checked = true;
			elements.$(".icon",targetLi)[0].style.borderColor = "#2e80dc";
			elements.$(".folder-check",targetLi)[0].style.display = "block";
			elements.$(".folder-check",targetLi)[0].style.backgroundPositionX = "-36px";
			nowPid = elements.parents(ev.target,"LI").id;
			showContexMenu(ev,data.contextmenu.folder);
		}else{
			showContexMenu(ev,data.contextmenu.blank);
		}
		ev.preventDefault();
	});
	//点击是右键菜单消失
	document.addEventListener("click",hideContextMenu);
	//显示右键菜单
	function showContexMenu(e,data){
		var contextMenu = elements.$("#contextmenu");
		contextMenu.style.display = "block";
		contextMenu.style.left = e.clientX + "px";
		contextMenu.style.top = e.clientY + "px";
		
		contextMenu.innerHTML = '';
		data.forEach(function(v,k){
			var li = document.createElement("li");
			li.innerHTML = v.name;
			li.onclick = function(){
				if(v.exe){
					v.exe();
				}
				
				// targetCheck.checked = false;
			}
			contextMenu.appendChild(li);
		})
	}
	//隐藏右键菜单
	function hideContextMenu(){
		var contextMenu = elements.$("#contextmenu");
		contextMenu.style.display = "none";
	}
//})();
