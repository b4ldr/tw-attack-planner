theFormat='{coords} {Lc per 8 hours} {distance} {resources} {troops} {wall} {loyalty}';
    var doc=(window.frames.length>0)?window.main.document:document;

	table="";
	qu=doc.getElementsByTagName('td');
	ths=doc.getElementsByTagName('th');
	for(i=0;i<ths.length&&table=="";i++)
		{
		if(ths[i].innerHTML=='Defender:')	
			{
			table=ths[i].parentNode.parentNode;
			for(j=0;j<qu.length;j++)
				{
				if(qu[j].innerHTML=='Quantity:')
					{
					the=qu[j].parentNode;
					}
				if(qu[j].innerHTML=='Losses:')
					{
					them=qu[j].parentNode;
					}
				}
			}
		}
	myVillage=table.parentNode.parentNode.innerHTML.match(/\(\d+\|\d+\)/);
	mySplit=myVillage[0].replace("(","").replace(")","").split("|");
	Quantity=the.innerHTML.match(/\d+/g);
	losses=them.innerHTML.match(/\d+/g);
	
	function troops(name,no)
	{
	name=name+":"+(Quantity[no]-losses[no])+" ";if(name.indexOf(':0 ')!=-1){name="";}
	return name;
	}

	wall=doc.body.innerHTML.match(/Wall <b>\(Level \d+/);
	if(wall!=null){Wall=wall[0].replace("Wall <b>(Level ", "W:");Wall+=" ";}else {Wall="";}
	Loyalty=doc.body.innerHTML.match(/Loyalty loss from <b>\d+<\/b> to <b>\d+/);
	if(Loyalty!=null){Loyalty=Loyalty[0].replace(/Loyalty loss from <b>\d+<\/b> to <b>/, "L:");}else {Loyalty="";}
	coord=table.innerHTML.match(/\(\d+\|\d+\)/);coord+=" ";
	defSplit=coord.replace("(","").replace(")","").split("|");
	
	function fnGetConfig()
		{
        var oRequest=new XMLHttpRequest();
        var sURL="http://"+window.location.hostname+"/interface.php?func=get_config";
        oRequest.open("GET",sURL,0);
        oRequest.send(null);
        if(oRequest.status==200)return oRequest.responseXML;
        alert("Error executing XMLHttpRequest call to get Config!");
		}
	xmlDoc=fnGetConfig();
	var intWorldSpeed=xmlDoc.getElementsByTagName('speed')[0].childNodes[0].nodeValue;
    function fnProduction(intLevel){return(intLevel==0)?5*intWorldSpeed:Math.round(30*Math.pow(80,(intLevel-1)/29))*intWorldSpeed;}
	
	function building(name)
	{
	bod=doc.body.innerHTML;
	var regThis=new RegExp(name+" <b>\\(Level \\d+", "gi");

	nam=bod.match(regThis);
	nam_lvl=nam[0].match(/\d+/);
	return nam_lvl;
	}
	timbercamp=fnProduction(building('Timber camp'));
	claypit=fnProduction(building('Clay pit'));
	ironmine=fnProduction(building('Iron mine'));
	Lc8hour="Lc:"+Math.ceil((timbercamp/10)+(claypit/10)+(ironmine/10))+" ";
	
	res=doc.getElementsByTagName('th');
	for(k=0;k<res.length;k++)
		{
		a=res[k].innerHTML=='Resources scouted:';
		if(a)
			{
			ress=res[k].nextSibling.innerText;
			reso=ress.split(" ");
			wood="Wood:";wood+=reso[0];wood+=" ";if(wood=="Wood:0 "){wood="";}
			clay="Clay:";clay+=reso[1];clay+=" ";if(clay=="Clay:0 "){clay="";}
			iron="Iron:";iron+=reso[2];iron+=" ";if(iron=="Iron:0 "){iron="";}
			}
		else if(a==undefined)
			{
			wood="";clay="";iron="";
			}
		}
	fields="F:"+Math.round(Math.sqrt(Math.pow(defSplit[0]-mySplit[0],2)+Math.pow(defSplit[1]-mySplit[1],2))*10)/10;
	
	list=troops('Sp',0)+troops('Sw',1)+troops('Ax',2)+troops('Ar',3)+troops('Sc',4)+troops('Lc',5)+troops('Ma',6)+troops('Hc',7)+troops('Ra',8)+troops('Ca',9)+troops('Pa',10)+troops('No',11);
	doc.getElementById('editInput').value=theFormat.replace(/\{coords\}/, coord).replace(/\{distance\}/, fields).replace(/\{resources\}/, wood+clay+iron).replace(/\{Lc per 8 hours\}/, Lc8hour).replace(/\{troops\}/, list).replace(/\{wall\}/, Wall).replace(/\{loyalty\}/, Loyalty);
	inputs=doc.getElementById('edit');
	inputs.getElementsByTagName('input')[1].click();