/* 
	Author	: Fluffy88
	Website : http://fluffy88.com
	Modified by : dalesmckay
*/
function fnInjectOverviewBar(){
	/* Default to your own currently active village */
	var defaultCoords = $("title").html().match(/\d+\|\d+/);
	
	/* Default to midnight of next day */
	var defaultDate = new Date();
	defaultDate.setTime(((Math.floor(defaultDate.getTime()/msPerDay)+1)*minsPerDay + defaultDate.getTimezoneOffset())*msPerMin);
	defaultDate = defaultDate.toString().replace(/\w+\s*/i,"").replace(/(\d*:\d*:\d*)(.*)/i,"$1");
	
	/* Perform the injection */
	var overview_bar = eleDoc.getElementById("menu_row2").parentNode;
	overview_bar.innerHTML += '<tr><td colspan="3">Target Village:<input id="snipe_coord" value="'+defaultCoords+'" class="text-input inactive" size="7" onFocus="this.select()" /></td><td colspan="1">Hit time:<input id="arrival_time" size="25" class="text-input inactive" value="'+defaultDate+'" onFocus="this.select()" /></td><td><input type="button" value="Go" onClick="fnCalculateBackTime()" /></td></tr>';	
	eleDoc.body.innerHTML += '<div id="output"></div>';
}

function fnCalculateDistance(to,from){
	var target = to.match(/(\d+)\|(\d+)/);
	var source = from.match(/(\d+)\|(\d+)/);
	var fields = Math.sqrt(Math.pow(source[1]-target[1],2)+Math.pow(source[2]-target[2],2));
	
	return fields;
}

function fnExtractInnerText(element){
	return String(element.textContent||element.innerText);
}

function fnLogMessage(message){
	var eleOutput = eleDoc.getElementById("output");
	eleOutput.appendChild(eleDoc.createElement('br'));
	eleOutput.appendChild(eleDoc.createTextNode(message));
}

function fnGetConfigXML(command){
	var oRequest = false;

	/* branch for native XMLHttpRequest object */
	if(window.XMLHttpRequest && !(window.ActiveXObject)) {
		try {
			oRequest = new XMLHttpRequest();
		} 
		catch(objError) {
			oRequest = false;
		}
	} 
	/* branch for IE/Windows ActiveX version */
	else if(window.ActiveXObject) {
		try {
			oRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} 
		catch(objError) {
			try {
				oRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} 
			catch(objError) {
				oRequest = false;
			}
		}
	}

	if(oRequest) {
		var sURL="http://"+window.location.hostname+"/interface.php?func=" + command; 
		oRequest.open("GET",sURL,false); 
		oRequest.send(null); 
		if(oRequest.status==200){
			return oRequest.responseXML;
		}
	}

	throw("Error executing XMLHttpRequest call to get Config!");
}

/* NOTE: it does not return enclosing curly braces {}, these need to be added by the caller if desired */
function xmlToJSONstr(xmlNode){
	var attrib = "";
	
	if(xmlNode.hasChildNodes){
		attrib += "\"" + xmlNode.nodeName + "\":";
		var nodes=xmlNode.childNodes;
		var init=false;
		for(var ii=0; ii<nodes.length; ii++){
			if(nodes[ii].nodeType==1){
				if(init){attrib+=",";}else{attrib+="{";init=true;}
				attrib += xmlToJSONstr(nodes[ii]);
			}
		}
			
		if(init){
			attrib+="}";
			return attrib;
		}
	}
	
	if(xmlNode.childNodes.length<=1){
		if(navigator.userAgent.match(/(?:Firefox|Opera)[\/\s](\d+\.\d+)/i)){
			attrib += "\"" + xmlNode.childNodes[0].nodeValue + "\"";
		}
		else{
			attrib += "\"" + xmlNode.text + "\"";
		}
	}
                
	return attrib;
}

function fnCreateConfig(command){
	var confInfoXML=fnGetConfigXML(command);
	if(!confInfoXML){
		throw("Failed to fetch config: " + command);
	}
		  
	var strJSON=xmlToJSONstr(confInfoXML.documentElement);
	
	return eval("({" + strJSON + "})");
}

function fnCalculateLaunchTime(source,target,unit,landingTime){
	var distance = fnCalculateDistance(target,source);
	var unitSpeed = unitConfig.config[unit].speed;

	/* Convert minutes to milli-seconds */
	var unitTime = distance*unitSpeed*msPerMin;
	
	/* Truncate milli-second portion of the time */
	var launchTime = new Date();
	launchTime.setTime(Math.round((landingTime.getTime() - unitTime)/msPerSec)*msPerSec);

	return launchTime;
}

function fnExtractUnitCells(eleTable){
	var arrHeaders = eleTable.rows[0].getElementsByTagName("th");
	var row,imgSrc,unit,units = {};

	for(row=1;row<arrHeaders.length;row++){
		imgSrc = arrHeaders[row].childNodes[0].src;
		unit = imgSrc.match(/unit\_(.+)\.png/i);
		if(unit&&(unit[1]!="spy")){
			units[unit[1]] = row;
		}
	}
	
	return units;
}
	
function fnCalculateBackTime(){
	var arrivalTime = new Date(eleDoc.getElementById("arrival_time").value);
	var target = eleDoc.getElementById("snipe_coord").value;
	var servertime = eleDoc.getElementById("serverTime").innerHTML.match(/\d+/g);
	var serverDate = eleDoc.getElementById("serverDate").innerHTML.match(/\d+/g);
	serverTime = new Date(serverDate[1]+"/"+serverDate[0]+"/"+serverDate[2]+" "+servertime.join(":"));
	var output = [];
	var row,unit,ii,troop_count,source,launchTime;
	var eleTable = eleDoc.getElementById("combined_table");
	var arrCells=fnExtractUnitCells(eleTable);

	/* TODO: Implement support for Overviews->Troops Screen */
	
	/* Loop through your own villages */
	for(row=1; row<eleTable.rows.length; row++){
		source= fnExtractInnerText(eleTable.rows[row].getElementsByTagName("a")[0]).match(/\((\d+\|\d+)\)\s*K\d+/)[1];
		if(source!= target){
			for(unit in arrCells){
				if(arrCells.hasOwnProperty(unit)){
					troop_count = parseInt(fnExtractInnerText(eleTable.rows[row].cells[arrCells[unit]]),10);		
					if(troop_count>0){
						launchTime=fnCalculateLaunchTime(source,target,unit,arrivalTime);
						if(launchTime.getTime() > serverTime.getTime()){
							output.push([launchTime.getTime(),"Send "+unit+"(" + troop_count + ") from [coord]"+source+"[/coord] to [coord]"+target+"[/coord] at "+launchTime.toString().replace(/(\d*:\d*:\d*)(.*)/i,"$1")]);
						}
					}
				}
			}
		}
	}
	
	/* Sort by Launch Time in Ascending Order */		
	output = output.sort(function(a,b){return (a[0]-b[0]);});
	
	/* Clear existing messages and display version */
	var srcHTML = "";
	srcHTML += "<br/>";
	srcHTML += "<span>Fluffy88\'s Snipe Calculator " + version + "<hr></span>";
	srcHTML += "<br/>";

	if(output.length > 0){		
		srcHTML += "<div align=\"center\"><textarea wrap=\"off\" readonly=\"yes\" cols=\"80\" rows=\"" + (output.length+1) + "\" style=\"width:95%;background-color:transparent;\" onfocus=\"this.select();\">";

		for(ii=0;ii<output.length;ii++){
			srcHTML += output[ii][1] + "\n";
		}

		srcHTML += "</textarea></div>";
	}
	else{
		srcHTML += "<span style=\"color:red;\">Impossible to reach on time</span>";
	}

	srcHTML += "<br/><br/><br/>";
	
	eleDoc.getElementById("output").innerHTML = srcHTML;
	
	/* Show the Launch Time(s) */
/*
	if(output.length>0){		
		for(ii=0;ii<output.length;ii++){
			fnLogMessage(output[ii][1]);
		}
	}
	else{
		fnLogMessage("Impossible to reach on time");
	}
	
	fnLogMessage("");
	fnLogMessage("");
	fnLogMessage("");
*/
}

var msPerSec=1000;
var secsPerMin=60;
var minsPerHour=60;
var hrsPerDay=24;
var msPerMin=msPerSec*secsPerMin;
var msPerHour=msPerMin*minsPerHour;
var msPerDay=msPerHour*hrsPerDay;
var minsPerDay=hrsPerDay*minsPerHour;

var version='v2.4';

var eleDoc=(window.frames.length>0)?window.main.document:document;
var unitConfig=fnCreateConfig("get_unit_info");

fnInjectOverviewBar();