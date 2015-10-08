	var root=(window.frames.length>0)?window.main:window;

    var eleSpans = root.document.getElementsByTagName("span");
	for(x=0;x<eleSpans.length;x++){
		if(eleSpans[x].id.match(/label/)){
			table=getParent(eleSpans[x], "table");
			break;
		}
	}
    function theInnerText(theNode) {return typeof(theNode.innerText)=='undefined'?theNode.textContent:theNode.innerText;}
	function getParent(obj, ele){
		var table = obj;
		do{
			table = table.parentNode;
		}while(!table.nodeName.match(new RegExp(ele, "i")));
		return table;
	}
	var eleTds=table.getElementsByTagName('td');
	function mark(str,type){
		if(root.document.getElementById("check_and").checked==true && str=='')return;
		for (i=0;i<eleTds.length;i=i+2){
			if(str.match(/:OR:/)){
				var splitStrs = str.split(":OR:");
				for(x=0;x<splitStrs.length;x++){
					mark(splitStrs[x],true);
				}
			}
			if(str.match(/:AND:/)){
				var splitStrs = str.split(":AND:");
				var ifStatement;
				for(y=0;y<splitStrs.length;y++){
					if(theInnerText(eleTds[i]).match(new RegExp(splitStrs[y], 'i'))){
						ifStatement=true;
					}else{
						ifStatement=false;
						break;
					}
				}
				if(ifStatement){
					eleTds[i].getElementsByTagName('input')[0].checked=type;
				}
			}
			if(theInnerText(eleTds[i]).match(new RegExp(str, 'i'))){
				eleTds[i].getElementsByTagName('input')[0].checked=type;
			}
		}
	}
	function imageMark(str,type){
		for (i=0;i<eleTds.length;i=i+2){
			if(eleTds[i].innerHTML.match(new RegExp(str, 'i'))){
				eleTds[i].getElementsByTagName('input')[0].checked=type;
			}
		}
	}
	function coords(str){
		var coords = str.split(" ");
		for (i=0;i<eleTds.length;i=i+2){
			for (var k=0;k<coords.length;k++){
				var coord = coords[k].split("|");
				var title = eleTds[i].getElementsByTagName("input")[1].value;
				if(title.match(new RegExp(coord[0], "i")) && title.match(new RegExp(coord[1], "i"))){
					eleTds[i].getElementsByTagName('input')[0].checked=true;
				}
			}
		}
	}
	function invert(){
		var inputs=table.getElementsByTagName("input");
		for(i=2;i<(inputs.length-3);i++){
			if(inputs[i].checked==true)inputs[i].checked=false;
			else inputs[i].checked=true;
		}
	}
	function allOthers(){
		for(i=0;i<eleTds.length;i=i+2){
			var testCoord=theInnerText(eleTds[i]).match(/.*\((\d+)\|(\d+)\)/);
			if(testCoord){
				for(x=i+2;x<eleTds.length;x=x+2){
					if(theInnerText(eleTds[x]).match(testCoord[1],'i') && theInnerText(eleTds[x]).match(testCoord[2],'i')){
						eleTds[x].getElementsByTagName('input')[0].checked=true;
					}
				}
			}
		}
	}

	function appendIcons(input, input2){
		if(root.document.getElementById('markReportTr')==null){
			if(typeof input2 == 'undefined') input2 = 'Coords';
			var delRow = root.document.forms[0];
			var delButton = getParent(root.document.getElementsByName("del")[0], 'table').innerHTML;
			var newElement='<tr id="markReportTr"><th><a href="JavaScript:mark(\'\',false);imageMark(\'green.png\',true);"><img src="/graphic/dots/green.png?1" /></a><a href="JavaScript:mark(\'\',false);imageMark(\'yellow.png\',true);"> <img src="/graphic/dots/yellow.png?1" /></a><a href="JavaScript:mark(\'\',false);imageMark(\'red.png\',true);"> <img src="/graphic/dots/red.png?1" /></a><a href="JavaScript:mark(\'\',false);imageMark(\'blue.png\',true);"> <img src="/graphic/dots/blue.png?1" /></a><a href="JavaScript:mark(\'\',false);imageMark(\'max_loot\/0.png\',true);"> <img src="/graphic/max_loot/0.png?1" /></a> <a href="JavaScript:mark(\'\',false);imageMark(\'max_loot\/1.png\',true);"> <img src="/graphic/max_loot/1.png?1" /></a> <a href="JavaScript:mark(\'\',false);imageMark(\'forwarded.png\',true);"> <img src="/graphic/forwarded.png?1" /></a> <a href="JavaScript:mark(\'\',false);allOthers();"> <img src="/graphic/map/map_s.png?1" /></a> <input value="'+input+'" type="text" size="10" onKeyUp="mark(\'\',false);mark(this.value,true)" /> <a href="JavaScript:invert();"> <img src="/graphic/group_jump.png?1" /></a> <input type="checkbox" id="check_and" /> <input value="'+input2+'" type="text" size="10" onKeyUp="mark(\'\',false);coords(this.value)" /></th></tr>';
//			delRow.innerHTML = '<table class="vis">' + delButton + '</table>' + delRow.innerHTML;
			table.innerHTML=newElement+table.innerHTML+newElement;
		}
	}