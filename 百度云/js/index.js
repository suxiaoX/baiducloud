//(function(){
	//目前完成的功能，无限创建文件夹，单选，多选，重命名文件夹，显示加载多少文件夹，点击文件夹显示目录菜单	
	//模板函数，根据对象，创建li，先不用，哪里需要的时候，哪里就去调用这个函数，来生成页面。
	function createFolder(options){
		options = options || {};
		var defaults = {
			name:options.name || "新建文件夹",
			id:options.id,
			pid:options.pid,
			type:options.type || "file"
		};
		var str = '';
		var folder = document.createElement('li');
		str += '<div class="icon">'
					+'<input type="checkbox"  class="checkInput" />'
					+'<span class="folder-check"></span>'
				+'</div>'
				+'<span class= "show-name">'+defaults.name+'</span>'
				+'<div class = "new-folder">'
					+'<input value = "'+defaults.name+'" class = "new-name"/>'
					+'<s class = "right"></s>'
					+'<s class = "remove"></s>'
				+'</div>';
		folder.innerHTML = str;
		folder.id = defaults.id;
		folder.pid = defaults.pid;
		if(bigImgModel){
			drag(folder);
		}
		
		folder.setAttribute("mold",defaults.type);
		return folder;
	}
	refreshPage(0);//默认值生成初始页面,生成页面后，才会有Li
	convertPos()
	//新建文件夹
	var nameInp = null;
	elements.addEvent(createNew,"click",function(){
		createNewLi();
	})
	function createNewLi(){
		var successMark = elements.$(".create-success")[0];
		if(this.isCreat){
			checkAll.disabled = true;
			nameInp.select();
			return;
		}
		if(!reName.isRename){
			successMark.style.display = "none";
			var newLi = createFolder();
			//定位新建的li；
			var cells = Math.floor(folderList.offsetWidth / (130));
			var x = (allLi.length)%cells*130 + 30;
			var y = Math.floor((allLi.length)/cells)*126;
			newLi.style.position = "absolute";
			newLi.style.left = x + "px";
			newLi.style.top = y + "px";
			createNew.isCreat = true;
			folderList.appendChild(newLi);
//			drag(newLi);
			var edtor = elements.$('.new-folder',newLi)[0];
			var showName = elements.$(".show-name",newLi)[0];
			var newName = elements.$(".new-name",newLi)[0];
			nameInp = newName;
			edtor.style.display = "block";
			showName.style.display = "none";
			newName.select();
			numFolder = 0;
			checkAll.checked = false;
			checkAllShow.style.display = "none";
			operateList.style.display = "none";
			elements.each(allLi,function(item){
				cancelStyle(item);
			})
			operateLi(newLi);
		}
	}
	//根据数据生成页面
	function refreshPage(Pid){
		folderList.innerHTML = '';
		elements.each(datas.files,function(item){
			if(item.pid == Pid){
				var newFolder = createFolder({
					name:item.name,
					id:item.id
				});
				folderList.appendChild(newFolder);
				operateLi(newFolder);
			}
		});
		for(var i = 0;i<allLi.length;i++){
			allLi[i].index = i;//获取index值，在交换位置的时候使用
		}
//		convertPos();//布局转换
	}
	//布局转换。
	var arr = [];
	function  convertPos(){
		arrPos = [];
		allLi = elements.$("li",folderList);
		if(allLi.length>=1){
			var width = allLi[0].offsetWidth||120;
			var height = allLi[0].offsetWidth||126;
		    var cells = Math.floor(folderList.offsetWidth / (width+10));
		    for(var i = 0;i<allLi.length;i++){
		    	allLi[i].style.position = "absolute";
		    	allLi[i].style.margin = 0;
		    	allLi[i].style.left = (i%cells) * (10+width) + 30 + "px";
		    	allLi[i].style.top = Math.floor(i/cells) * height + "px";
		    	arrPos.push([allLi[i].offsetLeft,allLi[i].offsetTop]);//存储每个文件夹最初的位置
		    }
		}
	}
	//对每个li的操作进行批量处理
	function operateLi(obj){
		 var icon = elements.$(".icon",obj)[0];
		 var folderCheck = elements.$(".folder-check",obj)[0];
		 var checkInput = elements.$(".checkInput",obj)[0];
		 //这个是新建文件夹时的一系列操作需要的元素
		 var edtor = elements.$(".new-folder",obj)[0];
		 var newName = elements.$(".new-name",obj)[0];
		 var right = elements.$(".right",obj)[0];
		 var remove = elements.$(".remove",obj)[0];
		 var showName = elements.$(".show-name",obj)[0];
		 //每个元素的鼠标移入和离开事件
		 elements.addEvent(obj,"mouseenter",function(){
		 	if(!createNew.isCreat){
		 		icon.style.borderColor = "#2e80dc";
		 		folderCheck.style.display = "block";
		 	}
		 })
		 elements.addEvent(obj,"mouseleave",function(){
		 	if(!checkInput.checked){
		 		icon.style.borderColor = "transparent";
		 		folderCheck.style.display = "none";
		 	}
		 })
		 //点击单选按钮
		elements.addEvent(checkInput,"click",function(ev){
			if(this.checked){
				icon.style.borderColor = "#2e80dc";
				folderCheck.style.backgroundPositionX = "-36px";
				checkAllShow.style.display = "inline-block";
				operateList.style.display = "block";
				numFolder++;
				if(numFolder == checkInputs.length){
					checkAll.checked = true;
				}
			}else{
				folderCheck.style.backgroundPositionX = "0px";
				numFolder--;
				checkAll.checked = false;
				if(numFolder==0){
					checkAllShow.style.display = "none";
					operateList.style.display = "none";
				}
			}
			if(numFolder>1){
				reName.style.background = "rgba(0,0,0,0.1)";
				reName.style.disabled = true;
			}else if(numFolder==1){
				reName.style.background = "";
				reName.style.disabled = false;
			}
			choiceFolder.innerHTML = numFolder;
		 	ev.stopPropagation();
		});
		 //新建文件夹的操作，确定新建
		 elements.addEvent(right,"click",function(ev){
		 	createSuccess();
		 	createNew.isCreat = false;
		 	ev.stopPropagation();
		 })
		 elements.addEvent(newName,"keydown",function(ev){
		 	if(ev.keyCode===13){
		 		createSuccess();
		 		createNew.isCreat = false;
		 	}
		 });
		 elements.addEvent(newName,"click",function(ev){
		 	ev.stopPropagation();
		 })
		 //取消创建
		 elements.addEvent(remove,"click",function(ev){
		 	if(!reName.isRename){
		 		folderList.removeChild(obj);
		 		createNew.isCreat = false;
		 		ev.stopPropagation();
		 	}else{
		 		edtor.style.display = "none";
		 		showName.style.display = "block";
		 		reName.isRename = false;
		 	}
		 	
		 })
		 //文件夹创建成功的函数
//		 alert(datas);
		 function createSuccess(){
			//这个是用来处理新建后名字相同的问题
			var nowName = newName.value;
			
			//判断，如果是正在处于重命名状态，就走这条路
			if(reName.isRename){
				var getID = getIdItem(obj.id);
				for(var i = 0;i<datas.files.length;i++){
					if(getID.id == datas.files[i].id){
						datas.files[i].name = newName.value;
						edtor.style.display = "none";
						showName.style.display = "block";
						showName.innerHTML = nowName;
						elements.store("baidu",datas);
					}
				}
				reName.isRename = false;
			}else{//否则新建，就这样更新数据
				var num = 0;
				var random = new Date().getTime();
				var re = /(\([^\)]+\))/;//这个是匹配括号和括号的内容
				for(var i = 0;i<datas.files.length;i++){
					if(nowName == datas.files[i].name.replace(re,"")&&hiddenInput.value==datas.files[i].pid){
						console.log(datas.files[i].name.replace(re,""));
						num++;
//						console.log(num);
						newName.value = nowName + "("+ num +")"
					}
				}
				edtor.style.display = "none";
				showName.style.display = "block";
				showName.innerHTML = newName.value;
				datas.files.push({
					name:newName.value,
					id:random,
					pid:hiddenInput.value
				});
				elements.store("baidu",datas);
				refreshPage(hiddenInput.value);
				convertPos();
				successMark();
				folderNumber.innerHTML = allLi.length;
			}
		}
		 //找数据的id方法
		function getIdItem(id){
			for( var i = 0; i < datas.files.length; i++ ){
				if( datas.files[i].id == id ){
					return datas.files[i];
				}
			}
		}
		 //点击每个文件夹的时候，存储pid，进入子目录
		elements.addEvent(obj,'dblclick',function(){
			openFolder(obj,this.id);
		})
	}
	function openFolder(obj,pid){
		if(!createNew.isCreat){
			// alert(this.id)
			hiddenInput.value = pid;
			refreshPage(hiddenInput.value);
			convertPos();
			var span = elements.$("span",obj)[1];
			checkAllShow.style.display = "none";
			operateList.style.display = "none";
			checkAll.checked = false;
			numFolder = 0;
			// console.log(allLi.length)
			folderNumber.innerHTML = allLi.length;
			//每次点击的时候，给渲染导航菜单的数组存入数据，用于生成导航菜单的数据使用
			navArr.push({
				filename:span.innerHTML,
				currentId:pid
			});
			//调用函数，生成导航栏
			showNavMenu(navArr);
		}
	}
	
	//全选功能
//	var choiceFolder = elements.$("#choice-folder");//记录选中了多少个。
//	var numFolder = 0;//数字去记录
//	var operateList = elements.$(".operate-list")[0];
//	var checkAll = elements.$("#checkall");
//	var checkInputs = elements.$(".checkInput",folderList);
//	var icon = elements.$(".icon",folderList);
//	var folderCheck = elements.$(".folder-check",folderList);
	//全选
	elements.addEvent(checkAll,"click",function(){
		if(this.checked){
			reName.style.background = "rgba(0,0,0,0.1)";
			checkAllShow.style.display = "inline-block";
			operateList.style.display = "block";
			elements.each(checkInputs,function(item,key){
				item.checked = true;
				icon[key].style.borderColor = "#2e80dc"
		 		folderCheck[key].style.display = "block";
		 		folderCheck[key].style.backgroundPositionX = "-36px";
				numFolder = checkInputs.length;
			})
		}else{
			checkAllShow.style.display = "none";
			operateList.style.display = "none";
			elements.each(checkInputs,function(item,key){
				item.checked = false;
				icon[key].style.borderColor = "transparent";
		 		folderCheck[key].style.display = "none";
		 		folderCheck[key].style.backgroundPositionX = "0";
				numFolder = 0;
			})
		}
		choiceFolder.innerHTML = numFolder;
	})
	//匡选
	var folderBox = elements.$(".folder-box")[0];
	elements.addEvent(folderList,"mousedown",function(ev){
		ev.preventDefault();
		if( reName.isRename || createNew.isCreat ) return;
		var target = ev.target;
		if( target = elements.parents(target,"LI")){//如果点到了li或者里面的子元素，那么就执行交换文件夹位置的函数
			return;
		}
		var disX = ev.clientX;
		var disY = ev.clientY;
		var box = null;
		elements.addEvent(document,"mousemove",boxMove);
		elements.addEvent(document,"mouseup",boxUp);
		
		function boxMove(ev){
			var width = ev.clientX - disX;
			var height = ev.clientY - disY;
			var x = width<0?ev.clientX:disX;
			var y = height<0?ev.clientY:disY;
			if(Math.abs(width)>5||Math.abs(height)>5){
				if(!box){
					box = document.createElement("div");
					box.className = "move-select";
				}
				box.style.width = Math.abs(width) + "px";
				box.style.height = Math.abs(height) + "px";
				box.style.left = x + "px";
				box.style.top = y + "px";
				folderBox.appendChild(box);
				elements.each(allLi,function(item){
					//做优化，当快要碰上文件的最有一个时，才做碰撞检测
					var lastLiBottom = allLi[allLi.length-1].getBoundingClientRect().bottom;
					if( y- lastLiBottom<= 0 && elements.crashTest(box,item)){
						showStyle(item,true);
					}else{
						showStyle(item);
					}
					
				})
			}
 		};
		function boxUp(){
			if(box){
				folderBox.removeChild(box);
			}
			elements.removeEvent(document,"mousemove",boxMove);
			elements.removeEvent(document,"mouseup",boxUp);
		};
		function showStyle(obj,bull){
			var icon = elements.$(".icon",obj)[0];
			var checkInput = elements.$(".checkInput",obj)[0];
			var foldercheck = elements.$(".folder-check",obj)[0];
			if(selectFolder().length>1){
				reName.style.background = "rgba(0,0,0,0.1)";
			}else{
				reName.style.background = "";
			}
			if(bull){
				icon.style.borderColor = "#2e80dc";
				checkInput.checked = true;
				foldercheck.style.display = "block";
				foldercheck.style.backgroundPositionX = "-36px";
				checkAllShow.style.display = "inline-block";
				operateList.style.display = "block";
				choiceFolder.innerHTML = numFolder = selectFolder().length;
				
				if(numFolder == checkInputs.length){
					checkAll.checked = true;
				}
			}else{
				icon.style.borderColor = "transparent";
				checkInput.checked = false;
				foldercheck.style.display = "none";
				foldercheck.style.backgroundPositionX = "0";
				choiceFolder.innerHTML = numFolder = selectFolder().length;
				checkAll.checked = false;
				if(numFolder==0){
					checkAllShow.style.display = "none";
					operateList.style.display = "none";
				}
			}
		}
	});
	
	//文件夹边框消失的函数
	function cancelStyle(li){
		var icon = elements.$(".icon",li)[0];
		var checkInput = elements.$(".checkInput",li)[0];
		var folderCheck = elements.$(".folder-check",li)[0];
		var checkAll = elements.$("#checkall"); 
		icon.style.borderColor = "transparent";
		folderCheck.style.display = "none";
		folderCheck.style.backgroundPositionX = "0";
		checkAll.checked = false;
		numFolder = 0;
		checkInput.checked = false;
	}
	/*文件夹创建成功显示*/
	function successMark(){
		var successMark = elements.$(".create-success")[0];
		var timer = null;
		successMark.style.display = "block";
		timer = setTimeout(function(){
			successMark.style.display = "none";
		},1500)
	}
	/*导航文件夹目录栏*/
	var navArr = [
		{
			filename:"返回上一级"
		},
		{
			filename:"全部文件",
			currentId:0
		}
	];
	//渲染导航
	//显示加载了多少文件夹
	var folderNumber = elements.$(".folder-number")[0];
	var showAll = elements.$("#show-all");
	folderNumber.innerHTML = allLi.length;
	elements.addEvent(showAll,"click",function(ev){
		var target = ev.target;
		if(target.nodeName == "A"){
			var startIndex = 0;
			var currentId = target.getAttribute("currentId");
			hiddenInput.value = currentId;
			refreshPage(currentId);
			convertPos();
			//这一部如果点击的是全部文件，那么从第全部文件那一行进行渲染，同时重新渲染navArr的数据，这时候navArr的数据只有2个了。
			if( currentId == 0 ){
				startIndex = 1;
			};
			//循环数组，如果说，navArr里面的item.currentId和获取的currentId相等的话，那么就要重新渲染navArr，这样才能保证navArr的数据和导航栏保持一致；这时候的navArr的长度和点击的当前的这个index值往后加一位。
			elements.each(navArr,function (item,index){
				if( item.currentId == currentId ){
					navArr.length = index+1;
				}
			});
			showNavMenu(navArr,startIndex);
			folderNumber.innerHTML = allLi.length;
		}
	});
	//显示导航栏的函数
	function showNavMenu(navArr,startIndex){
		var str = "",startIndex = startIndex || 0;
		showAll .innerHTML = "";
		for(var i = startIndex;i<navArr.length-1;i++){
			if( i === 0 ){//判断是不是第一个a标签，如果是的话，存入currentID永远是数组的倒数第三个，用于返回上一级使用，刷新页面就很cool了。
				str += '<a href="javascript:;" index='+i+' currentId='+navArr[navArr.length-2].currentId+' class="nav_level">'+navArr[i].filename+'</a> | '
			}else{
				str += '<a href="javascript:;" index='+i+' currentId='+navArr[i].currentId+' class="nav_level">'+navArr[i].filename+'</a> &gt '
			}
		}
		str += "<span>" + navArr[navArr.length-1].filename + "</span>"
		showAll .innerHTML = str;
	};
	/*重命名*/
	var reName = elements.$("#rename");
	elements.addEvent(reName,"click",function(ev){
		rename();
	});
	function rename(){
		if(reName.isRename){
			nameInp.select();
			return;
		}
		reName.isRename = true;
		var foldersSelect = selectFolder();
		if(foldersSelect.length === 1){
			var newFolder = elements.$(".new-folder",foldersSelect[0])[0];
			var showName = elements.$(".show-name",foldersSelect[0])[0];
			var newName = elements.$(".new-name",foldersSelect[0])[0];
			var right= elements.$(".right",foldersSelect[0])[0];
			var remove = elements.$(".remove",foldersSelect[0])[0];
			newFolder.style.display = "block";
			showName.style.display = "none";
			newName.select();
			nameInp = newName;
			//操作确定和取消重命名；
			elements.addEvent(right,"click",function(ev){
				ev.stopPropagation();
				foldersSelect = [];
			});
			elements.addEvent(remove,"click",function(ev){
				foldersSelect = [];
				ev.stopPropagation();
			});
			
		}else{
			reName.disabled = true;
		}
	}
	//获取选中的li
	function selectFolder(){
		var arr = [];
		elements.each(checkInputs,function (item){
			if( item.checked ){
				arr.push(elements.parents(item,"LI"));
			}		
		});
		return arr;
	};
	//删除功能
	var delate = elements.$("#delate");//获取删除按钮
	var delateBox = elements.$(".delate-box")[0];//获取弹出是否删除弹出框
	var delateSure = elements.$(".sure",delateBox)[0];//确定删除
	var delateCancel = elements.$(".no",delateBox)[0];//取消删除
	elements.addEvent(delate,"click",deleteFolder);
	//删除函数封装
	function deleteFolder(){
		if(reName.isRename){
			nameInp.select();
			return;
		}
		var delateFolders = selectFolder();
		delateBox.style.display = "block";
		/*确定删除*/
		elements.addEvent(delateSure,"click",function(){
			elements.each(delateFolders,function(item){
				for(var i = 0;i<datas.files.length;i++){
					if(item.id == datas.files[i].id){
						datas.files.splice(i,1);
						break;
					}
				}
				elements.store("baidu",datas);
				refreshPage(hiddenInput.value);
				convertPos();
				reName.style.background = "";
				numFolder = selectFolder().length = 0;
				checkAll.checked = false;
				checkAllShow.style.display = "none";
				operateList.style.display = "none";
				folderNumber.innerHTML = allLi.length;
			})
			delateBox.style.display = "none";
		});
		/*取消删除*/
		elements.addEvent(delateCancel,"click",function(){
			delateBox.style.display = "none";
		});
	}
	/*拖拽*/
	function drag(obj){
		var disX = 0;
		var disY = 0;
		var closetLi = null;
		var zIndex = 99;
		elements.addEvent(obj,"mousedown",function(ev){
//			console.log(arrPos);
			obj.style.zIndex = zIndex++;
			// console.log(zIndex)
			if(!createNew.isCreat&&!reName.isRename){
				downLi(ev);
				elements.addEvent(document,"mousemove",moveLi);
				elements.addEvent(document,"mouseup",upLi);
				return false;
			};
		});
		function downLi(ev){
			if(!createNew.isCreat&&!reName.isRename){
				if(ev.target.nodeName == "DIV"){
					elements.each(allLi,function(item,key){
						cancelStyle(item);
					});
					
					numFolder = 0;
					checkAll.checked = false;
					checkAllShow.style.display = "none";
					operateList.style.display = "none";
				}
				disX = ev.clientX - obj.offsetLeft;
				disY = ev.clientY - obj.offsetTop;
			};
			// console.log(zIndex);
		};
		function moveLi(ev){
			obj.style.left = ev.clientX - disX + "px";
			obj.style.top = ev.clientY - disY + "px";
			elements.each(allLi,function(item,key){
				cancelStyle(item);
				closetLi = elements.nearestDistance(obj,allLi);
				item.style.transform = "scale(1)";
				item.style.background = "";
				if(closetLi){
					closetLi.style.transform = "scale(1.1)";
					closetLi.style.background = "rgba(0,0,0,0.1)";
				}else{
					item.style.transform = "scale(1)";
					
				}
			})
		};
		function upLi(){//鼠标抬起
			elements.removeEvent(document,"mousemove",moveLi);
			elements.removeEvent(document,"mouseup",upLi);
			if(closetLi){
//				console.log("碰上了");
				console.log(obj.index,closetLi.index);
				closetLi.style.transform = "scale(1)";
				closetLi.style.background = "";
				var temp = 0;//记录key值，交换位置后，交换两个li的key值，解决了交换位置后的bug。
				startMove(obj,{left:arrPos[closetLi.index][0],top:arrPos[closetLi.index][1]});
				startMove(closetLi,{left:arrPos[obj.index][0],top:arrPos[obj.index][1]});
				temp = obj.index;
				obj.index = closetLi.index;
				closetLi.index = temp;
			}else{
//				console.log("没碰到");
				startMove(obj,{left:arrPos[obj.index][0],top:arrPos[obj.index][1]})
			}
			closetLi = null;
		};
	};
	
	/*搜索文件夹功能*/
	var searchFolder = elements.$("#search-folder");
	var searchResult = elements.$(".search-result")[0];
	var findFolder = elements.$("#find-folder");
	elements.addEvent(searchFolder,"input",function(){
		searchResult.style.display = "block";
		for(var i = 0;i<datas.files.length;i++){
			if(datas.files[i].name.indexOf(this.value) != -1 && this.value != ""){
				var folderName = document.createElement("span");
				folderName.innerHTML = datas.files[i].name;
				folderName.findPid = datas.files[i].id;
				searchResult.appendChild(folderName);
			}
			if(datas.files[i].name === this.value){
				hiddenInput.value = datas.files[i].id;
			}
		};
		var resultMes = elements.$("span",searchResult);
		for(var i = 0;i<resultMes.length;i++){
			elements.addEvent(resultMes[i],"click",function(){
				searchFolder.value = this.innerHTML;
				hiddenInput.value = this.findPid;
				searchResult.style.display = "none";
				searchFolder.select();
			});
		};
		elements.addEvent(document,"click",function(){
			searchResult.style.display = "none";
		})
	});
	elements.addEvent(findFolder,"click",function(){
		refreshPage(hiddenInput.value);
		convertPos();
	});
	elements.addEvent(searchFolder,"keydown",function(ev){
		if(ev.keyCode === 13){
			refreshPage(hiddenInput.value);
			convertPos();
		}
	})
	//切换大图和小图
	function changeShowWay(){
		var topChange = elements.$(".top-change")[0];
		var listGurd = elements.$(".list-gurd")[0];
		var grideGurd = elements.$(".gride-gurd")[0];
		elements.addEvent(listGurd,"click",function(){
			topChange.style.backgroundPositionY = "-80px";
			refreshPage(hiddenInput.value);
			folderList.className = "convert-list";
		});
		elements.addEvent(grideGurd,"click",function(){
			topChange.style.backgroundPositionY = "-50px";
			folderList.className  = "right-folder clearfix";
			convertPos();
		});
	}
	changeShowWay();
	//说明
	function showBref(){
		var bref = elements.$("#bref");
		var brefP = elements.$("p",bref)[0];
		var closeBref = elements.$(".close",bref)[0];
		brefP.style.top = "120px";
		setTimeout(function(){
			closeBref.style.display = "block";
			setTimeout(function(){
				closeBref.style.top = "127px";
				brefP.style.transform = "scale(1)";
				closeBref.style.marginLeft = "211px";
			},500);
		},1000);
		elements.addEvent(closeBref,"click",function(){
			brefP.style.transform = "scale(0)";
			closeBref.style.display = "none";
			setTimeout(function(){
				bref.style.width = "20px";
				bref.style.background = "rgba(14,193,187,0.3)";
			},300);
		});
		setTimeout(function(){
			brefP.style.transform = "scale(0)";
			bref.style.width = "20px";
			bref.style.background = "rgba(14,193,187,0.3)";
			closeBref.style.display = "none";
		},6000);
		elements.addEvent(bref,"mouseover",function(){
			if(bref.offsetWidth <= 40){
				bref.style.width = "100%";
//				bref.style.background = "aqua";
				setTimeout(function(){
					brefP.style.transform = "scale(1)";
					closeBref.style.display = "block";
					bref.style.background = "";
				},600);
			}
		})
	}
	showBref()
//})();
