	var root=(window.frames.length>1)?window.main:window;
	var page = root.game_data.screen;
	var villageHeader = root.document.getElementsByTagName('h2')[0];

	if(page == 'info_village'){
		var village_id = root.document.URL.match(/id=(\d+)/)[1];
	}else if(page == 'report'){
		var defTable = root.document.getElementById("attack_info_def");
		var village_id = defTable.rows[1].getElementsByTagName("a")[0].href.match(/id=(\d+)/i)[1];
	}

	var newElement = root.document.createElement('script');
	newElement.setAttribute('src','http://primalwarriorschoice.com/tw_forum/js_claim.php?village_id='+village_id);
	root.document.body.appendChild(newElement);

	function reply(str){
		villageHeader.innerHTML += ' - ' + str;
	}