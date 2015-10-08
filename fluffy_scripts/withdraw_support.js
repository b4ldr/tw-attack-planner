	var root=(window.frames.length>0)?window.main:window;
	var world = root.game_data.world;
	var page = root.game_data.screen;
	var mode = root.game_data.mode;
	var villageId = root.game_data.village.id;
	function getText(ele){return typeof(root.document.body.innerText)=='undefined'?ele.textContent:ele.innerText;}
	
	var premiumCheck = root.$("a:contains('Notebook')");
	if(mode != 'units' && !premiumCheck){
		location.search = '?village='+villageId+'&screen=place&mode=units';
	}else if(mode != 'units'){
		location.search = 'village='+villageId+'&screen=overview_villages&mode=units&units_type=away_detail';
	}
	c("Server: "+world);
	c("Browser: "+navigator.userAgent);
	c("Screen: "+page);
	c("Mode: "+mode);
	var players = new Array();
	var coordinates = new Array();
	
	var eleThs = root.document.getElementsByTagName("th");
	var troopTable;
	for(var i=0;i<eleThs.length;i++){
		if(eleThs[i].innerHTML.match(/Village/i)){
			troopTable = eleThs[i];
			break;
		}
	}
	while(troopTable.nodeName != 'TABLE'){
		troopTable=troopTable.parentNode;
	}
	var eleTrs = troopTable.rows;
	c("Rows: " + (eleTrs.length-1));
	for(var i=1;i<eleTrs.length;i++){
		if(page == 'place' || eleTrs[i].className != 'units_away'){
			var row = eleTrs[i].cells[0];
			var coord = getText(row).match(/\((\d+\|\d+)\) K\d+/i);
			var village_id = row.getElementsByTagName("a")[0].href.match(/id=(\d+)/i)[1];
			coordinates.push(coord[1]);
		}
	}
	c("Coordinates: "+coordinates.length);

	getPlayerNames();

	function appendPlayerNames(){	
		c("Player names loaded.");
		for(var i=1;i<eleTrs.length;i++){
			if(page == 'place' || eleTrs[i].className != 'units_away'){
				var village_id = eleTrs[i].cells[0].getElementsByTagName("a")[0].href.match(/id=(\d+)/i)[1];
				if(page == 'place'){
					eleTrs[i].cells[0].innerHTML = '<a href="/game.php?village='+villageId+'&screen=info_player&id='+players[village_id][0]+'">'+players[village_id][1]+'</a> <br /> '+eleTrs[i].cells[0].innerHTML;
				}else if(page == 'overview_villages'){
					eleTrs[i].cells[0].attributes['colspan'].nodeValue = '1';
					var newA = root.document.createElement('a');
					newA.setAttribute('href', '/game.php?village='+villageId+'&screen=info_player&id='+players[village_id][0]);
					newA.appendChild(root.document.createTextNode(players[village_id][1]));
					var newTd = root.document.createElement('td');
					newTd.appendChild(newA);
					eleTrs[i].insertBefore(newTd, eleTrs[i].cells[1]);				
				}
			}
		}
		c("Player names appended.");
	}		
	function getPlayerNames(){
		if(root.document.getElementById("get_players")==null){
			var newElement = root.document.createElement('script');
			newElement.setAttribute('src', 'http://fluffy88.wartool.net/get_player.php?world='+world+'&coords='+coordinates);
			newElement.setAttribute('type', 'text/javascript');
			newElement.setAttribute('id', "get_players");
			root.document.getElementsByTagName("head")[0].appendChild(newElement);
			c("Get player details appended.");
			setTimeout(getPlayerNames,250);
			return;
		}else if(typeof(root.over)=='undefined'){
			c("loading player names...");
			setTimeout(getPlayerNames,200);
			return;
		}
		appendPlayerNames();
	}
	function c(m){
		root.document.body.appendChild(root.document.createTextNode(m));
		root.document.body.appendChild(root.document.createElement('br'));
	}
