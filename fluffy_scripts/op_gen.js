function generateOp(includeName,playerBB){ 
	var root=(window.frames.length>0)?window.main:window;
	var output = "";
	var coords = new Array();
	var translation = "Villages";
	if(root.game_data.market == "hr")
		translation = "Sela";
	var report = getParent(getElement("th", translation), "table");
	var k = new Array();
	for(var x=0;x<100;x++){
		k[zeroPad(x,1)] = new Array();
	}
	var server = root.game_data.world;
	var infoTable = getParent(report, "table").getElementsByTagName("table")[0].rows;
	var thePlayer = getText(infoTable[0]);
	var playerId = root.document.URL.match(/id=(\d+)/i)[1];
	var theTribeTd = infoTable[4].cells[1];
	if(theTribeTd.innerHTML.match(/<\/a>/i)){
		var theTribe = theTribeTd.innerHTML.match(/.*?>(.*?)<\/a>/i)[1];
		var tribeId = theTribeTd.getElementsByTagName("a")[0].href.match(/id=(\d+)/i)[1];
	}
	var thePoints = getText(infoTable[1].cells[1]);
	var OD = getText(infoTable[3].cells[1]);
	function getElement(ele, text){
		var eleThs = root.document.getElementsByTagName(ele);
		var table;
		for(var i=0;i<eleThs.length;i++){
			if(eleThs[i].innerHTML.match(new RegExp(text, "i"))){
				table = eleThs[i];
				break;
			}
		}
		return table;
	}
	function getParent(obj, ele){
		var table = obj;
		do{table = table.parentNode;}
		while(!table.nodeName.match(new RegExp(ele, "i")));
		return table;
	}
	function zeroPad(intg,type){if(intg<1000&&type>=3)intg='0'+intg;if(intg<100&&type>=2)intg='0'+intg;if(intg<10&&type>=1)intg='0'+intg;return intg.toString();}
	function theK(str){var coordSplit=str.split("|");var X=zeroPad(coordSplit[0],2);var Y=zeroPad(coordSplit[1],2);return Y[0]+X[0];}
	function getText(ele){return typeof(root.document.body.innerText)=='undefined'?ele.textContent:ele.innerText;}
	var as = report.getElementsByTagName("a");
	for (i=1;i<report.rows.length;i++) {
		var currentName = as[i-1].innerHTML;
		var cod = getText(report.rows[i].cells[1]);
		var pint = getText(report.rows[i].cells[2]);
		coords[i-1] = cod;
		k[theK(cod)].push([cod,pint,currentName]);
	}
	var index = 1;
	for (var idx=0;idx<k.length;idx++){
		var curK = zeroPad(idx,1);
		if(k[curK][0]){
			output += "[b]K" + curK + " - "+k[curK].length+" villages;[/b]\n";
			for (var kdx=0;kdx<k[curK].length;kdx++){
				var villageLine = zeroPad(index,3);
				if(includeName)villageLine += " - " + k[curK][kdx][2];
				villageLine += " - [coord]" + k[curK][kdx][0] + "[/coord] - " + k[curK][kdx][1] + " ==> ";
				if(playerBB) villageLine += "[player][/player]";
				output += villageLine+'\n';
				index++;
			}
			output += "\n";
		}
	}
	function winWrite(title,str){return outputWin.document.write("<h3>"+ title +":</h3><textarea cols='80' rows='9' onFocus='this.select()'>" + str + "</textarea><br/>")}
	var outputWin = window.open();
	outputWin.document.open('text/html','replace');
	winWrite("Detailed info","Claim your village(s) you are going to noble by posting the black bolded number next to the village(s). No more, no less.\n\n----------------------------------------------------------------------------------------------------\n\n[color=#ff0000][i][b]HIT TIME[/b][/i][/color]\n>> \n\n\n[color=#ff0eff][i][b]AIM/MISSION :P[/b][/i][/color]\n>> \n\n[color=#4b004b][i][b]OP NOTES[/b][/i][/color]\n>> \n\n[color=#00a500][i][b]MISCELLANEOUS[/b][/i][/color]\n[img]http://www.twstats.com/image.php?type=playerssgraph&graph=points&id="+playerId+"&s="+server+"[/img]\n[img]http://www.twstats.com/image.php?type=playerssgraph&graph=villages&id="+playerId+"&s="+server+"[/img]\n\n>> Name: [player]"+thePlayer+"[/player]\n>> Points: "+thePoints+"\n>> OD: "+OD+"\n>> Tribe: [ally]"+theTribe+"[/ally]\n>> [url=http://www.twstats.com/"+server+"/index.php?page=player&fi=1&id="+playerId+"]TWStats[/url]\n>> [url=http://www.twstats.com/"+server+"/index.php?page=map&tribe_0_id="+tribeId+"&tribe_0_colour=ff00ff&player_0_id="+playerId+"&player_0_colour=00aeff&zoom=200&centrex=500&centrey=250&nocache=1&fill=000000&grid=1]Map[/url]\n\n\n" + output);
	if(!server.match(/uk/i)){
		winWrite("Random fake script for all villages","javascript:coords = '" + coords.join(" ") + "';var doc=(window.frames.length>0)?window.main.document:document;function doAllTheStuff(){coord = coords.split(' ');coordSplit = coord[Math.round(Math.random()*(coord.length-1))].split('|');doc.forms[0].x.value=coordSplit[0];doc.forms[0].y.value=coordSplit[1];var scouts=parseInt(doc.forms[0].spy.nextSibling.nextSibling.innerHTML.match(/\\d+/));if(scouts>0)doc.forms[0].spy.value = 1;rams = parseInt(doc.forms[0].ram.nextSibling.nextSibling.innerHTML.match(/\\d+/));if (rams!=0)doc.forms[0].ram.value = 1;else doc.forms[0].catapult.value = 1;}doAllTheStuff();");
		winWrite("Sequential fake script for all villages","javascript:coords = '" + coords.join(" ") + "';var doc=(window.frames.length>0)?window.main.document:document;function doAllTheStuff(){coords=coords.split(' ');index=0;farmcookie=document.cookie.match('(^|;) ?farm=([^;]*)(;|$)');if(farmcookie!=null)index=parseInt(farmcookie[2]);if(index>=coords.length)alert('last village');if(index>=coords.length)index=0;coord=coords[index];coordSplit=coord.split('|');index=index+1;cookie_date=new Date(2099,11,11);document.cookie ='farm='+index+';expires='+cookie_date.toGMTString ();doc.forms[0].x.value=coordSplit[0];doc.forms[0].y.value=coordSplit[1];doc.forms[0].spy.value = 1;rams = parseInt(doc.forms[0].ram.nextSibling.nextSibling.innerHTML.match(/\\d+/));if (rams!=0)doc.forms[0].ram.value = 1;else doc.forms[0].catapult.value = 1;}doAllTheStuff();");
		winWrite("Random fake train script for all villages","javascript:var unit=[0,0,0,0,0,0,1,0,0];var coords = '" + coords.join(" ") + "';var%20doc=document;if(window.frames.length>0)doc=window.main.document;url=doc.URL;if(url.indexOf('screen=place')==-1)alert('This%20script%20needs%20to%20be%20run%20from%20the%20rally%20point');coords=coords.split(' ');index=0;counter=1;traincookie=document.cookie.match('(^|;) ?train=([^;]*)(;|$)');countcookie=document.cookie.match('(^|;) ?count=([^;]*)(;|$)');if(traincookie!=null)index=parseInt(traincookie[2]);if(countcookie!=null)counter=parseInt(countcookie[2]);if(index>=coords.length)alert('last village');if(index>=coords.length)index=0;coords=coords[index];coords=coords.split('|');counter=counter+1;if(counter==5)index=index+1;if(counter==6)counter=1;cookie_date=new%20Date(2099,11,11);document.cookie='train='+index+';expires='+cookie_date.toGMTString();cookie_date=new%20Date(2099,11,11);document.cookie='count='+counter+';expires='+cookie_date.toGMTString();doc.forms[0].x.value=coords[0];doc.forms[0].y.value=coords[1];doc.forms[0].spear.value=unit[0];doc.forms[0].sword.value=unit[1];doc.forms[0].axe.value=unit[2];doc.forms[0].spy.value=unit[3];doc.forms[0].light.value=unit[4];doc.forms[0].heavy.value=unit[5];doc.forms[0].ram.value=unit[6];doc.forms[0].catapult.value=unit[7];doc.forms[0].snob.value=unit[8];end();");
	}
	outputWin.document.close();
}