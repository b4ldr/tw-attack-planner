	var root=(window.frames.length>0)?window.main:window;
	var reportTable = getReportTable();

	for(var i=1;i<reportTable.rows.length-1;i++){
		var reportURL = reportTable.rows[i].getElementsByTagName("a")[0].href;
		createNewIframe("report_"+i, reportURL);
		getFrameBody("report_"+i);
	}

	function createNewIframe(id, reportURL){
		var newIframe = root.document.createElement('iframe');
		newIframe.setAttribute("id", id);
		newIframe.setAttribute("width", "0");
		newIframe.setAttribute("height", "0");
		newIframe.setAttribute("frameborder", "0");
		newIframe.setAttribute("src", reportURL);
		root.document.body.appendChild(newIframe);
		fnStatus("Appended iframe: " + id + " : " + reportURL);
	}
	function getReportTable(){
		var eleSpans = root.document.getElementsByTagName("span");
		for(var i=0;i<eleSpans.length;i++){
			if(eleSpans[i].id.match(/labelText\[\d+\]/i)){
				var table = eleSpans[i].getParent("table");
				fnStatus("Table found, header: " + table.rows[0].cells[0].innerHTML);
				return table;
			}
		}
	}
	function getFrameBody(id){
		reportFrame = root.document.getElementById(id);
		if(reportFrame){
			reportFrame = reportFrame.contentWindow.document;
			if(reportFrame.getElementById("serverTime")){
				if(reportFrame.getElementById("attack_luck")){
					rename("{Defender village coord} {Attacker village coord} {resources} {distance} {defenders Remaining troops} {outside troops} {wall} {loyalty} {delete-fake-report}", 10);
				}else{
					alert("This is not an attack or defense report!");
				}
			}else{
				setTimeout("getFrameBody('"+id+"');", 500);
			}
		}else{
			setTimeout("getFrameBody('"+id+"');", 500);
		}
	}
    function fnStatus(strMessage){
		root.document.body.appendChild(root.document.createTextNode(strMessage));
		root.document.body.appendChild(root.document.createElement('br'));
	}
function rename(format, Fake) {
var fake=Fake;
/*theFormat='{target player} {coords} / {troops} {outside troops} {wall} {loyalty}';*/
	var theFormat = format;
	
		/* Translation Strings */
		var l = new Object;
		l.Attacker = "Attacker:";
		l.Origin = "Origin:";
		l.Destination = "Destination:";
		l.Defender = "Defender:";
		l.k = "K";
		l.Quantity = "Quantity:";
		l.Losses = "Losses";
		l.Level = "Level";
		l.Resources = "Resources scouted:";
		l.Loyalty = "Loyalty:";
		l.dropped_from = "Dropped from";
		l.Conquered = "CONQUERED";
		l.Cleared = "CLEARED";
		l.DeadNoble = "Dead Noble";
		l.Haul = "Haul:";
		l.Delete = "Delete";
		l.W = 'W';
		l.L = 'L';
		l.Fields = 'F';
		l.Sp = 'Sp';
		l.Sw = 'Sw';
		l.Ax = 'Ax';
		l.Ar = 'Ar';
		l.Sc = 'Sc';
		l.Lc = 'Lc';
		l.Ma = 'Ma';
		l.Hc = 'Hc';
		l.Ra = 'Ra';
		l.Ca = 'Ca';
		l.Pa = 'Pa';
		l.No = 'No';
		l.VillageHeadquarters = 'Village Headquarters';
		l.Barracks = 'Barracks';
		l.Stable = 'Stable';
		l.Workshop = 'Workshop';
		l.Smithy = 'Smithy';
		l.Academy = 'Academy';
		l.Firstchurch = 'First church';
		l.Church = 'Church';
		l.Rallypoint = 'Rally point';
		l.Statue = 'Statue';
		l.Market = 'Market';
		l.Timbercamp = 'Timber camp';
		l.Claypit = 'Clay pit';
		l.Ironmine = 'Iron mine';
		l.Farm = 'Farm';
		l.Warehouse = 'Warehouse';
		l.Hidingplace = 'Hiding place';
		l.Wall = 'Wall';
		l.Wood = 'Wood';
		l.Clay = 'Clay';
		l.Iron = 'Iron';
		l.FirstReport = "At First Report";

	var doc=reportFrame;
	var reportId = doc.URL.match(/view=(\d+)/i)[1];
/* Initialize Variables */
	var version = '2.0';
	table = null;
	unitList = "";
	outsideList = "";
	attTroops = "";
	attackerOriginal = "";
	attackerLosses = "";
	defenderOriginal = "";
	defenderLosses = "";
	att = 0;
	attL = 0;
	def = 0;
	defL = 0;
	addClear = "";
	lcAll = "";
	ress = null;
  
  c('Version: '+version);

/* Locate Relevant Sections for Troops */
  table=doc.getElement('th:contains("' + l.Defender + '")').getParent('table');
  defPlayerId = table.getElementsByTagName("a")[0].href.match(/id=(\d+)/);
  quantity=table.getElement('table');
  quantity=(quantity!=null)?quantity.getElement('td:contains("' + l.Quantity +'")').getParent():table;
  losses=table.getElement('table');
  losses=(losses!=null)?losses.getElement('td:contains("' + l.Losses + '")').getParent():table;
  espionage=table.getNext('table');
  outside = (espionage!=null) ? espionage.getElement('table') : null;
  if (outside != null) {
    outside = outside.getElement('tr:last-child');
  }
  var attackerTable=table.getParent().getElement('th:contains("' + l.Attacker + '")').getParent().getParent();
  attquantity=attackerTable.getElement("table").getElement("td:contains('" + l.Quantity +"')").getParent();
  attlosses=attquantity.getNext();
  

  /* Extract Defenders Troop Numbers */
  var Quantity=(quantity!=table)?quantity.innerHTML.match(/\d+/g):new Array();;
  var Losses=(losses!=table)?losses.innerHTML.match(/\d+/g):new Array();;
  var Outside= (outside!=null) ? outside.innerHTML.match(/\d+/g) : null;
  
  
  /*Get attackers troops*/
  var attQuantity=(attquantity!=attackerTable)?attquantity.innerHTML.match(/\d+/g):new Array();;
  var attLosses=(attlosses!=attackerTable)?attlosses.innerHTML.match(/\d+/g):new Array();;
  
/* Support for Different Worlds */  
  var tt = new Array();
  switch(attLosses.length) {
    case 9:
      tt = new Array(l.Sp,l.Sw,l.Ax,l.Sc,l.Lc,l.Hc,l.Ra,l.Ca,l.No);
      break;
    case 10:
      tt = new Array(l.Sp,l.Sw,l.Ax,l.Sc,l.Lc,l.Hc,l.Ra,l.Ca,l.Pa,l.No);
      break;
    case 11:
      tt = new Array(l.Sp,l.Sw,l.Ax,l.Ar,l.Sc,l.Lc,l.Ma,l.Hc,l.Ra,l.Ca,l.No);
      break;
    case 12:
      tt = new Array(l.Sp,l.Sw,l.Ax,l.Ar,l.Sc,l.Lc,l.Ma,l.Hc,l.Ra,l.Ca,l.Pa,l.No);
      break;
  }

/* Format Troop Strings */
  for(i=0;i<tt.length;i++) {
	attTroops += troops(tt[i],attQuantity[i],attLosses[i]);
	attackerOriginal += troops(tt[i],attQuantity[i],0);
	attackerLosses += troops(tt[i],attLosses[i],0);
	att += new Number(attQuantity[i]);
	attL += new Number(attLosses[i]);
	if ( quantity.innerHTML.indexOf(l.Quantity) != -1 ) {
		unitList += troops(tt[i],Quantity[i],Losses[i]);
		defenderOriginal += troops(tt[i],Quantity[i],0);
		defenderLosses += troops(tt[i],Losses[i],0);
		def += new Number(Quantity[i]);
		defL += new Number(Losses[i]);
		}
	outsideList += outsideTroops(tt[i],i);
  }

  /*percentage troops remaining*/
	percentageLost = "%L:" + Math.round(attL/att*100);
	if(quantity.innerHTML.indexOf(l.Quantity)!=-1&&defL!=0&&def!=0) {
		percentageKilled = "%K:" + Math.round(defL/def*100)
		}
	else if(defL==0&&def!=0) {
		percentageKilled = "%K:0"
		}
	else {
		percentageKilled = ""
		}

  /*Adding cleared, dead noble and church*/
  if(percentageKilled == "%K:100") {addClear = l.Cleared;percentageKilled = "";}
  
  var deadNoble = parseInt(attLosses[attLosses.length-1]);
  if (deadNoble!=0)addingDeadNoble = l.DeadNoble;
  else addingDeadNoble = "";
  
  churchLvl = "";
  if (building(l.Church)!=0) churchLvl = "C:" + building(l.Church);
		
  /* Format OutsideTroops String */
  if (outsideList.length > 0) {
    outsideList = "[" + outsideList.substring(0,outsideList.length-1) + "] ";
  }

  
/* Pull out Coordinates of own and target village */
	var attackingVillage = table.getPrevious("table").innerHTML.match(RegExp("\\((\\d+\\|\\d+)\\).*("+l.k+"\\d+)"));
  myVillage=attackingVillage[1];
  mySplit=myVillage.split("|");
  var attackerContinent = attackingVillage[2];
  targetPlayer = table.getElements("th");
  var reTag = /<(?:.|\s)*?>/g;
  targetPlayer = targetPlayer[1].innerHTML.replace(reTag, "");
  var defendingVillage = table.innerHTML.match(RegExp("\\((\\d+\\|\\d+)\\).*("+l.k+"\\d+)"));
  coord = defendingVillage[1];
  defSplit=coord.split("|");
  var defenderContinent = defendingVillage[2];

/*Get defending village name*/
	stuf=table.getElement('td:contains("' + l.Destination + '")').getParent();
	villa=stuf.getElement('a');
	defVilId = villa.href.match(/id=(\d+)/);
	defVilName=villa.innerHTML.replace(/\(\d+\|\d+\) K\d+/i, "");

/*Get attacking village name*/
	attackerName=attackerTable.getElement("tr").getElement('a');
	attackerPlayerId = attackerName.href.match(/id=(\d+)/);
	attackerName=attackerName.innerHTML;
	attackerVilTab = table.getParent().getElement('td:contains("' + l.Origin + '")').getParent().getElement('a'); 
	attackerVilId = attackerVilTab.href.match(/id=(\d+)/);
	attackerVillage= attackerVilTab.innerHTML.replace(/\(\d+\|\d+\) K\d+/i, "");
	
/* Determine Wall Level */
  wall=building(l.Wall);
  wall=(wall>0)?l.W+":"+wall+" ":"";
  
  /* Account for Rams & Catapult Damage */
  walldmg=doc.body.innerHTML.match(RegExp(l.Wall + " .*\\d+.*\\d+", "ig"));
  if (walldmg != null) {
    change = walldmg[walldmg.length-1].match(/\d+/g);
    if (change.length==2) {
      wall = l.W+":"+change[1]+" ";
    }
  }

/* Determine Loyalty Level */
  loyalty=doc.body.innerHTML.match(RegExp(l.Loyalty + ".*[\s\n].*?" + l.dropped_from + ".*?\\d+.*?\\d+", "i"));
  if(loyalty!=null) {
    negative=loyalty[0].match(/-/);
    change = loyalty[0].match(/\d+/g);
    loyalty = (negative!=null)?l.Conquered:l.L + ":" + change[2] + " ";
  } else {
    loyalty = "";
  }
  
/* Determine World Speed  */
  xmlDoc=fnGetConfig();
  var intWorldSpeed=xmlDoc.getElementsByTagName('speed')[0].childNodes[0].nodeValue;

  Lc8hour = "";
/* Determine Amount of LC Needed, and Production of each Resource based on level */
  if(table.parentNode.innerHTML.indexOf(l.Resources)!=-1) {
  
    timbercamp=fnProduction(building(l.Timbercamp));
    claypit=fnProduction(building(l.Claypit));
    ironmine=fnProduction(building(l.Ironmine));
    Lc8hour=l.Lc+":"+Math.ceil((timbercamp/10)+(claypit/10)+(ironmine/10))+" ";
    if (Lc8hour.length<=5) {
      Lc8hour="";
    }
 /*Get resources scouted*/
    res=doc.getElementsByTagName('th');
    for(k=0;k<res.length;k++){
		if(res[k].innerHTML==l.Resources){
			ress=typeof(doc.body.innerText)=='undefined'?res[k].nextSibling.textContent:res[k].nextSibling.innerText;
			reso=ress.split(" ");
			var wood=l.Wood+":";
			var Wood = reso[0];
			wood+=Wood;
			wood+=" ";
			if(wood==l.Wood+":0 ") {wood=""}
			var clay=l.Clay+":";
			var Clay = reso[1];
			clay+=Clay;
			clay+=" ";
			if(clay==l.Clay+":0 "){clay=""}
			var iron=l.Iron+":";
			var Iron = reso[2];
			iron+=Iron;
			iron+=" ";
			if(iron==l.Iron+":0 "){iron=""}
			ress = ress.replace(/\./g,"");
			reso = ress.split(" ");
			resourcesRemaining=(parseInt(reso[0],10))+(parseInt(reso[1],10))+(parseInt(reso[2],10));
			lcNeeded = Math.ceil(resourcesRemaining/80);
			if (lcNeeded != 0) {lcAll = "LCall:" + lcNeeded}
			else {lcAll = ""}
		}
	}    
  } else {
    var wood="";
    var clay="";
    var iron="";
  }
  /*Calculate Distance in fields*/
  fields=l.Fields+":"+Math.round(Math.sqrt(Math.pow(defSplit[0]-mySplit[0],2)+Math.pow(defSplit[1]-mySplit[1],2))*10)/10;
  
  /*Getting hauls*/ 
	haulTable=doc.getElement("th:contains('" + l.Haul + "')");
	if ( haulTable != null ) {
		haulTotal=haulTable.getParent().getElement("td:contains('/')");
		haulTotals=haulTotal.innerHTML.match(/\d+/g);
		haulTaken=haulTotals[0];
		haulPossible=haulTotals[1];
		percentageHaul="%H:" + Math.round(haulTaken/haulPossible*100);
		if ( ress != null ) {
			percentageRemaining="%R:" + Math.round(resourcesRemaining/haulPossible*100);
		} else {
			percentageRemaining="";
		}
	} else {
		percentageHaul="";
		percentageRemaining="";
	}
	
 /*Calculate farmspace*/
	var strBuildings=typeof(doc.body.innerText)=='undefined'?doc.body.textContent:doc.body.innerText;
	
	var arrBs=[];
	arrBs.push([l.VillageHeadquarters,10,[1.17,5]]);
	arrBs.push([l.Firstchurch,10,[1,5]]);
	arrBs.push([l.Church,10,[1.55,5000]]);
	arrBs.push([l.Barracks,16,[1.17,7]]);
	arrBs.push([l.Stable,20,[1.17,8]]);
	arrBs.push([l.Workshop,24,[1.17,8]]);
	arrBs.push([l.Academy,512,[1.17,80]]);
	arrBs.push([l.Smithy,19,[1.17,20]]);
	arrBs.push([l.Rallypoint,0,[1,0]]);
	arrBs.push([l.Statue,24,[1,10]]);
	arrBs.push([l.Market,10,[1.17,20]]);
	arrBs.push([l.Timbercamp,6,[1.155,5]]);
	arrBs.push([l.Claypit,6,[1.14,10]]);
	arrBs.push([l.Ironmine,6,[1.17,10]]);
	var idxFarm=arrBs.length;
	arrBs.push([l.Farm,5,[1.172102,-240]]);
	arrBs.push([l.Warehouse,6,[1,0]]);
	arrBs.push([l.Hidingplace,5,[1.17,2]]);
	arrBs.push([l.Wall,8,[1.17,5]]);
	
	var arrLevels=arrBs.map(fnLevel);
	var arrFarmSpace=arrBs.map(fnFarmSpace);
	intFarmSpace=-1*fnSum(arrFarmSpace);
	if(intFarmSpace!=0)	{
	farmSpace="FS:"+intFarmSpace;
	}
	else{farmSpace=""}
	
/* Replace Tokens with Actual Values */
  var val = 
  theFormat
    .replace(/\{attacker name\}/i, attackerName) /* DONE */
    .replace(/\{attacker player Id\}/i, attackerPlayerId[1]) /* DONE */
    .replace(/\{Attacker village coord\}/i, myVillage) /* DONE */
    .replace(/\{attacker village name\}/i, attackerVillage) /* DONE */
    .replace(/\{attacker village Id\}/i, attackerVilId[1]) /* DONE */
    .replace(/\{attacker village continent\}/i, attackerContinent) /* DONE */
    .replace(/\{Defender name\}/i, targetPlayer) /* DONE */
    .replace(/\{Defender player Id\}/i, defPlayerId[1]) /* DONE */
    .replace(/\{Defender village coord\}/i, coord) /* DONE */
	.replace(/\{defender village name\}/i, defVilName) /* DONE */
	.replace(/\{defender village Id\}/i, defVilId[1]) /* DONE */
    .replace(/\{defender village continent\}/i, defenderContinent) /* DONE */
    .replace(/\{report id\}/i, reportId)
    .replace(/\{distance\}/i, fields) /* DONE */
    .replace(/\{resources\}/i, wood+clay+iron)/* DONE */
    .replace(/\{Wood\}/i, Wood)/* DONE */
    .replace(/\{Clay\}/i, Clay)/* DONE */
    .replace(/\{Iron\}/i, Iron)/* DONE */
	.replace(/\{Attackers Original Troops\}/i, attackerOriginal) /* DONE */
	.replace(/\{Attackers Remaining Troops\}/i, attTroops) /* DONE */
	.replace(/\{Attackers Losses\}/i, attackerLosses) /* DONE */
    .replace(/\{defenders Original troops\}/i, defenderOriginal) /* DONE */
    .replace(/\{defenders Remaining troops\}/i, unitList) /* DONE */
    .replace(/\{defenders Losses\}/i, defenderLosses) /* DONE */
    .replace(/\{outside troops\}/i, outsideList)
	.replace(/\{Cleared\}/i,addClear) /* DONE */
    .replace(/\{%Lost\}/i, percentageLost) /* DONE */
    .replace(/\{%Killed\}/i, percentageKilled) /* DONE */
    .replace(/\{%Remaining\}/i, percentageRemaining)/* DONE */
    .replace(/\{%Haul\}/i, percentageHaul)/* DONE */
    .replace(/\{Dead Noble\}/i, addingDeadNoble) /* DONE */
    .replace(/\{LC All\}/i, lcAll)/* DONE */
    .replace(/\{wall\}/i, wall)/* DONE */
    .replace(/\{FarmSpace\}/i, farmSpace)
    .replace(/\{Church Level\}/i, churchLvl)
    .replace(/\{Lc per 8 hours\}/i, Lc8hour)
    .replace(/\{delete-fake-report\}/i, "")
    .replace(/\{loyalty\}/i, loyalty);/* DONE */

/*Full Systems check.*/
/*alert(attackerName+"\n"+myVillage+"\n"+attackerVillage+"\n"+targetPlayer+"\n"+coord+"\n"+defVilName+"\n"+fields+"\n"+wood+clay+iron+"\n"+Lc8hour+"\n"+attackerOriginal+"\n"+attTroops+"\n"+attackerLosses+"\n"+defenderOriginal+"\n"+unitList+"\n"+defenderLosses+"\n"+outsideList+"\n"+farmSpace+"\n"+percentageRemaining+"\n"+percentageHaul+"\n"+wall+"\n"+loyalty);

	
	/*Rename or Delete report*/
	as = doc.getElement('a:contains("<<")');
	if((att==attL)&&(att<fake)&&(theFormat.indexOf("{delete-fake-report}")!=-1)) {fnDeleteReport()}
	else if(doc.getElementById('editInput').value==val&&as!=null){window.location=as.get('href')}
	else if(doc.getElementById('editInput').value==val&&as==null)alert(l.FirstReport);
	else{
		doc.getElementById('editInput').value=val;
		inputs=doc.getElementById('edit');
		inputs.getElementsByTagName('input')[1].click()
		}


	/*Delete Function*/
	function fnDeleteReport() {
		window.location=table.getParent('table').getParent('table').getElement("a:contains('"+l.Delete+"')").get("href");
	}
	
	/* Return the number of troops remaining in the village */
	function troops(name,Quantity,Losses) {
		name=name+":"+(Quantity-Losses)+" ";
		if(name.indexOf(':0 ')!=-1) {
			name="";
		}
		return name;
	}

	/* Return the number of troops outside the village (if available) */
	function outsideTroops(name,no) { 
		if (Outside==null)
		return "";
		name=name+":"+(Outside[no])+" ";
		if(name.indexOf(':0 ')!=-1) {
			name="";
		}
		return name;
	}

	/* Get and return the world configuration */
	function fnGetConfig() {
		var oRequest=new XMLHttpRequest();
		var sURL="http://"+window.location.hostname+"/interface.php?func=get_config";
		oRequest.open("GET",sURL,0);
		oRequest.send(null);
		if(oRequest.status==200)return oRequest.responseXML;
		alert("Error executing XMLHttpRequest call to get Config!");
	}

	/* Get and return the speed of production for a specific level */
	function fnProduction(intLevel) {
		return(intLevel==0)?5*intWorldSpeed:Math.round(30*Math.pow(80,(intLevel-1)/29))*intWorldSpeed;
	}

	/* Get and return the building level (when passed the building name */
	function c(m){
		doc.body.appendChild(doc.createTextNode(m));
		doc.body.appendChild(doc.createElement('br'));
	}
	function building(name) {
		bod=doc.body.innerHTML;
		var reggy=new RegExp(name+" <b>\\(" + l.Level + " \\d+", "gi");

		nam=bod.match(reggy);
		if(nam==null){return 0;}
		else {
			nam_lvl=parseInt(nam[0].match(/\d+/));
			return nam_lvl;
		}
	}

	/*Farmspace calculator functions*/
	function fnLevel(arrB) {
		var regThis=new RegExp("\\b"+arrB[0]+"\\b\\s\\(" + l.Level + "\\s(\\d+)\\)","i");
		if(arrMatch=strBuildings.match(regThis)){return parseInt(arrMatch[1],10);}else{return 0;}
	}
	function fnFarmSpace(arrB,idx) {
		if(arrLevels[idx]==0)return 0;
		return Math.round(arrB[2][1]*Math.pow(arrB[2][0],arrLevels[idx]-1));
	}
	function fnSum(arr) {
		var intSum=0;
		arr.forEach(function(intValue){intSum+=intValue;});
		return intSum;
	}
}