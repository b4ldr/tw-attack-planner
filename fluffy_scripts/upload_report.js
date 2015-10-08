	var root=(window.frames.length>0)?window.main:window;
	var objHeader = root.document.getElementsByTagName('h2')[0];

	var reportTable=getParent(getElement('th', 'Subject'), 'table');
	var string = getText(reportTable).replace(/#/g, '%5E');
	
	var attackerTable = root.document.getElementById('attack_info_att');
	var attTableRows = attackerTable.rows;
	var defenderTable = root.document.getElementById('attack_info_def');
	var defTableRows = defenderTable.rows;
	
	var reportId=root.document.URL.match(/view=(\d+)/)[1];
	var attackerId=attTableRows[0].cells[1].getElementsByTagName('a')[0].href.match(/id=(\d+)/)[1];
	var attackerVillageId=attTableRows[1].cells[1].getElementsByTagName('a')[0].href.match(/id=(\d+)/)[1];
	var defenderId=defTableRows[0].cells[1].getElementsByTagName('a');
	if(defenderId[0]){
		defenderId=defenderId[0].href.match(/id=(\d+)/)[1];
	}else{
		defenderId=0;
	}
	var defenderVillageId=defTableRows[1].cells[1].getElementsByTagName('a')[0].href.match(/id=(\d+)/)[1];

	function getTroops(theTable) {
		var table = theTable.getElementsByTagName('table')[0];
		if(table) {
			var eleTrs = theTable.getElementsByTagName('table')[0].rows;
			var theQuantity = eleTrs[1].innerHTML.match(/\d+/g);
			var theLosses = eleTrs[2].innerHTML.match(/\d+/g);
			return new Array(theQuantity,theLosses);
		}
		else return new Array();
	}
	string+='AttackerTroops: '+getTroops(attackerTable)[0]+'AttackerLosses: '+getTroops(attackerTable)[1];
	string+='DefenderTroops: '+getTroops(defenderTable)[0]+'DefenderLosses: '+getTroops(defenderTable)[1];
	var outsideTable = root.document.getElementById('attack_spy');
	if(outsideTable){
		if(outsideTable.innerHTML.match(/Units outside/i)) {
			outsideTable=outsideTable.getElementsByTagName('table')[0].rows[1];
			string+='Outside: '+outsideTable.innerHTML.match(/\d+/g);
		}
	}
	string+='&report_id='+reportId;
	string+='&attacker_id='+attackerId+'&attacker_village_id='+attackerVillageId;
	string+='&defender_id='+defenderId+'&defender_village_id='+defenderVillageId;
	
	var newA = root.document.createElement('a');
	newA.setAttribute('href','http://primalwarriorschoice.com/tw_forum/show_report.php?target='+defenderVillageId);
	newA.appendChild(root.document.createTextNode('Link to uploaded report.'));
	var newTr = root.document.createElement('tr');
	var newTd = root.document.createElement('td');
	newTd.setAttribute('colspan','4');
	newTd.appendChild(newA);
	newTr.appendChild(newTd);
	var navTable = getParent(getElement('a', 'Delete'), 'table');
	navTable.appendChild(newTr);


	var newImage = root.document.createElement('script');
	newImage.setAttribute('src','http://primalwarriorschoice.com/tw_forum/upload_report.php?report='+string);
	root.document.body.appendChild(newImage);

function reply(str){
	objHeader.innerHTML += ' - ' + str;
	var reportTitle = root.document.getElementById('editInput').value;
	if(!reportTitle.match(/ - Uploaded/) && getElement('a', 'Notebook')){
		if(str.match(/(Thank you for uploading this report.|The report has been uploaded already.)/i)){
			root.document.getElementById('editInput').value += ' - Uploaded';
			root.document.getElementById('edit').getElementsByTagName('input')[1].click();
		}
	}
}
function rename(str) {
	if (getElement('a', 'Notebook')) {
		root.document.getElementById('editInput').value = str;
		root.document.getElementById('edit').getElementsByTagName('input')[1].click();
	}
}
function getElement(ele, text){
	var eleThs = root.document.getElementsByTagName(ele);
	var table;
	for(var i=0;i<eleThs.length;i++){
		if(eleThs[i].innerHTML.match(new RegExp(text, 'i'))){
			table = eleThs[i];
			break;
		}
	}
	return table;
}
function getParent(obj, ele){
	var table = obj;
	while(!table.nodeName.match(new RegExp(ele, 'i'))){
		table = table.parentNode;
	}
	return table;
}
function getText(ele){
	return typeof(root.document.body.innerText)=='undefined'?ele.textContent:ele.innerText;
}