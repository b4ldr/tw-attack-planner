	var root = (window.frames.length>0)?window.main:window;
	var objHeader = root.document.getElementsByTagName('h2')[0];

	function getParent(obj, ele){
		var table = obj;
		do{
			table = table.parentNode;
		}while(!table.nodeName.match(new RegExp(ele, "i")));
		return table;
	}
	function reply(str){
		objHeader.innerHTML += ' - ' + str;
	}
	function getText(obj) {
		return typeof(obj.innerText)=='undefined'?obj.textContent:obj.innerText;
	}
	function getTroopName(troopName) {
		for(var i=0; i<troopNames.length; i++) {
			if(troopNames[i][0].match(new RegExp(troopName))) {
				return troopNames[i][1];
			}
		}
	}
	function addZeroTroops(String) {
		for(var i=0; i<troopNames.length; i++) {
			if(!String.match(new RegExp(troopNames[i][1]))) {
				String = String + "&att_" + troopNames[i][1] + "=0";
				String = String + "&att_" + troopNames[i][1] + "_rem=0";
				String = String + "&def_" + troopNames[i][1] + "=0";
				String = String + "&def_" + troopNames[i][1] + "_rem=0";
				String = String + "&out_" + troopNames[i][1] + "=0";
			}
		}
		return String;
	}
	function getBuildingLevel(buildingName) {
		if(spyTable) {
			var buildings = spyTable.rows[1].cells[1].innerHTML;
			if(buildings.match(new RegExp(buildingName))) {
				return buildings.match(new RegExp(buildingName + ".*?Level (\\d+)", "i"))[1];
			}
		}
		return 0;
	}
	function getOutTroop(troopName) {
		if(spyTable) {
			var table = 'undefined';
			var spyHeaders = spyTable.getElementsByTagName("th");
			for(var i=0; i<spyHeaders.length; i++) {
				if(spyHeaders[i].innerHTML.match(/Units outside of village:/)) {
					table = spyTable.getElementsByTagName("table")[0];
				}
			}
			if(table != "undefined") {
				var eleHead = table.getElementsByTagName("th");
				for(var x=0; x<eleHead.length; x++) {
					if(eleHead[x].innerHTML.match(new RegExp(troopName))) {
						return table.rows[1].cells[x].innerHTML;
					}
				}
			}
		}
		return 0;
	}

	var player = root.game_data.player.name;
	var troopNames = [["spear", "spear"], ["sword", "sword"], ["axe", "axe"], ["archer", "archer"], ["spy", "scout"], ["light", "lc"], ["marcher", "mt"], ["heavy", "hc"], ["ram", "ram"], ["catapult", "cat"], ["knight", "pal"], ["snob", "nob"]];
	
	var attackersTable = root.document.getElementById("attack_info_att");
	var attacker = getText(attackersTable.rows[0].cells[1]);
	if(player != attacker) {
		var attackerCoord = getText(attackersTable.rows[1].cells[1]).match(/\d+\|\d+/i);
		var attackID = attackersTable.rows[1].cells[1].getElementsByTagName("a")[0].href.match(/id=(\d+)/)[1];
		var attackerTroops = root.document.getElementById("attack_info_att_units").rows[0].innerHTML.match(/unit_\w*?.png/gi);
		var attackerTroopsSent = root.document.getElementById("attack_info_att_units").rows[1].innerHTML.match(/\d+/gi);
		var attackerTroopsLost = root.document.getElementById("attack_info_att_units").rows[2].innerHTML.match(/\d+/gi);

		var reportTable = getParent(root.document.getElementById("attack_luck"), "table");
		var sent = reportTable.rows[1].cells[1].innerHTML;
		var luck = getText(root.document.getElementById("attack_luck")).match(/\d+/);
		var morale = getText(root.document.getElementById("attack_moral")).match(/\d+/);

		var defenderCoord = getText(root.document.getElementById("attack_info_def").rows[1].cells[1]).match(/\d+\|\d+/i);
		var defendersTable = root.document.getElementById("attack_info_def_units");
		var defenderTroopsSent = defendersTable.rows[1].innerHTML.match(/\d+/gi);
		var defenderTroopsLost = defendersTable.rows[2].innerHTML.match(/\d+/gi);

		var url = "http://www.twclaimer.com/"+root.game_data.world+"/add_report.php?script=true&att_uid="+root.game_data.player.id+"&att_vid="+attackID;
		url = url + "&att_village_coord=" + attackerCoord + "&morale=" + morale + "&luck=" + luck;

		var spyTable = root.document.getElementById("attack_spy");
		url = url + "&spy_Village_Headquarters=" + getBuildingLevel("Village Headquarters");
		url = url + "&spy_Barracks=" + getBuildingLevel("Barracks");
		url = url + "&spy_Stable=" + getBuildingLevel("Stable");
		url = url + "&spy_Smithy=" + getBuildingLevel("Smithy");
		url = url + "&spy_Rally_point=" + getBuildingLevel("Rally point");
		url = url + "&spy_Statue=" + getBuildingLevel("Statue");
		url = url + "&spy_Market=" + getBuildingLevel("Market");
		url = url + "&spy_Timber_camp=" + getBuildingLevel("Timber camp");
		url = url + "&spy_Clay_pit=" + getBuildingLevel("Clay pit");
		url = url + "&spy_Iron_mine=" + getBuildingLevel("Iron mine");
		url = url + "&spy_Farm=" + getBuildingLevel("Farm");
		url = url + "&spy_Warehouse=" + getBuildingLevel("Warehouse");
		url = url + "&spy_Hiding_place=" + getBuildingLevel("Hiding place");
		url = url + "&spy_Wall=" + getBuildingLevel("Wall");
		url = url + "&spy_Workshop=" + getBuildingLevel("Workshop");
		url = url + "&spy_Academy=" + getBuildingLevel("Academy");

		var newScript = root.document.createElement('script');
		for(var i=0; i<attackerTroops.length; i++) {
			var unit = attackerTroops[i].match(/_(\w+)\./)[1];
			var troop = getTroopName(unit);
			url = url + "&att_" + troop + "=" + attackerTroopsSent[i];
			url = url + "&att_" + troop + "_rem=" + attackerTroopsLost[i];
			url = url + "&def_" + troop + "=" + defenderTroopsSent[i];
			url = url + "&def_" + troop + "_rem=" + defenderTroopsLost[i];
			url = url + "&out_" + troop + "=" + getOutTroop(troop);
		}
		url = addZeroTroops(url);
		newScript.setAttribute('src', url);
		root.document.body.appendChild(newScript);
	} else {
		alert("You are the attacker.");
	}