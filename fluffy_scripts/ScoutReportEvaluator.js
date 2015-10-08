function fnScoutReportEvaluator(blSameAsReport,intMinResource,intMaxDuration,intUseSpeed,blRemoveArchers,intWallforRamRemoval){
    var strVersion="2.21";
    var arrLanguage=['Level','Sent','Defender:','Resources scouted:','Attacker:'];
    var arrBuildings=['Timber camp','Clay pit','Iron mine','Warehouse','Hiding place','Wall'];
    try {var arrLang=location.hostname.split('.');
         var strLang=arrLang.pop();
         var strLang2=arrLang.pop();
         if(strLang=='se'){
            var arrLanguage = ['Niv.', 'Skickat', 'F.rsvarare:', 'Resurser spejade:', 'Anfallare:'];
            var arrBuildings=['S.gverk','Lergrop','J.rngruva','F.rr.d','G.mst.lle','Mur'];             
         }else if(strLang=='gr'){
            var arrLanguage=['???????','???????????','???? ???????:','???????????? ?????:','????????????:'];
            var arrBuildings=['??????????','????????','???? ?????????','???????','??????? ?','??????'];
        }else if(strLang=='pl'){
             var arrLanguage=['Level','Sent','Defender:','Resources scouted:','Attacker:'];
            var arrBuildings=['Timber camp','Clay pit','Iron mine','WareHouse','Hiding Place','Wall'];
         }else if(strLang=='net'&&strLang2=='plemena'){
            var arrLanguage=['Nivo',"Poslato","Odbranioc:","Izvi?eni resursi:",'Napada?:'];
            var arrBuildings=['Drvosje?e','Glinokop','Rudnik ?eljeza','Skladi?te','Skloni?te','Zid'];
			
            var arrLanguage=['Nivo',"Poslato","Odbranioc:","Izvi.eni resursi:",'Napada.:'];
            var arrBuildings=['Drvosje.e','Glinokop','Rudnik .eljeza','Skladi.te','Skloni.te','Zid'];
         }else if(strLang=='net'&&strLang2=='perangkaum'){
			var arrLanguage=['Tingkat','Terkirim','Pihak bertahan:','Sumber daya alam yang diintai:','Penyerang:'];
			var arrBuildings=['Penebang pohon','Galian tanah liat','Tambang bijih besi','Gudang','Tempat rahasia','Tembok'];
         }else if(strLang=='nl'){
			var arrLanguage=['Level','Verzonden','Verdediger:','Ontdekte grondstoffen:','Aanvaller:'];
			var arrBuildings=['Houthakkers','Leemgroeve','IJzermijn','Opslagplaats','Schuilplaats','Muur'];
        }else if(strLang=='ro'){
             var arrLanguage=['nivelul','Expediat','Ap?r?tor:','Resurse spionate:','Agresor:'];
            var arrBuildings=['T?ietori de lemne','Mina de argil?','Mina de fier','Magazie','Ascunz?toare','Zid'];
            
            var arrLanguage=['nivelul','Expediat','Ap.r.tor:','Resurse spionate:','Agresor:'];
            var arrBuildings=['T.ietori de lemne','Mina de argil.','Mina de fier','Magazie','Ascunz.toare','Zid'];
        }else if(strLang=='de'){
            var arrLanguage=['Stufe','Gesendet','Verteidiger:','Ersp.hte Rohstoffe:','Angreifer:'];
            var arrBuildings=['Holzf.ller','Lehmgrube','Eisenmine','Speicher',' Versteck','Wall'];
        }else if(strLang=='fr'){
            var arrLanguage=['Niveau','Envoy?','D?fenseur:','Ressources espionn?es:','Attaquant:'];
            var arrBuildings=['Camp de bois','Carri?re d\'argile','Mine de fer','Entrep?t','Cachette','Muraille'];

            var arrLanguage=['Niveau','Envoy.','D.fenseur:','Ressources espionn.es:','Attaquant:'];
            var arrBuildings=['Camp de bois','Carri.re d.argile','Mine de fer','Entrep.t','Cachette','Muraille'];
        }else if(strLang=='no'){
            var arrLanguage=['Niv�','Sendt','Forsvarer:','Speidede ressurser:','Angriper:'];
            var arrBuildings=['T�mmerhogger','Leirgrav','Jerngruve','Varehus','Skjulested','Mur'];

            var arrLanguage=['Niv.','Sendt','Forsvarer:','Speidede ressurser:','Angriper:'];
            var arrBuildings=['T.mmerhogger','Leirgrav','Jerngruve','Varehus','Skjulested','Mur'];
        }else if(strLang=='tk'){
            var arrLanguage=['Bina','G�nderildi','Savunan:','G�zlemlenen kaynaklar:','Saldiran:'];
            var arrBuildings=['Oduncu','Kil ocagi','Demir Madeni','Depo','Gizli depo','Duvar'];
            
            var arrLanguage=['Bina','G.nderildi','Savunan:','G.zlemlenen kaynaklar:','Sald.ran:'];
            var arrBuildings=['Oduncu','Kil oca.i','Demir Madeni','Depo','Gizli depo','Duvar'];
        }else if(strLang=='es'){
            var arrLanguage=['Nivel','Enviado','Defensor:','Recursos Espiados:','Atacante:'];
            var arrBuildings=['Le�ador','Barrera','Mina de hierro','Almac�n','Escondrijo','Muralla'];
            
            var arrLanguage=['Nivel','Enviado','Defensor:','Recursos Espiados:','Atacante:'];
            var arrBuildings=['Le.ador','Barrera','Mina de hierro','Almac.n','Escondrijo','Muralla'];
        }else if(strLang=='it'){
			var arrLanguage=['Livello','Inviato','Difensore:','Risorse spiate:','Attaccante:'];
			var arrBuildings=['Taglialegna','Pozzo di argilla','Miniera di ferro','Magazzino','Nascondiglio','Mura'];
		}else if(strLang=='hr'){
			var arrLanguage=['Razina','Poslano','Branitelj:','Uočene sirovine:','Napadači:'];
			var arrBuildings=['Drvosječa','Glinokop','Rudnik ߥljeza','Skladi۴e','Skrovi۴e','Zid'];

			var arrLanguage=['Razina','Poslano','Branitelj:','Uo.ene sirovine:','Napada.i:'];
			var arrBuildings=['Drvosje.a','Glinokop','Rudnik .eljeza','Skladi.te','Skrovi.te','Zid'];
		}else if(strLang=='ae'){
			var arrLanguage=['المستوى','تم الارسال','المدافع:','الموارد:','المهاجم:'];
			var arrBuildings=['الخشاب','حفرة الطمي','منجم الحديد','المخازن','الحائط','المخابئ'];
		}else if(strLang=='dk'){
			var arrLanguage=['Trin','Sendt','Forsvarende:','Råstoffer spioneret:','Angriber:'];
			var arrBuildings=['Skovhugger','Lergrav','Jernmine','Lager','Gemmested','Mur']; 

			var arrLanguage=['Trin','Sendt','Forsvarende:','R.stoffer spioneret:','Angriber:'];
			var arrBuildings=['Skovhugger','Lergrav','Jernmine','Lager','Gemmested','Mur']; 
		}else if(strLang=='br' || strLang=='pt'){
			var arrLanguage=['Nível','Enviada em','Defensor:','Recursos descobertos:','Atacante:'];
			var arrBuildings=['Bosque','Poço de Argila','Mina de Ferro','Armazém','Esconderijo','Muralha'];

			var arrLanguage=['N.vel','Enviada em','Defensor:','Recursos descobertos:','Atacante:'];
			var arrBuildings=['Bosque','Po.o de Argila','Mina de Ferro','Armaz.m','Esconderijo','Muralha'];
			}
    }	
    catch(objError){}
    var blDebug=true;

    var intMaxToHaul=400000;
    
    function fnSum(arr){
        var intSum=0;
        for(idxSum=0;idxSum<arr.length;idxSum++){
            intSum+=arr[idxSum];
        }
        return intSum;
    }
    function fnRegExp(strText){return new RegExp(strText);}
    function fnGetInfo(strType){
        var oRequest=new XMLHttpRequest();
        var sURL="http://"+window.location.hostname+"/interface.php?func="+strType;
        oRequest.open("GET",sURL,0);
        oRequest.send(null);
        if(oRequest.status==200)return oRequest.responseXML;
        alert("Error executing XMLHttpRequest call to "+strType+"!");
    }
    function fnStatus(strMessage){
        if(typeof(blDebug)!="undefined"&&blDebug){
            try{
                eleDoc.body.appendChild(eleDoc.createTextNode(strMessage));
                eleDoc.body.appendChild(eleDoc.createElement('br'));
            }
            catch(objError){
                alert(strMessage+"\n"+objError);
            }
        }
    }
    function fnWarehouse(intLevel){return(intLevel==0)?1000:Math.round(1000*Math.pow(400,(intLevel-1)/29));}
    function fnProduction(intLevel){return(intLevel==0)?5*intWorldSpeed:Math.round(30*Math.pow(80,(intLevel-1)/29))*intWorldSpeed;}
    function fnHide(intLevel){return(intLevel==0)?0:Math.round(150*Math.pow(40/3,(intLevel-1)/9));}
    function fnCreateCookie(strName,strValue,intDays){
        if(intDays){
            var dtExpire = new Date();
            dtExpire.setTime(dtExpire.getTime()+(intDays*24*60*60*1000));
            var strExpire = ";expires="+dtExpire.toGMTString();
        }
        else{
            var strExpire="";
        }
        eleDoc.cookie=strName+"="+strValue+strExpire+";path=/";
        fnStatus('Cookie Created :'+strValue);
    }
    function fnReadCookie(strName){
        var arrMatch = eleDoc.cookie.split(';');
        for(var idx1=0;idx1<arrMatch.length;idx1++){
            var arrCookie=arrMatch[idx1].split("=");
            var strThisName=arrCookie[0].replace(/^\s+|\s+$/g,'');
            if(strThisName==strName){fnStatus('Cookie Read :'+strName+':'+arrCookie[1]);return arrCookie[1];}
        }
        return null;
    }
    function fnGetCoordinates(theString)
    {
        arrMatch=theString.match(/(.*?)\((\d+)\|(\d+)\).*?K(\d+)/);
        return [arrMatch[2],arrMatch[3]];
    }
    function fnGetLevel(strBuilding)
    {
        var regThis=new RegExp(strBuilding+".*?"+arrLanguage[0]+".*?(\\d+)");
        if(arrMatch=strDoc.match(regThis)){
            fnStatus('Level found :'+strBuilding+' : '+arrMatch[1]);
            return fnInt(arrMatch[1]);
        }else{
            fnStatus('Level not found! :'+strBuilding);
            return 0;
        }
    }
    function fnGetDistance(arrOrigin,arrTargetCoords){return Math.sqrt(Math.pow(arrOrigin[0]-arrTargetCoords[0],2)+Math.pow(arrOrigin[1]-arrTargetCoords[1],2));}
    function fnGetTable(strHeader){
        var arrThead,arrChildren;
        var arrTables=eleDoc.getElementsByTagName('table');
        for(var idx1=0;idx1<arrTables.length;idx1++){
            var arrThead=arrTables[idx1].getElementsByTagName('th');
            if(arrThead.length>0){
                arrChildren=arrThead[0].childNodes;
                if(arrChildren.length>0){
                    if((arrThead[0].firstChild.nodeValue).match(fnRegExp(strHeader))){
                        return arrTables[idx1];
                    }
                }
            }
        }
        fnStatus("Fatal Error : Could not find table with 1st cell :"+strHeader);
        return null;
    }
    function fnServerTime(){
        var arrDate=(eleDoc.getElementById('serverDate').firstChild.nodeValue+' '+eleDoc.getElementById('serverTime').firstChild.nodeValue).match(/\d+/g);
        return new Date(arrDate[2],arrDate[1]-1,arrDate[0],arrDate[3],arrDate[4],arrDate[5]);
    }
    function fnGetTimeOfReport()
    {
        var arrRows=eleDoc.getElementsByTagName('tr');
        for(idx1=0;idx1<arrRows.length;idx1++)
        {    var arrCells=arrRows[idx1].getElementsByTagName('td');
            if(arrCells[0])if(fnGetText(arrCells[0]).match(fnRegExp("^"+arrLanguage[1]+"$"))){
                var dtSent=fnStrDate(fnGetText(arrCells[1]));
                fnStatus('Sent Date found :'+fnGetText(arrCells[1])+' = '+dtSent);
                return dtSent.getTime();
            }
        }
        fnStatus('Fatal Error : Sent Date not found : No row with 1st cell :'+arrLanguage[1]);
    }
    function fnStrDate(txtDate){
        arrMs=txtDate.match(/\b(\d{3})$/i);
        if(arrMs)txtDate=txtDate.replace(/\b(.\d{3})$/i,'');
        if(txtDate.match(/\b([a-z]{3})\b/i)){
            var dtNew=new Date(txtDate);
            if(arrMs)dtNew.setMilliseconds(arrMs[1]);
            return dtNew;
        }
        var arrDate=txtDate.match(/\b(\d+)\b/ig);
        arrDate.push(0);arrDate.push(0);
        if(arrMs)arrDate[6]=fnInt(arrMs[1]);
        arrDate=arrDate.map(fnInt);
        if(arrDate[2]<2000)arrDate[2]+=2000;
        dtNew = new Date(arrDate[2],arrDate[1]-1,arrDate[0],arrDate[3],arrDate[4],arrDate[5],arrDate[6]);
        return dtNew;
    }
    function fnSameVillage(){
        strHREF=window.location.search;
        return strHREF.match(/\bvillage=(\d+)/)[1];
    }
    function fnGetVillageID(strName){
        var arrLinks=fnGetTable(strName).getElementsByTagName('a');
        strHREF=arrLinks[arrLinks.length-1].getAttribute('href');
        return strHREF.match(/\bid=(\d+)/)[1];
    }
    function fnScoutReport()
    {
		fnStatus("Begin parsing scout report...");
        var arrTargetCoords=fnGetCoordinates(fnGetText(fnGetTable(arrLanguage[2]).getElementsByTagName('tr')[1].getElementsByTagName('td')[1]));
        fnStatus("Target Coords: "+arrTargetCoords);
        arrBuildings=arrBuildings.map(fnGetLevel);
        var intWall=arrBuildings.pop();
        var intHide=arrBuildings.pop();
        var intWarehouse=arrBuildings.pop();
        
        if(fnSum(arrBuildings)==0){
            fnStatus("No building levels found :( - making some assumptions - mines 20 - warehouse 30 ...");
            intWarehouse=30;
            arrBuildings=[20,20,20];
        }
        
        arrProduction=arrBuildings.map(fnProduction);
        strResources=fnGetText(fnGetTable(arrLanguage[3]).rows[0].cells[1]);
        fnStatus("Resources scouted:"+strResources);
        arrMatch=strResources.match(/\s*((?:\d+\.)?\d+)\s+((?:\d+\.)?\d+)\s+((?:\d+\.)?\d+)/);
        if(!arrMatch)fnStatus("Could not match resources :( (probably cos there are less than 3 numbers...): "+strResources);
        fnStatus("Resources matched:"+arrMatch.join("|"));
        if(typeof(arrMatch)=='undefined'){
            arrResources=[0,0,0];
        }else{
            arrMatch.shift();
            arrResources=arrMatch.map(function(strResource){return fnInt(strResource.replace(".",""));});
        }
        fnStatus("Resources found:"+arrResources.join("|"));
        var arrCookie=[fnGetTimeOfReport()];
        arrCookie=arrCookie.concat(arrResources,[fnWarehouse(intWarehouse)-fnHide(intHide)],arrProduction,arrTargetCoords,blSameAsReport?1:0,intWall);
        var strNewCookie=arrCookie.join("|");
        
        if(strNewCookie==strOldCookie){
            fnStatus("Duplicate cookie - go to previous report");
            var eleLink=eleDoc.getElement('a:contains("<<")');
              if(eleLink==null) {
                  fnStatus("At first report - no previous report link found");
              } else {
                  fnStatus("Going to : "+eleLink.get('href'));
                window.location=eleLink.get('href');
              }
        }else{
            fnCreateCookie("booreporter",strNewCookie, 1);

            var strHREF=window.location.search;
            fnStatus("Location : "+strHREF+":"+typeof(strHREF));
            
            if(blSameAsReport){
                var intOriginID=fnGetVillageID(arrLanguage[4]);    
            }else{
                var intOriginID=fnSameVillage();    
            }
            strUrl="/game.php?village="+intOriginID+"&screen=place&mode=command&target="+fnGetVillageID(arrLanguage[2]);
            arrMatch=strHREF.match(/\bt=\d+/);
            if(arrMatch)strUrl=strUrl+"&"+arrMatch[0];
            fnStatus("Opening New Window... : "+strUrl);
            window.open(strUrl,'newwindow',config='toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,location=yes,directories=yes, status=yes');
        }
/*        alert('Window opened - tagging report...');
        eleDoc.getElementById('editInput').value+=' ?';
        eleDoc.getElementById('edit').getElementsByTagName('input')[1].click();
        
        <div style="color:red; font-size:large">You need to enter the x and y coordinates of the destination</div>
        
        a div for info messages*/
    }
    function fnMessage(strMessage,strStatus){
        fnStatus("Message :"+strStatus+": "+strMessage);
        try{
            var eleObj=eleDoc.units.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("H3")[0];
            fnStatus("Message : found h3 element : "+eleObj.nodeName);
            var eleNewDiv=eleDoc.createElement("DIV");
            fnStatus("Message : created DIV element : "+eleNewDiv.nodeName);
            eleNewDiv.className=strStatus;
            fnStatus("Message : DIV element class set : "+eleNewDiv.className);
            eleNewDiv.appendChild(eleDoc.createTextNode(strMessage));
            fnStatus("Message : Text Node appended to DIV : ");
            /*eleDoc.body.appendChild(eleDoc.createElement('br'));*/
            /*eleDoc.insertBefore(eleNewDiv,eleObj); - this gets an error [DOMException: name: Error message: HIERARCHY_REQUEST_ERR ] - need to use the father object...! :DOH:*/
            eleObj.parentNode.insertBefore(eleNewDiv,eleObj);
            fnStatus("Message : inserted DIV element");
        }
        catch(objError){
            fnStatus("Message : Error : "+objError);
            alert(strStatus+": "+strMessage);
        }
    }
    function fnAddCSS(){
        fnStatus("CSS rules");
    
        arrCSSs=[];
        arrCSSs.push(["div.error","color:red; font-size:large"]);
        arrCSSs.push(["div.warning","color:orange; font-size:large"]);
        arrCSSs.push(["div.info","color:green; font-size:large"]);

        eleCSS=eleDoc.styleSheets[0];
        function fnInsertRule(arrCSS,idx){
            eleCSS.insertRule(arrCSS[0]+"{"+arrCSS[1]+"}",idx);
            
        }
        function fnAddRule(arrCSS,idx){
            eleCSS.addRule(arrCSS[0],arrCSS[1],idx);
            
        }
        try{arrCSSs.forEach(fnInsertRule);
            fnStatus("CSS rules OK - not IE");
        }
        catch(objError){
            try{
                arrCSSs.forEach(fnAddRule);
                fnStatus("CSS rules OK - IE");
            }
            catch(objError){
                fnStatus("CSS rules BAD : "+objError);
            }
        }
    }
    function fnGetText(eleObj){return typeof(eleObj.innerText)=='undefined'?eleObj.textContent:eleObj.innerText;}
    function fnGetCurrentCoords()
    {    fnStatus('Getting current coords from :'+fnGetText(eleDoc.getElementById('menu_row2')));
        return fnGetCoordinates(fnGetText(eleDoc.getElementById('menu_row2')));
    }
    function fnInt(strNum){return parseInt(strNum,10);}
    function fnInsertUnit(strUnit,intLeave){
        var intMax,eleNext;
        var eleInput=eleDoc.units[strUnit];
        if(eleInput==null)return 0;
        eleNext=eleInput.nextSibling;
        do{eleNext=eleNext.nextSibling;}while(eleNext.nodeType!=1);
        intMax=fnInt(eleNext.firstChild.nodeValue.match(/(\d+)/)[1]);
        intUnit=(intLeave<0)?intLeave*-1:intMax-intLeave;
        if(intUnit>intMax)intUnit=intMax;
        eleInput.value=intUnit;
        return intUnit;
    }
    function fnRallyPoint()
    {
        var arrCookie=strOldCookie.split("|");
        fnStatus('Cookie Read:'+arrCookie.join("|"));
        
        arrCookie=arrCookie.map(fnInt);
        fnStatus('Cookie int :'+arrCookie.join("|"));
        
        var intElapsedMs=fnServerTime()-arrCookie.shift();
        fnStatus("Elapsed (hrs): "+intElapsedMs/(3600000));
        
        arrResources=arrCookie.splice(0,3);
        fnStatus("Resources : "+arrResources.join("|"));
        
        var intMaxResource=arrCookie.shift();
        fnStatus("intMaxResource : "+intMaxResource);
        
        arrProduction=arrCookie.splice(0,3);
        fnStatus("arrProduction : "+arrProduction.join("|"));
        
        arrTargetCoords=arrCookie.splice(0,2);
        fnStatus("arrTargetCoords : "+arrTargetCoords.join("|"));
        
        var blSameVillage=(arrCookie.shift()==1)?true:false;
        fnStatus("blSameVillage : "+blSameVillage);
        
        var intWall=arrCookie.shift();
        fnStatus("intWall : "+intWall);
        
        if(typeof(intWallforRamRemoval)=="undefined"){
            intWallforRamRemoval=10;
            fnStatus("intWallforRamRemoval not set - using default ");
        }
        if(intWallforRamRemoval==0){
            intWallforRamRemoval=21;
            fnStatus("intWallforRamRemoval = 0 == never remove walls");
        }
        fnStatus("intWallforRamRemoval : "+intWallforRamRemoval);
        
        
        if(typeof(intUseSpeed)=="undefined"){
            intUseSpeed=0;
            fnStatus("intUseSpeed not set - using default ");
        }
        intUseSpeed+=2; /*cludge fix - skip rams and nobles as well*/
        
        if(intWallforRamRemoval>intWall){
            var blRemoveWall=false;
        }else{
            var blRemoveWall=true;
        }
        
        var arrBash=[];
        arrBash.push(['ram',[2,4,7,10,14,19,24,30,37,46,55,65,77,91,107,124,144,166,195,220]]);
        arrBash.push(['catapult',[2,6,10,15,21,28,36,45,56,68,82,98,115,136,159,185, 215,248,286,328]]);
        var intRequired,strName,arrWallMessage=[];
        if(blRemoveWall){
            for(idx1=0;idx1<arrBash.length;idx1++){
                arrWallMessage.push(arrBash[idx1][1][intWall-1]+" "+arrBash[idx1][0]+"s");
            }
        }
        
        fnAddCSS();
            
        if(!(arrTargetCoords[0]==fnInt(eleDoc.units['x'].value)&&arrTargetCoords[1]==fnInt(eleDoc.units['y'].value))){
            fnMessage("You have switched targets since last using this script. Unable to compute units needed.","error");
            return;
        }
        
        if(typeof(blRemoveArchers)=="undefined"){
            fnStatus("blRemoveArchers not set - using default ");
            blRemoveArchers=false;
        }
        fnStatus("blRemoveArchers : "+blRemoveArchers);
        

        var xmlDoc=fnGetInfo("get_unit_info");
        var eleConfig=xmlDoc.getElementsByTagName('config')[0];
        var arrUnit=[],eleUnit,intCarry,dblSpeed,intAttack,strName,intNum,idx2,blFound;
        /*unit id,#,speed,carry,attack*/
        var arrSpeed=[];
        var arrCarry=[];
        for(idx1=0;idx1<eleConfig.childNodes.length;idx1++){
            eleUnit=eleConfig.childNodes[idx1];
            if(eleUnit.nodeType==1){
                /* grab the different speeds and sort them...*/
                
                /*fnStatus("eleUnit : "+typeof(eleUnit)+":"+eleUnit+":"+eleUnit.nodeName);
                for(i in eleUnit){
                 fnStatus(" eleUnit : "+i+":"+typeof(eleUnit[i])+":"+eleUnit[i]);
                }*/
                dblSpeed=eleUnit.getElementsByTagName('speed')[0].childNodes[0].nodeValue;
                intCarry=fnInt(eleUnit.getElementsByTagName('carry')[0].childNodes[0].nodeValue);
                
                    blFound=false;
                    for(idx3=0;idx3<arrSpeed.length;idx3++){
                        if(dblSpeed==arrSpeed[idx3]){
                            blFound=true;
                            break;
                        }
                    }
                    if(!blFound){
                        arrSpeed.push(dblSpeed);
                        arrCarry.push(0);
                    }
                
            }                
        }
        function fnSort(a,b){return b-a;}
        arrSpeed.sort(fnSort);

        idx2=0;
        for(idx1=0;idx1<eleConfig.childNodes.length;idx1++){
            eleUnit=eleConfig.childNodes[idx1];
            if(eleUnit.nodeType==1){
                intCarry=fnInt(eleUnit.getElementsByTagName('carry')[0].childNodes[0].nodeValue);
                dblSpeed=eleUnit.getElementsByTagName('speed')[0].childNodes[0].nodeValue;
                intAttack=fnInt(eleUnit.getElementsByTagName('attack')[0].childNodes[0].nodeValue);
                strName=eleUnit.nodeName;
                if(strName=="archer"&&blRemoveArchers){
                    intNum=0;
                }else{
                    intNum=fnInsertUnit(strName,0);
                }
                eleDoc.units[strName].value='';
                if(intNum>0){
                    arrUnit.push([strName,intNum,intCarry,dblSpeed,intAttack]);
                    fnStatus(" Unit "+idx2+" : "+arrUnit[idx2].join("|"));
                    idx2++;
                    if(intCarry>0){
                        for(idx3=0;idx3<arrSpeed.length;idx3++){
                            if(dblSpeed==arrSpeed[idx3]){
                                arrCarry[idx3]+=intNum*intCarry;
                                break;
                            }
                        }
                    }
                }
            }
        }
        
        /* we have populated 3 arrays with info for this rally point...
        arrUnit - unit stats - name,number,carry capacity, speed and attack for each unit
        arrSpeed - the different speeds that units travel at
        arrCarry - the total carrying capacity at each speed
        */
        
        var dblDistance=fnGetDistance(fnGetCurrentCoords(),arrTargetCoords);
        fnStatus("Current location: "+fnGetCurrentCoords().join("|"));
        fnStatus("Target location: "+arrTargetCoords.join("|"));
        fnStatus("Distance (fields): "+Math.round(dblDistance*100)/100);
        fnStatus('Max resource : '+intMaxResource);
        
    /* for each speed
        starting with the slowest with capacity > the minimum
        calculate the carry capacity required
    */

        var arrSpeedResources=[],arrSpeedResourcesTotal=[];
        for(idx1=0;idx1<arrSpeed.length;idx1++){
            arrResourcesT=[];
            
            intTotalElapsedMs=intElapsedMs+(arrSpeed[idx1]*60000*dblDistance);
            intElapsedHrs=intTotalElapsedMs/(60*60*1000);
            arrSpeedResources[idx1]=[];
            for(idx2=0;idx2<arrResources.length;idx2++){
                arrSpeedResources[idx1][idx2]=Math.min(arrResources[idx2]+Math.ceil(arrProduction[idx2]*intElapsedHrs),intMaxResource);
            }
            arrSpeedResourcesTotal[idx1]=fnSum(arrSpeedResources[idx1]);
            fnStatus("Speed (mins/field): "+(Math.round(arrSpeed[idx1]*100)/100)+' total duration (hrs):'+(Math.round(intElapsedHrs*100)/100)+', '+arrSpeedResourcesTotal[idx1]+' to collect');
        }
        /* allocate carrying of resources to available units... starting with the slowest...*/
        
        var dblFactor;
        blFound=false;
        for(idx2=intUseSpeed;idx2<arrSpeed.length;idx2++){
            if(arrCarry[idx2]>intMinResource&&(arrSpeed[idx2]*dblDistance)<intMaxDuration){
                /*OK this speed is chosen*/
                blFound=true;
                idx3=idx2;
                break;
            }
        }
        if(fnInsertUnit('spy',-1*intMinSpy)<intMinSpy)fnStatus("You should send scouts but you don't have any here!");
        if(!blFound){
            fnMessage("no troops found which match minimum carry capacity : "+intMinResource+" and/or Max duration "+intMaxDuration+" minutes","error");
            return;
        }
        var blWallRemoved=false,intAvailable,intMin;
        if(intWall>0){
            var strWall=arrBuildings[5];
            if(blRemoveWall){
                fnStatus("Wall Removal : Wall "+intWall+" >= "+intWallforRamRemoval+" Limit = Demolish");
            }else{
                fnMessage(strWall+" : "+intWall+" <  "+intWallforRamRemoval+" limit","info");
            }

            for(idx1=0;idx1<arrBash.length;idx1++){
                /*arrUnit.push([strName,intNum,intCarry,dblSpeed,intAttack]);*/
                for(idx2=0;idx2<arrUnit.length;idx2++){
                    if(arrUnit[idx2][0]==arrBash[idx1][0]){
                        intAvailable=arrUnit[idx2][1];/*number of units available*/
                        intRequired=arrBash[idx1][1][intWall-1];/*number of units needed*/
                        strName=arrUnit[idx2][0];
                        intMin=Math.ceil(intRequired/3);
                        arrBash[idx1].push(intAvailable);
                        arrBash[idx1].push(intRequired);
                        if(blRemoveWall){
                            if(intAvailable<intMin){
                                /*too few available to bother with*/
                                fnStatus("Wall Removal : Not enough "+strName+" to use");
                            }else{
                                fnInsertUnit(strName,-1*intRequired);
                                idx3=0;/*set speed to slowest*/
                                if(intAvailable<intRequired){
                                    fnStatus("Wall Removal : Not enough "+strName+" to completely destroy wall");
                                    /*need to calc a new intWall here - need formulae*/
                                    fnMessage(strWall+": "+intWall+" reduced "+Math.floor(intAvailable/intRequired*100)+"% "+strName+"s sent","info");
                                }else{
                                    fnMessage(strWall+": "+intWall+" levelled using "+strName+"s","info");
                                    blWallRemoved=true;
                                }
                            }
                        }
                        break;
                    }
                }
                if(blWallRemoved)break;
            }
            if(blRemoveWall&&idx3>0){
                fnMessage(strWall+" : "+intWall+" Ampy suggests sending "+arrWallMessage.join(" or "),"error");
            }
        }
        intCarry=arrSpeedResourcesTotal[idx3];
        var idxU;
        for(idx2=idx3;idx2<arrSpeed.length;idx2++){
            fnStatus("Speed : "+arrSpeed[idx2]);
            dblFactor=Math.min(intCarry/arrCarry[idx2],1);
            for(idxU=0;idxU<arrUnit.length;idxU++){
                /*arrUnit[idx2]=[strName,intNum,intCarry,dblSpeed,intAttack];*/
                if(arrUnit[idxU][3]==arrSpeed[idx2]&&arrUnit[idxU][2]>0){
                    intUnits=Math.ceil(dblFactor*arrUnit[idxU][1]);
                    if(intUnits>0){
                        intUnits=fnInsertUnit(arrUnit[idxU][0],-1*intUnits);
                        intCarry=intCarry-(intUnits*arrUnit[idxU][2]);
                        fnStatus(intUnits+' '+arrUnit[idxU][0]+'s inserted, collecting : '+(intUnits*arrUnit[idxU][2])+" To collect : "+intCarry);
                    }
                }
                if(intCarry<=50)break;
            }
        }
        if(intCarry>50){fnMessage("Not enough troops. You are only picking up "+Math.round((arrSpeedResourcesTotal[idx3]-intCarry)/arrSpeedResourcesTotal[idx3]*100)+"% - "+Math.ceil(intCarry/80)+" lc required","warning")};
        
    }
    var eleDoc=(window.frames.length>0)?window.main.document:document;
    var strDoc=fnGetText(eleDoc.body);
    
    var strUrl=eleDoc.URL;
    fnStatus('URL: '+strUrl);
    var xmlDoc=fnGetInfo("get_config");
    var intWorldSpeed=xmlDoc.getElementsByTagName('speed')[0].childNodes[0].nodeValue;
    var intSpy=xmlDoc.getElementsByTagName('spy')[0].childNodes[0].nodeValue;
    var intMinSpy=(intSpy==3)?5:1;
    var intUnitSpeed=xmlDoc.getElementsByTagName('unit_speed')[0].childNodes[0].nodeValue;
    fnStatus('World Speed: '+intWorldSpeed+' Unit speed: '+intUnitSpeed+' Scout type : '+intSpy+' Minimum scouts: '+intMinSpy);

    fnStatus("Version: "+strVersion);
	fnStatus("Browser: "+navigator.userAgent);
    fnStatus("Language  : '"+arrLanguage.join("','")+"'");
    fnStatus("Buildings : '"+arrBuildings.join("','")+"'");
    fnStatus("blDebug : "+typeof(blDebug)+ " : " + ((typeof(blDebug)=='undefined')?'':blDebug));
    
    var strOldCookie=fnReadCookie("booreporter");
    fnStatus('Cookie Read: '+strOldCookie);
    
    if(strUrl.search(/screen=report/)!=-1 && strUrl.search(/view/)!=-1){
        fnScoutReport();
    }else if(strUrl.search(/mode=command&target/)!=-1){
        fnRallyPoint();
    }else if(strUrl.search(/screen=place/)!=-1){
        fnStatus("Closing the window : "+window.close()+" : "+self.close());
        
        /* etc */
    }else if(strUrl.search(/screen=report/)!=-1){
        fnStatus("Checking empty reports");
        var intReports=0;
        eleTable=eleDoc.getElement("th:contains('Subject')").getParent("table");
        arrLinks=eleTable.getElementsByTagName('a');
        for(idx1=0;idx1<arrLinks.length;idx1++){
            if(arrLinks[idx1].innerHTML.match(/max_loot\/0.png/)){
                arrLinks[idx1].getParent('td').getElement('input').checked=true;
                intReports++;
            }
        }
        fnStatus("Checking empty reports: "+intReports+" checked");
    }
}