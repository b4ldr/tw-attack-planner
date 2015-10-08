javascript:
/*theFormat='{target player} {coords} / {troops} {outside troops} {wall} {loyalty}';*/
	theFormat='{coords} {Own Village} {Lc per 8 hours} {distance} {resources} {troops} {outside troops} {wall} {loyalty}';

/* Handle Navigation to Previous Page */
	if(typeof tt != 'undefined') 
		{
		var doc=(window.frames.length>0)?window.main.document:document;
		as = doc.getElement('a:contains("<<")');
		if (as == null) 
			{
			alert(l.FirstReport);
			}
		else 
			{
			window.location=as.get('href');
			}
		} 
	else 
		{

		/* Translation Strings */
		var l = new Object;
		l.Attacker = "Agresor:";
		l.Village = "Sat:";
		l.Defender = "Ap&#259;r&#259;tor:";
		l.Quantity = "Num&#259;r:";
		l.Losses = "Pierderi:";
		l.Level = "nivelul";
		l.Resources = "Resurse spionate:";
		l.Wall = "Zid";
		l.Loyalty = "Loyalty";
		l.Conquered = "CONQUERED";
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
		l.Timbercamp = 'Taietori de lemne';
		l.Claypit = 'Mina de argila';
		l.Ironmine = 'Mina de fier';
		l.Wood = 'Wood';
		l.Clay = 'Clay';
		l.Iron = 'Iron';
		l.FirstReport = "At First Report";

  
  var doc=(window.frames.length>0)?window.main.document:document;
/* Initialize Variables */
  table=null; 
  unitList="";
  outsideList="";

/* Locate Relevant Sections for Troops */
  table=doc.getElement('th:contains("' + l.Defender + '")').getParent('table');
  quantity=table.getElement('table');
  quantity=(quantity!=null)?quantity.getElement('td:contains("' + l.Quantity +'")').getParent():table;
  losses=table.getElement('table');
  losses=(losses!=null)?losses.getElement('td:contains("' + l.Losses + '")').getParent():table;
  espionage=table.getNext('table');
  outside = (espionage!=null) ? espionage.getElement('table') : null;
  if (outside != null) {
    outside = outside.getElement('tr:last-child');
  }

  /* Extract Troop Numbers */
  var Quantity=(quantity!=table)?quantity.innerHTML.match(/\d+/g):new Array();;
  var Losses=(losses!=table)?losses.innerHTML.match(/\d+/g):new Array();;
  var Outside= (outside!=null) ? outside.innerHTML.match(/\d+/g) : null;

/* Support for Different Worlds */  
  var tt = new Array();
  switch(Losses.length) {
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
    unitList += troops(tt[i],i);
    outsideList += outsideTroops(tt[i],i);
  }
  
/* Format OutsideTroops String */
  if (outsideList.length > 0) {
    outsideList = "[" + outsideList.substring(0,outsideList.length-1) + "] ";
  }

  
/* Pull out Coordinates of own and target village */
  myVillage=table.getPrevious("table").innerHTML.match(/\(\d+\|\d+\)/);
  mySplit=myVillage[0].replace("(","").replace(")","").split("|");
  targetPlayer = table.getElements("th");
  var reTag = /<(?:.|\s)*?>/g;
  targetPlayer = targetPlayer[1].innerHTML.replace(reTag, "");
  coord=table.innerHTML.match(/\(\d+\|\d+\)/);coord+=" ";
  defSplit=coord.replace("(","").replace(")","").split("|");   

/*Get defending village name*/
	stuf=table.getElement('td:contains("' + l.Village + '")').getParent();
	villa=stuf.getElement('a').innerHTML;
	defVilName=villa.replace(/\(\d+\|\d+\) K\d+/i, "");

/*Get attacking village name*/
	attackerName=table.getParent().getElement('th:contains("' + l.Attacker + '")').getParent().getElement('a').innerHTML;
	attackerVillage=table.getParent().getElement('td:contains("' + l.Village + '")').getParent().getElement('a').innerHTML.replace(/\(\d+\|\d+\) K\d+/i, "");
	
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
  loyalty=doc.body.innerHTML.match(RegExp(l.Loyalty + " .*\\d+.*\\d+", "i"));
  if(loyalty!=null) {
    negative=loyalty[0].match(/-/g);
    change = loyalty[0].match(/\d+/g);
    loyalty = (negative!=null)?l.Conquered:l.L + ":" + change[1] + " ";
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
    
    res=doc.getElementsByTagName('th');
    for(k=0;k<res.length;k++){
      if(res[k].innerHTML==l.Resources){
        ress=res[k].nextSibling.textContent;
        reso=ress.split(" ");
        var wood=l.Wood+":";
        wood+=reso[0];
        wood+=" ";
        if(wood==l.Wood+":0 ") {
          wood="";
        }
        var clay=l.Clay+":";clay+=reso[1];
        clay+=" ";
        if(clay==l.Clay+":0 "){
          clay="";
        }
        var iron=l.Iron+":";
        iron+=reso[2];
        iron+=" ";
        if(iron==l.Iron+":0 "){
          iron="";
        }
      }
    }    
  } else {
    var wood="";
    var clay="";
    var iron="";
  }
  fields=l.Fields+":"+Math.round(Math.sqrt(Math.pow(defSplit[0]-mySplit[0],2)+Math.pow(defSplit[1]-mySplit[1],2))*10)/10;
  
/* Replace Tokens with Actual Values */
  var val = 
  theFormat
    .replace(/\{own village\}/i, myVillage)
	.replace(/\{defender village name\}/i, defVilName)
    .replace(/\{target player\}/i, targetPlayer)
    .replace(/\{target village\}/i, coord)
    .replace(/\{coords\}/i, coord)
    .replace(/\{attacker name\}/i, attackerName)
    .replace(/\{attacker village name\}/i, attackerVillage)
    .replace(/\{distance\}/i, fields)
    .replace(/\{resources\}/i, wood+clay+iron)
    .replace(/\{Lc per 8 hours\}/i, Lc8hour)
    .replace(/\{troops\}/i, unitList)
    .replace(/\{outside troops\}/i, outsideList)
    .replace(/\{wall\}/i, wall)
    .replace(/\{loyalty\}/i, loyalty);
/* Rename the Report */
  doc.getElementById('editInput').value = val;
  inputs=doc.getElementById('edit');
  inputs.getElementsByTagName('input')[1].click();
}

/* Return the number of troops remaining in the village */
function troops(name,no) {
  name=name+":"+(Quantity[no]-Losses[no])+" ";
  if(name.indexOf(':0 ')!=-1)
  {
    name="";
  }
  return name;
}

/* Return the number of troops outside the village (if available) */
function outsideTroops(name,no) { 
  if (Outside==null)
    return "";
  name=name+":"+(Outside[no])+" ";
  if(name.indexOf(':0 ')!=-1){
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
function building(name) {
  bod=doc.body.innerHTML;
  var regThis=new RegExp(name+" <b>\\(" + l.Level + " \\d+", "gi");

  nam=bod.match(regThis);
  if(nam==null){return 0;}
  else
  {
  nam_lvl=nam[0].match(/\d+/);    
  return nam_lvl;
  }
}