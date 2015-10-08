	var doc=(window.frames.length>0)?window.main.document:document;
		
	function appendDataInput(){
		var eleAs = doc.getElementsByTagName("a");
		for(var j=0;j<eleAs.length;j++){
			if(eleAs[j].innerHTML=='Map')overview_bar = eleAs[j].getParent("table");
		}
		overview_bar.innerHTML += '<tr><td colspan="3">Target Village:<input id="snipe_coord" value="481|472" class="text-input inactive" size="7" onFocus="this.select()" /></td><td colspan="1">Hit time:<input id="arrival_time" size="25" class="text-input inactive" value="Dec 19, 2010 00:00:00" onFocus="this.select()" /></td><td><input type="button" value="Go" onClick="calculate()" /></td></tr>';		
		doc.body.innerHTML += '<div id="output"></div>';
	}
	function getDist(to,from){
		var target = to.split("|");
		var coords = from.split("|");
		var fields = Math.sqrt(Math.pow(coords[0]-target[0],2)+Math.pow(coords[1]-target[1],2));
		return fields;
	}
	function theInnerText(theNode){
		return typeof(theNode.innerText)=='undefined'?theNode.textContent:theNode.innerText;
	}
	function outputStr(m){
		doc.getElementById("output").appendChild(doc.createElement('br'));
		doc.getElementById("output").appendChild(doc.createTextNode(m));
	}
	function fnGetInfo(strType){
		var oRequest=new XMLHttpRequest();
		var sURL="http://"+window.location.hostname+"/interface.php?func="+strType;
		oRequest.open("GET",sURL,0);
		oRequest.send(null);
		if(oRequest.status==200)return oRequest.responseXML;
		alert("Error executing XMLHttpRequest call to "+strType+"!");
	}
	var xmlDoc=fnGetInfo("get_unit_info");
	var eleConfig=xmlDoc.getElementsByTagName("config")[0];
	function getUnitSpeed(unit){
		unitConfig = eleConfig.getElementsByTagName(unit)[0];
		unitSpeed = unitConfig.getElementsByTagName("speed")[0].childNodes[0].nodeValue;
		return unitSpeed;
	}
	function getLaunchTime(coord,target,unit,time){
		var sendTime = new Date();
		var distance = getDist(target,coord);
		var lcTime = distance*getUnitSpeed(unit)*60*1000;
		sendTime.setTime(parseInt(time.getTime(),10)-lcTime);
		return sendTime;
	}
	
	function calculate(){
		var arrive = doc.getElementById("arrival_time").value;
		var target = doc.getElementById("snipe_coord").value;
		var servertime = doc.getElementById("serverTime").innerHTML.match(/\d+/g);
		var serverDate = doc.getElementById("serverDate").innerHTML.match(/\d+/g);
		var serverTime = new Date(serverDate[1]+"/"+serverDate[0]+"/"+serverDate[2]+" "+servertime.join(":"));
		var arrivalTime = new Date(arrive);
		var time_remaining = Math.round((arrivalTime.getTime() - serverTime.getTime())/1000/60*100)/100;
		var output = new Array();
		var overViewTable = doc.getElement("th:contains('Village')").getParent("table");
		var eleTrs = overViewTable.rows;
		var eleThs = overViewTable.rows[0].getElementsByTagName("th");
		var arrUnit = new Array();
		var arrUnitPos = new Array();
		for (k=1;k<eleThs.length;k++){
			var imgSrc = eleThs[k].childNodes[0].src;
			if (imgSrc.match(/unit/) && !imgSrc.match(/spy/)){
				arrUnit.push(imgSrc.match(/unit_(.+)\.png/)[1]);
				arrUnitPos.push(k);
			}
		}
		for(var i=1;i<eleTrs.length;i++){
			var currentCoord = theInnerText(eleTrs[i].getElementsByTagName("a")[0]).match(/\((\d+\|\d+)\) K\d+/)[1];
			for(var x=0;x<arrUnit.length;x++){
				if((getDist(target,currentCoord)*getUnitSpeed(arrUnit[x]))<time_remaining){
					var troop_count = parseInt(eleTrs[i].cells[arrUnitPos[x]].innerHTML,10);
					if (troop_count!=0&&typeof troop_count=="number"){
						output.push([(getDist(target,currentCoord)*getUnitSpeed(arrUnit[x])),"Send "+arrUnit[x]+" from [village]"+currentCoord+"[/village] to [village]"+target+"[/village] at "+getLaunchTime(currentCoord,target,arrUnit[x],arrivalTime)]);
					}
				}
			}
		}
		output = output.sort(function(a,b){return (b[0]-a[0]);});
		doc.getElementById("output").innerHTML = '';
		for (q=0;q<output.length;++q){
			outputStr(output[q][1]);
		}
	}