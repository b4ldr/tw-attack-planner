function myMassRecruit(xmlConfig){
	var strVersion='1.0(g)';
	
	var strVillage='Village';
	try {var arrLang=location.hostname.split('.');
		 var strLang=arrLang[arrLang.length-1];
		 if(strLang=='ro')strVillage='Sat';
		 if(strLang=='br')strVillage='Aldeia';
		 if(strLang=='pt')strVillage='Aldeia';
		 if(strLang=='no')strVillage='Landsby';
		 if(strLang=='dk')strVillage='Landsby';
		 if(strLang=='se')strVillage='By';
		 if(strLang=='it')strVillage='Villaggio';
		 if(strLang=='pl')strVillage='Wioska';
		 if(strLang=='ru')strVillage='Деревня';
		}
	catch(objError){}
	
	/* todo: highlight 0 queue + prod where value is to be entered
	clean up the rounding errors

	hmmm	1. work in latest versions of ie,chrome,ff & opera
	OK		2. take you to the right page
	OKish	3. use the group you are in for the config
	OK		4. work faster
	OK		5. have all the queues a bit busier in the early stages
	OK		6. be able to keep a reserve of resources in the village
	OK		7. recruit to the limit... (ie. not stop when pop is nearly 24000)
	0.1(a)	26/10 	OK	17. version numbers to help with error checking / bug reporting...
	1.0(a)	26/10 	OK	18. check all browsers and release a version 1.0
	1.0(a)	26/10	OK	24. do a new version of the loader that will not alert when on the wrong screen...
	1.0(a)	27/10	OK	21. pictures for world speed & remove the text - replace with the world url...
	

	8. highlight the fields that have non zero config entries and have zero queue+produced.
	9. create max per click
	10. move queue times to a new column & remove old ones before writing new...
	11. export/import config settings from cookies...
	12. more queue balancing ... once over the min ... try and recruit so that all stay in line... take more notice of existing queue...
	13. add min queue priority settings to config  - player chooses which queues take priority in getting to min queue length - scrap this 25. instead
	14. get some tooltips going to help with config & queue times especially...
	15. feedback for each village/unit on what is limiting production.. reserve/farmspace/queue max reached / config max reached.. 
		perhaps use 'tooltip's for this
	16. feedback on total amounts recruiting now/queued/produced
	19. have a checkbox to choose to filter out rows with no farmspace etc...
	20. clone the recruit button to the top of the table... perhaps into the 'total amounts recruiting now' row...
	1.0(a)	27/10	OK	21. pictures for world speed & remove the text - replace with the world url...
	22. check that the loader works correctly on sat accounts.
	23. create a recalculate button for when the config gets changed.
	24. fix account sitting url switch problem...
	1.0(b) 11/12 Added support for ro and br servers...
	notes...
	25. min and max config values... and scrap 13.
	ibox.style = 'background-color: #BFB;';
	if (queue[i]+produced[i] == 0)
	ibox.style = 'background-color: #FAA;';

	ref:http://forum.tribalwars.net/showpost.php?p=2146163&postcount=271
	default queue=[[24,999],[24,999],[24,999]];
	config is currently
	groupID wood,clay,iron,villagers sp,sw,ax,sc,lc,hc,ra,ca BMinQ-BMaxQ,SMinQ-SMaxQ,WMinQ-WMaxQ
	
	
	function myErrorSuppressor(){return true;}
	window.onerror=myErrorSuppressor;
	
	pre release testing... 26/10/2008
	only on non archer worlds...
	
	chrome: OK :) - v.fast
	opera : OK :| - fast - all < 3s - input boxes are a bit small
	firefox:  OK :) - slow - all < 11s - may be firebug / my config Addblock plus etc etc after disabling them all... 9.949 Finished
	ie: 	OK :) - slow 8.5s - there was a small bug can't focus on a disabled control - fixed...
	*/
	var eleDoc=document;
	var strImgDir='http://legion.problemsolver.co.uk/SlowTarget/graphic/';
	if(window.frames.length>0){eleDoc=window.main.document;}
	eleDoc.getElementsByTagName('h2')[0].childNodes[0].nodeValue='SlowTarget\'s Mass-Recruitment '+strVersion;
	var idx1;
	var arrConfigQueue=[[24,96],[24,48],[24,48]];
	var arrDefaultQueue=[[24,96],[24,96],[24,96]];
	var arrTotalQueue;
	var objInfoRow;
	var arrQueue;
	var arrRemaining;
	var arrResources;
	var strString;
	var arrTotal;
	var numFactor;
	var arrFactors;
	var objTable,objRow,objCell;
	var arrAddRecruits,arrAddResources,arrAddQueue;
	var arrTheConfiguration;
	var arrNewRecruits;
	var arrRecruits;
	var arrTheReserve;
	var arrProduced=[];
	var arrQueued=[];
	var arrMaxValue=[];
	var objDate = new Date();
	var intStartTime=objDate.getTime();
	var blArchers;
	var intSpeed;
	var intRow;
	var idxGroup;
	var arrQueueImg=['barracks','stable','garage'];
	var arrQueueName=['barracks','stable','workshop'];
	var arrCurrentQueue,arrNewQueue;
	function fnStatus(strMessage){
/*		if(typeof(blDebug)!="undefined"&&blDebug){*/
			try{
				eleDoc.body.appendChild(eleDoc.createTextNode(strMessage));
				eleDoc.body.appendChild(eleDoc.createElement('br'));
			}
			catch(objError){
				alert(strMessage+"\n"+objError);
			}
/*		}*/
	}
	
	function myGetGroup(){
		try{return myInt(eleDoc.URL.match(/\group=(\d+)/)[1]);}
		catch(objError){return 0;}
	}
	function myCreateCookie(idxGroup){
		var strName="TWMassRecruit_"+idxGroup;
		var exdate=new Date();
		exdate.setDate(exdate.getDate()+365);
		var arrTempConfig=arrUnits.map(function(){return 0;});
		arrTheConfiguration.forEach(function(arrUnit){arrTempConfig[arrUnit[0]]=arrUnit[1];});
		fnStatus("Queeue to write : "+arrConfigQueue);
		var arrCookie=[];
		arrCookie[0]=arrTheReserve.join(',');
		arrCookie[1]=arrTempConfig.join(',');
		arrCookie[2]=arrConfigQueue.map(function(arrQueueVals){return arrQueueVals.map(function(intQueue){return Math.floor(intQueue/(1000*60*60));}).join('-');}).join(',');
		strCookie=arrCookie.join(' ');
		eleDoc.cookie=strName+"="+strCookie+";expires="+exdate.toGMTString();
		fnStatus("Cookie written : "+strCookie);
		return true;
	}
	function myReadCookie(idxGroup){
		var strName="TWMassRecruit_"+idxGroup;
		if (eleDoc.cookie.length>0)
		{
			intStart=eleDoc.cookie.indexOf(strName + "=");
			if (intStart!=-1)
			{
				intStart=intStart + strName.length+1;
				intEnd=eleDoc.cookie.indexOf(";",intStart);
				intEnd=(intEnd==-1)?eleDoc.cookie.length:intEnd;
				fnStatus("Cookie read   : "+unescape(eleDoc.cookie.substring(intStart,intEnd)));
				return unescape(eleDoc.cookie.substring(intStart,intEnd));
			}
		}
		
		
		return "";
	}
	function myGetCookie(idxGroup){
		var strCookie=myReadCookie(idxGroup);
		if(strCookie.length==0){
			arrTheReserve=[0,0,0,0];
			arrConfigQueue=arrDefaultQueue;
			arrTheConfiguration=arrUnits.map(function(){return 0;});
			return false;
		}
		var arrCookie=strCookie.split(' ');
		arrTheReserve=arrCookie[0].split(',');
		arrTheConfiguration=arrCookie[1].split(',');
		arrConfigQueue=arrCookie[2].split(',').map(function(strQueueVals){return strQueueVals.split('-');});
		return true;
	}
	function myGetConfig(){
		var blConfig=true;
		idxGroup=myGetGroup();
		if(myGetCookie(idxGroup)){
		}else{
			myError('No configuration found for group: '+strGroup+'\nEnter your config and then click the link again.');
			blConfig=false;
		}
		arrTheConfiguration=arrTheConfiguration.map(
			function(intUnits,idxUnit,arrParam){
				return [idxUnit,intUnits];
			}
		);
		arrTheConfiguration=arrTheConfiguration.filter(function(arrUnit,idx1,arrParam){return arrUnit[1]>0;});
		if(blConfig&&arrTheConfiguration.length==0){
			myError('All values are zero for group: '+strGroup);
			blConfig=false;
		}
		fnStatus("Cookie queue (hrs) : "+arrConfigQueue);
		arrConfigQueue=arrConfigQueue.map(
		function(arrQueueVals,idx1){
			if((myInt(arrQueueVals[0])+1)>myInt(arrQueueVals[1]))arrQueueVals[1]=(myInt(arrQueueVals[0])+1);
			return arrQueueVals.map(function(intHours){return myInt(intHours)*(60*60*1000);});
		});
		fnStatus("Cookie queue (ms) : "+arrConfigQueue);
		myCreateCookie(idxGroup);
		return blConfig;
	}
	function myConfigRow(){
		intRow=1;
		if($chk(gid('MRconfig'))){
			var objInfoRow=gid('MRconfig');	
			objTable.deleteRow(objInfoRow.rowIndex);
		}
		var arrInfoRows=eleDoc.getElementsByClassName
		var objInfoRow=objTable.insertRow(intRow);
		objInfoRow.id='MRconfig';
		objInfoRow.className='nowrap info row_a';
		var objCell0=objInfoRow.insertCell(0);
		var objCell1=objInfoRow.insertCell(1);
		var objCell2=objInfoRow.insertCell(2);
		var objImg;
		var objBold=objCell0.appendChild(eleDoc.createElement('b'));
		myText(objBold,strGroup);
		arrQueue=arrConfigQueue;
		arrQueue.forEach(
		function(arrQueueVals,idxQueue,arrParam){
			objCell0.appendChild(eleDoc.createElement('br'));
			myQueueImg(objCell0,idxQueue,' queue length target (min - max) (hours)');
			myInput(objCell0,Math.floor(arrQueueVals[0]/(1000*60*60)),'arrInputQueue['+idxQueue+'][0]',2);
			myText(objCell0,' - ');
			myInput(objCell0,Math.floor(arrQueueVals[1]/(1000*60*60)),'arrInputQueue['+idxQueue+'][1]',2);
		});
		var objBold=objCell1.appendChild(eleDoc.createElement('b'));
		myText(objBold,'Reserve:');
		arrTheReserve.slice(0,3).forEach(
		function(intResource,idx1,arrParam){
			objCell1.appendChild(eleDoc.createElement('br'));
			myResource(objCell1,idx1,' reserve',intResource,true);
		});
		arrUnits.forEach(
		function(arrUnit,idx1,arrParam){
			objCell=objInfoRow.insertCell(3+idx1);
			myInput(objCell,0,'arrInputUnits['+idx1+']',2);
		});
		arrTheConfiguration.forEach(
			function(arrUnit,idx1,arrParam){
				var idxUnit=arrUnit[0];
				var idxQueue=arrUnits[idxUnit][4];
				var intTime=arrUnits[idxUnit][5];
				var intUnits=arrUnit[1];
				var intFarmSpace=intUnits*arrUnits[idxUnit][3];
				objCell=objInfoRow.cells[idxUnit+3];
				objCell.getElementsByTagName('input')[0].value=intUnits;
			}
		);
		myFarm(objCell2,'farm space reserve',arrTheReserve[3]*1000,true);
		myCostsRow();
		intRow=3;
		if($chk(gid('MRworld'))){
			var objInfoRow=gid('MRworld');	
			objTable.deleteRow(objInfoRow.rowIndex);
		}
		objInfoRow=objTable.insertRow(intRow);
		objInfoRow.id='MRworld';
		objInfoRow.className='nowrap info row_a';
		var objCell0=objInfoRow.insertCell(0);
		var objCell1=objInfoRow.insertCell(1);
		var objCell2=objInfoRow.insertCell(2);

		objBold=objCell0.appendChild(eleDoc.createElement('b'));
		myText(objBold,'World settings');
		objCell0.appendChild(eleDoc.createElement('br'));
		myText(objCell0,window.location.hostname);
		strSpeed=(intSpeed<1?'0':'')+(intSpeed*100);
		objCell1.style.backgroundColor='#020200';
		myImg(objCell1,'World Speed '+intSpeed,strImgDir+'speed/'+strSpeed+'.gif');
		myImg(objCell2,'Archer World?','/graphic/unit_big/archer'+((blArchers==0)?'_cross':'')+'.png');
		arrUnits.map(
		function(arrUnit,idx1,arrParam){
			objCell=objInfoRow.insertCell(3+idx1);
			arrUnit.slice(0,3).map(
				function(intResource,idx1,arrParam){
					if(idx1>0){objCell.appendChild(eleDoc.createElement('br'));}
					myResource(objCell,idx1,'',intResource);
				}
			);
			objCell.appendChild(eleDoc.createElement('br'));
			myFarm(objCell,'farm space',arrUnit[3],false);
			objCell.appendChild(eleDoc.createElement('br'));
			myQueueImg(objCell,arrUnit[4],' queue time');
			myText(objCell,myQueueFormat(arrUnit[5]*60));
		});
	}
	function myCostsRow(){
		if($chk(gid('MRcosts'))){
			var objInfoRow=gid('MRcosts');	
			objTable.deleteRow(objInfoRow.rowIndex);
		}
		intRow=2;
		objInfoRow=objTable.insertRow(intRow);
		objInfoRow.id='MRcosts';
		objInfoRow.className='nowrap info row_b';
		var objCell0=objInfoRow.insertCell(0);
		var objCell1=objInfoRow.insertCell(1);
		var objCell2=objInfoRow.insertCell(2);
		arrTotal=[0,0,0,0];
		arrTheConfiguration.forEach(myCosts);
		arrTotalQueue=arrConfigQueue.map(function(arrQueueVals){return 0;});
		arrTheConfiguration.forEach(myQueueCosts);
		objBold=objCell0.appendChild(eleDoc.createElement('b'));
		myText(objBold,'Total Costs');
		arrTotalQueue.forEach(
			function(intQueue,idxQueue,arrParam){
				objCell0.appendChild(eleDoc.createElement('br'));
				myQueueImg(objCell0,idxQueue,' queue total time for this config (hours)');
				myText(objCell0,myQueueFormat(intQueue));
			}
		);
		arrTotal.slice(0,3).forEach(
			function(intResource,idx1,arrParam){
				objCell1.appendChild(eleDoc.createElement('br'));
				myResource(objCell1,idx1,' total costs',intResource,false);
			}
		);

		myFarm(objCell2,'total farm space',arrTotal[3],false);
		arrUnits.forEach(function(arrUnit,idx1,arrParam){objInfoRow.insertCell(3+idx1);});
		arrTheConfiguration.forEach(
			function(arrUnit,idx1,arrParam){
				var idxUnit=arrUnit[0];
				var idxQueue=arrUnits[idxUnit][4];
				var intTime=arrUnits[idxUnit][5];
				var intUnits=arrUnit[1];
				var intFarmSpace=intUnits*arrUnits[idxUnit][3];
				var objCell=objInfoRow.cells[idxUnit+3];
				//alert($type(objCell)+' - '+$type(objInfoRow)+' - '+idxUnit+' - '+objInfoRow.cells.length);
				arrUnits[idxUnit].slice(0,3).map(
					function(intResource,idx1,arrParam){
						if(idx1>0){objCell.appendChild(eleDoc.createElement('br'));}
						myResource(objCell,idx1,'',intResource*intUnits);
					}
				);
				objCell.appendChild(eleDoc.createElement('br'));
				myFarm(objCell,'farm space',arrUnits[idxUnit][3]*intUnits,false);
				objCell.appendChild(eleDoc.createElement('br'));
				myQueueImg(objCell,idxQueue,' queue time');	
				myText(objCell,myQueueFormat(intTime*intUnits));	
			}
		);
	}
	function myQueueFormat(intMs){
		var intMins=Math.floor(intMs/(60*1000));
		var intHrs=Math.floor(intMins/60);
		intMins=Math.floor(intMins%60);
		return (intHrs<10?'0':'')+intHrs+':'+(intMins<10?'0':'')+intMins;
	}
	function myText(objRef,strText){
		var objText=eleDoc.createTextNode(strText);
		objRef.appendChild(objText);
		return objRef;
	}
	function myInputChange(objEvent){
/*		strMessage='Input changed:\n';
		strMessage+='Name:'+objEvent.target.name+'\n';
		strMessage+='Value:'+objEvent.target.value+'\n';
		for(i in objEvent){
			strMessage+='['+i+'] '+objEvent[i]+'\n';
		}
		alert(strMessage);*/
		var objInput;
		$try(function(){objInput=objEvent.target;},
			 function(){objInput=objEvent.srcElement;},
			 function(){objInput=event.srcElement;}
		);

		
		
		var strName=objInput.name;
		var intValue=myInt(objInput.value);
		objInput.value=intValue;
		
		var idxConfig;
		var strArrName=strName.match(/\w+/)[0];
		var arrIdx=strName.match(/\d+/g).map(myInt);
		if(strArrName=='arrInputQueue'){
			arrConfigQueue[arrIdx[0]][arrIdx[1]]=intValue*60*60*1000;
		}else{
			if(strArrName=='arrInputReserve'){
				if(arrIdx[0]==3){intValue=intValue/1000;}
				arrTheReserve[arrIdx[0]]=intValue;
			}else{
				if(strArrName=='arrInputUnits'){
					if(arrTheConfiguration.some(function(arrUnit,idx1){idxConfig=idx1;return arrIdx[0]==arrUnit[0];})){
						//existing config
						//alert('existing unit @'+idxConfig+'['+arrIdx[0]+'] '+arrTheConfiguration[idxConfig][1]+' => '+intValue);
						arrTheConfiguration[idxConfig][1]=intValue;
					}else{
						//new config
						idxConfig=arrTheConfiguration.length;
						arrTheConfiguration[idxConfig]=[arrIdx[0],intValue];
						//alert('new unit ['+idxConfig+'][0]=['+myInt(arrIdx[0])+'] '+arrTheConfiguration[idxConfig][1]+' => '+intValue);
					}
				}else{
					alert(strArrName+ ' not recognised');
					return;
				}
			}
		}
		myCostsRow();
		myCreateCookie(idxGroup);	
	}
	function myInput(objRef,strText,strName,intSize){
		var objInput=eleDoc.createElement('input');
		objInput.value=strText;
		objInput.name=strName;
		objInput.size=intSize;
		objInput.style.textAlign='right';
		//objInput.onchange=myInputChange;
		//onchange=function(){myInputChange(this);}
		objInput.onchange=myInputChange;
		objRef.appendChild(objInput);
		return objInput;
	}
	function myImg(objCell,strMessage,strSrc){
		var objImg=eleDoc.createElement('img');
		objImg.src=strSrc;
		objImg.alt=strMessage;
		objImg.title=objImg.alt;
		return objCell.appendChild(objImg);
	}
	function myQueueImg(objCell,idxQueue,strMessage){
		return myImg(objCell,arrQueueName[idxQueue]+strMessage,'/graphic/buildings/'+arrQueueImg[idxQueue]+'.png');
	}
	function myResource(objCell,idxResource,strMessage,intResource,blInput){
		myImg(objCell,['wood','clay','iron'][idxResource]+strMessage,'/graphic/'+['holz','lehm','eisen'][idxResource]+'.png');
		if($chk(blInput)&&blInput){
			myInput(objCell,intResource,'arrInputReserve['+idxResource+']',2);
			myText(objCell,',000');
		}else{
			myText(objCell,intResource);
		}
	}
	function myFarm(objCell,strMessage,intFarmspace,blInput){
		myImg(objCell,strMessage,'/graphic/face.png');
		if($chk(blInput)&&blInput){
			myInput(objCell,intFarmspace,'arrInputReserve[3]',2);
		}else{
			myText(objCell,intFarmspace);
		}
	}
	function myElapsed(){
		objDate = new Date();
		return (objDate.getTime()-intStartTime)/1000;
	}
	function myLoadXMLString(txt) {
		try /*Internet Explorer*/
		{
			xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async="false";
			xmlDoc.loadXML(txt);
			return(xmlDoc);
		}
		catch(objError)
		{
			try /*Firefox, Mozilla, Opera, etc.*/
			{
				parser=new DOMParser();
				xmlDoc=parser.parseFromString(txt,"text/xml");
				return(xmlDoc);
			}
			catch(objError){alert(objError.message)}
		}
		return(null);
	}
	function myInt(varValue){varValue=parseInt(varValue,10);return isNaN(varValue)?0:varValue;}
	function myGetResources(){
		strString=typeof(objRow.cells[1].innerText)=='undefined'?objRow.cells[1].textContent:objRow.cells[1].innerText;
		arrResources=strString.match(/\b(\d+\.?\d*)\b/gim).map(function(varValue,idx1,arrParam){return 	myInt(varValue.replace(/\./,''));});
		var arrFarm=objRow.cells[2].childNodes[0].nodeValue.split('/');
		arrResources[3]=arrFarm[1]-arrFarm[0];
		return arrResources.map(function(varValue,idx1,arrParam){varValue=varValue-arrTheReserve[idx1]*1000;return varValue>0?varValue:0;});
	}
	function myGetUnitNumbers(arrUnit,idx1,arrParam){
		var idxUnit=arrUnit[0];
		var intUnits=arrUnit[1];
		var idxQueue=arrUnits[idxUnit][4];
		objCell=objRow.cells[idxUnit+3];
		var intTime=arrUnits[idxUnit][5];
		var regPatt=new RegExp("\\((\\d+)\\)"),arrResult=[];
		try{arrQueued[idxUnit]=myInt(objCell.getElementsByTagName('img')[0].title);}
		catch(objError){arrQueued[idxUnit]=0;}
		arrCurrentQueue[idxQueue]+=arrQueued[idxUnit]*intTime;
		try{arrMaxValue[idxUnit]=myInt(objCell.getElementsByTagName('a')[1].childNodes[0].nodeValue.replace(regPatt,'$1'));}
		catch(objError){arrMaxValue[idxUnit]=0;}
		try{arrProduced[idxUnit]=myInt(objCell.getElementsByTagName('a')[0].nextSibling.nodeValue);}
		catch(objError){arrProduced[idxUnit]=0;}
		intUnits=Math.max(intUnits-(arrQueued[idxUnit]+arrProduced[idxUnit]),0)
		return [idxUnit,intUnits,idxQueue];
	}
	function myCosts(arrUnit,idx3,arrParam){
		var idxUnit=arrUnit[0];
		var intUnits=arrUnit[1];
		arrTotal=arrTotal.map(function(numTotal,idx4,arrParam){return numTotal+intUnits*arrUnits[idxUnit][idx4];});
	}
	function myQueueCosts(arrUnit,idx3,arrParam){
		var idxUnit=arrUnit[0];
		var intUnits=arrUnit[1];
		var idxQueue=arrUnits[idxUnit][4];
		arrTotalQueue[idxQueue]+=intUnits*arrUnits[idxUnit][5];
	}
	function myRecruit(arrUnit,idx1,arrParam){
		var idxUnit=arrUnit[0];
		var intUnits=arrUnit[1];
		
		var objElement=objRow.cells[3+idxUnit].getElementsByTagName('input')[0];
		if($chk(objElement)&&!objElement.disabled&&objElement.value!=intUnits){
			objElement.focus();
			objElement.value=intUnits;
		}
	}
	function myAllocate(arrMyRecruits,intMaxMin){
		arrTotal=[0,0,0,0];
		arrMyRecruits.forEach(myCosts);
		arrTotalQueue=arrConfigQueue.map(function(arrQueueVals){return 0;});
		arrMyRecruits.forEach(myQueueCosts);
		/*each factor is the available resources divided by the cost of recruiting everything
		
		eg. 24 hours remaining ... 24 hours of sword & 24 hours of spear available to build
		    24/48 =0.5 ...
		    it'll multiply these up and try and recruit 1/2 the sword & 1/2 the spear...
		*/
		
		arrFactors=arrTotal.map(function(varValue,idx1,arrParam){return varValue==0?0:arrResources[idx1]*1.0/varValue;});
		arrQueueFactors=arrTotalQueue.map(function(varValue,idx1,arrParam){return varValue==0?1.0:arrQueue[idx1][intMaxMin]/varValue;});
		arrFactors.push(1.0);
		numFactor=Math.min.apply(Math,arrFactors.concat(arrQueueFactors));
		if(numFactor>0){
			return arrMyRecruits.map(
				function(arrUnit,idx1,arrParam){
					intUnits=arrUnit[1]>0?myInt(arrUnit[1]*numFactor):0;
					if(intUnits>0){blWorking=true;}
					return [arrUnit[0],intUnits];
				}
			);
		}
		return [];
	}
	function mySpendResources(arrAdd){
		arrAdd.forEach(
		function(arrUnit,idx1,arrParam){
			var idxUnit=arrUnit[0];
			var idxQueue=arrUnits[idxUnit][4];
			var intTime=arrUnits[idxUnit][5];
			var intUnits=arrUnit[1];
			if(!arrRemaining.some(function(arrTUnit,idx2,arrParam){idxTotal=idx2;return (arrTUnit[0]==idxUnit);})){
				alert('Something bad has happened! mySpendResources 295');
			}else{
				arrRemaining[idxTotal][1]-=intUnits;
			}
			arrQueue[idxQueue]=arrQueue[idxQueue].map(
				function(intQueue,idx2,arrParam){
					intQueue=intQueue-intUnits*intTime;
					return intQueue>0?intQueue:0;
				}
			);
			arrResources=arrResources.map(
				function(intResource,idx2,arrParam){
					intResource=intResource-intUnits*arrUnits[idxUnit][idx2];
					return intResource>0?intResource:0;
				}
			);

			if(!arrNewRecruits.some(function(arrTUnit,idx2,arrParam){idxTotal=idx2;return (arrTUnit[0]==idxUnit);})){
				alert('Something bad has happened! mySpendResources 316');
			}else{
				arrNewRecruits[idxTotal][1]+=intUnits;
			}
		}
		);
	}
	function myRecruitsAlert(arrThis,strMessage){
		if(typeof(blDebug)=='undefined'){return;}
		intInfoRow++;
		var objInfoRow=objTable.insertRow(intInfoRow);
		var objImg;
		objInfoRow.className='info';
		var objCell=objInfoRow.insertCell(0);
		var objBold=objCell.appendChild(eleDoc.createElement('b'));
		myText(objBold,strMessage);
		arrQueue.forEach(
			function(arrQueueVals,idxQueue,arrParam){
				objCell.appendChild(eleDoc.createElement('br'));
				myQueueImg(objCell,idxQueue,' queue time remaining (min - max)');
				myText(objCell,myQueueFormat(arrQueueVals[0])+' - '+myQueueFormat(arrQueueVals[1]));
			}
		);
		objCell=objInfoRow.insertCell(1);
		arrResources.slice(0,3).map(
			function(intResource,idx1,arrParam){
				if(idx1>0){objCell.appendChild(eleDoc.createElement('br'));}
				myResource(objCell,idx1,' remaining after reserves and recruits so far',intResource)
			}
		);
		var objCell2=objInfoRow.insertCell(2);
		var intTotal=0;
		arrUnits.map(
			function(arrUnit,idx1,arrParam){
				objCell=objInfoRow.insertCell(3+idx1);
			}
		);
		arrThis.forEach(
			function(arrUnit,idx1,arrParam){
				var idxUnit=arrUnit[0];
				var idxQueue=arrUnit[2];
				var intTime=arrUnits[idxUnit][5];
				var intUnits=arrUnit[1];
				objCell=objInfoRow.cells[idxUnit+3];
				myText(objCell,intUnits);
				intTotal+=intUnits*arrUnits[idxUnit][3];
			}
		);
		myFarm(objCell2,'total recruits/farm space',intTotal+'/'+arrResources[3],false);

	}
	function myError(strMessage){
		fnStatus(strMessage);
		alert(strMessage);
		return;
	}
	function myAddRecruitsAlert(arrThis,strMessage){
		if(typeof(blDebug)=='undefined'){return;}
		intInfoRow++;
		var objInfoRow=objTable.insertRow(intInfoRow);
		var objImg;
		objInfoRow.className='info';
		var objCell=objInfoRow.insertCell(0);
		var objBold=objCell.appendChild(eleDoc.createElement('b'));
		myText(objBold,strMessage);
		arrTotal=[0,0,0,0];
		arrThis.forEach(myCosts);
		objCell=objInfoRow.insertCell(1);
		arrTotal.slice(0,3).map(
			function(intResource,idx1,arrParam){
				if(idx1>0){objCell.appendChild(eleDoc.createElement('br'));}
				myResource(objCell,idx1,' for recruits',intResource)
			}
		);
		var objCell2=objInfoRow.insertCell(2);
		arrUnits.map(
			function(arrUnit,idx1,arrParam){
				objCell=objInfoRow.insertCell(3+idx1);
			}
		);
		arrThis.forEach(
			function(arrUnit,idx1,arrParam){
				var idxUnit=arrUnit[0];
				var idxQueue=arrUnit[2];
				var intTime=arrUnits[idxUnit][5];
				var intUnits=arrUnit[1];
				myText(objInfoRow.cells[idxUnit+3],intUnits);
			}
		);
		myFarm(objCell2,'recruits farm space',arrTotal[3]);
	}
	function myReadRow(objRow){
		arrResources=myGetResources();
		arrQueue=arrConfigQueue.slice(0,3);
		arrCurrentQueue=[0,0,0];
		arrNewQueue=[0,0,0];
		arrRemaining=arrTheConfiguration.map(myGetUnitNumbers);
		arrQueue=arrQueue.map(
			function(arrQueueVals,idxQueue,param){
				return arrQueueVals.map(
					function(intQueue,idx2,arrParam){
						intQueue=intQueue-arrCurrentQueue[idxQueue];
						return intQueue>0?intQueue:0;
					}
				);
			}
		);
	}
	function myWriteQueueTimes(){
		var blQueue=false;
		arrCurrentQueue.forEach(
			function(intMs,idxQueue,arrParam){
				if(intMs>0){
					blQueue=true;
					objCell=objRow.cells[0];
					objCell.appendChild(eleDoc.createElement('br'));
					myQueueImg(objCell,idxQueue,' current queue');
					myText(objCell,myQueueFormat(intMs));
				}
			}
		);
		return blQueue;
	}
	function myMaxRecruits(idxMaxMin){
		return arrRemaining.map(
			function(arrUnit,idx1,arrParam){
				var idxUnit=arrUnit[0];
				var intUnits=arrUnit[1];
				var idxQueue=arrUnit[2];
				var intTime=arrUnits[idxUnit][5];
	
				var arrMaxUnits=arrUnits[idxUnit].slice(0,4).map(
					function(intResource,idxResource,arrParam){
						return Math.floor(arrResources[idxResource]/intResource);
					}
				);
	
				arrMaxUnits.push(intUnits);
	
				arrMaxUnits.push(arrMaxValue[idxUnit]);
	
				arrMaxUnits.push(Math.floor(arrQueue[idxQueue][idxMaxMin]/intTime));
				intUnits=Math.min.apply(Math,arrMaxUnits);
				return [idxUnit,intUnits,idxQueue];
			}
		);
	}
	function myAddRecruits(arrTotal,arrAdd){
		var idxTotal;
		arrAdd.forEach(
			function(arrUnit,idx1,arrParam){
				var idxUnit=arrUnit[0];
				var intUnits=arrUnit[1];
				if(!arrTotal.some(function(arrTUnit,idx2,arrParam){idxTotal=idx2;return (arrTUnit[0]==idxUnit);})){
					alert('Something bad has happened! myAddRecruits 504');
				}else{
					arrTotal[idxTotal][1]+=intUnits;
				}
			}
		);
		return arrTotal;
	}
	function myRow(objRow){
		if(objRow.className=='info'){return;}
		intStart=intRow;
		myReadRow(objRow);
		var blKeep=myWriteQueueTimes();
		if(Math.min.apply(Math,arrResources)==0){
			if(!blKeep&&arrResources[3]==0){
				objTable.deleteRow(intRow);
			}
			return;
		}
		arrRecruits=myMaxRecruits(0);
		intInfoRow=intRow;
		myRecruitsAlert(arrRecruits,'Min all');
		arrNewRecruits=arrRemaining.map(function(arrUnit,idx1,arrParam){return [arrUnit[0],0];});
		arrQueue.forEach(
			function(varValue,idxQueue,arrParam){
				var blWorking=true;
				var intLoop=0;
				while (blWorking){
					blWorking=false;
					intLoop++;
					if(arrQueue[idxQueue][0]>0){
						var arrThisQRecruits=myMaxRecruits(0).filter(
							function(arrUnit,idx1,arrParam){
								return arrUnit[2]==idxQueue&&arrUnit[1]>0;
							}
						);
						if(arrThisQRecruits.length>0){
							myRecruitsAlert(arrThisQRecruits,'Min Queue : '+idxQueue);
							arrAddRecruits=myAllocate(arrThisQRecruits,0);
							if(arrAddRecruits.length>0){
								mySpendResources(arrAddRecruits);
								myAddRecruitsAlert(arrAddRecruits,'Min Queue: '+idxQueue +' Loop: '+intLoop);
							}
						}
					}
				}
			}
		);
		var blWorking=true;
		var intLoop=0;
		while (blWorking){
			blWorking=false;
			intLoop++;
			arrRecruits=myMaxRecruits(1);
			if(arrRecruits.some(function(arrUnit,idx1,arrParam){return arrUnit[1]>0})){
				myRecruitsAlert(arrRecruits,'Max Queue, Loop: '+intLoop);
				arrAddRecruits=myAllocate(arrRecruits,1);
				if(arrAddRecruits.length>0){
					mySpendResources(arrAddRecruits);
					myAddRecruitsAlert(arrAddRecruits,'Max Queue, Loop: '+intLoop);
				}
			}
		}
		arrRecruits=myMaxRecruits(1);
		myRecruitsAlert(arrRecruits,'remainder');
		if(arrRecruits.some(function(arrUnit,idx1,arrParam){numFactor=idx1;return arrUnit[1]>0;})){
			arrAddRecruits=[arrRecruits[numFactor]];
			mySpendResources(arrAddRecruits);
			myAddRecruitsAlert(arrAddRecruits,'remainder');
		}
		myAddRecruitsAlert(arrNewRecruits,'total');
		arrNewRecruits.map(myRecruit);
	}
	var xmlDoc=myLoadXMLString(xmlConfig);
	blArchers=xmlDoc.getElementsByTagName('archer')[0].childNodes[0].nodeValue;
	intSpeed=xmlDoc.getElementsByTagName('speed')[0].childNodes[0].nodeValue;
	var arrUnits= [[50,30,10,1,0,158440],[30,30,70,1,0,233000],[60,30,40,1,0,205038],[100,30,60,1,0,279599],[50,50,20,2,1,187084],[125,100,250,4,1,374168],[250,100,150,5,1,561248],[200,150,600,6,1,748332],[300,200,200,5,2,2392000],[320,400,100,8,2,3588000]];
	if(blArchers==0){
		arrUnits.splice(6,1);
		arrUnits.splice(3,1);
	}
	arrUnits.forEach(function(arrUnit,idx1,arrParam){arrUnits[idx1][5]=arrUnit[5]/intSpeed;});
	var blFound=false;
	var arrTables=eleDoc.getElementsByTagName('table');
	for(intTable=0;intTable<arrTables.length;intTable++){
		if(arrTables[intTable].className=='vis'&&arrTables[intTable].rows[0].cells[0].innerHTML==strVillage){
			objTable=arrTables[intTable];
			blFound=true;
			break;
		}
	}
	if(!blFound){return;}
	var intStart=0;
	var intRow=0;
	fnStatus('Started');
	var strGroup=arrTables[intTable-2].rows[0].cells[0].innerHTML.match(/[>|&gt;]([^>;]+?)&lt;/)[1];
	var arrTheConfiguration=null;
	var blConfig=myGetConfig();
	myConfigRow();
	if(!blConfig)return;
	fnStatus('Config OK');
	
	intStart=intRow;
	for(intRow=arrTables[intTable].rows.length-1;intRow>0;intRow--){
		var objRow=arrTables[intTable].rows[intRow];
		if(objRow.className.indexOf('info')==-1){
			myRow(objRow);
		}
	}
	
	fnStatus('Finished');
	return;
}