/*

Thanks to Izzy Stradlin. for making this script, I just host it for all you :)

Want to include:
 - continent [d] {continent}
 - region [d] {region}
 - sector [d] {sector}
 - NW/SE [d] {4grid}
 - 9 grid organize system [d] {9grid}
 - continent numbering [d] {kNumber}
 - overall numbering [d] {number}

*/
function doRename(theOutput) {
	var slots = new Array("");
	var numbers = new Array(0);
	var theNumber = 0;
	var totalNumber = 0;
	
	function zeroPad(str, num){
		var text = new String(str);
		while(text.length<=num){
			text = "0" + text;
		}
		return text;
	}
	function convert_coords(vx, vy, row, village_name) {
		totalNumber += 1;
		var continent = Math.floor(y/100)+''+Math.floor(x/100);
		var region = parseInt(String(vy[1]+vx[1]), 10);
		var horizon = parseInt(String(vx[1]+vy[1]), 10);
		var sector = parseInt(String(vx[2])+String(vy[2]), 10);
		// 4 grid
		if (region < 50) {
			V = "N";
		} else {
			V = "S";
		}
		if (horizon < 50) {
			H = "W";
		} else {
			H = "E";
		}
		var cardinalGrid = V+H;
		// 9 grid
		if (region < 34) {
			V2 = "N";
			V3 = "T";
		} else if (region > 33 && region < 68) {
			V2 = "P";
			V3 = "M";
		} else {
			V2 = "S";
			V3 = "B";
		}
		if (horizon < 34) {
			H2 = "L";
		} else if (horizon > 33 && horizon < 68) {
			H2 = "M";
		} else {
			H2 = "R";
		}
		var preciseGrid = V2+H2;
		var preciseGridB = V3+H2;
		var count = slots.length;
		for (a=0;a<count;a++) {
			if (slots[a]==continent) {
				numbers[a]++;
				theNumber = numbers[a];
				break;
			} else if (a==(count-1)) {
				slots[count]=continent;
				numbers[count]=1;
				theNumber = 1;
			} 
		}
		var theNumberS = new String(theNumber);
		if (theNumberS.length==1) {theNumberS="00"+theNumber;}
		else if (theNumberS.length==2) {theNumberS="0"+theNumber;}
		else {theNumberS==theNumber;}
		var returnString = theOutput;
		var done = 
		returnString
			.replace(/\{village name\}/i, village_name)
			.replace(/\{continent\}/i, continent)
			.replace(/\{region\}/i, region)
			.replace(/\{sector\}/i, sector)
			.replace(/\{4grid\}/i, cardinalGrid)
			.replace(/\{9gridA\}/i, preciseGridB)
			.replace(/\{9gridB\}/i, preciseGrid)
			.replace(/\{kNumber\}/i, zeroPad(theNumberS, 3))
			.replace(/\{number\}/i, zeroPad(totalNumber, 3));
		return done;
	}
	var root=(window.frames.length>1)?window.main:window;
	var villageTable = root.document.getElement("th:contains('Village')").getParent("table");
	var eleTrs = villageTable.rows;
	for (var i=1;i<eleTrs.length;i++) {
		var inputs = eleTrs[i].getElementsByTagName('input');
		var vilText = eleTrs[i].cells[0].get("text").match(/(.*?) \((\d+)\|(\d+)\) (K\d+)/i);
		var vilName = vilText[1];
		var x = zeroPad(vilText[2], 3);
		var y = zeroPad(vilText[3], 3);
		inputs[0].value = convert_coords(x, y, i, vilName);
		inputs[1].click();
	}
}