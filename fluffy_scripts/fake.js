function doAllTheStuff(troops) {
    var doc=(window.frames.length>0)?window.main.document:document;
    if(!doc.URL.match(/screen=place/i))location.search='village='+doc.getElement("a").href.match(/village=(\d+)/)[1]+'&screen=place';
    if(typeof troops=='undefined')troops=[['spy',1],['ram',1]];
    coords = "111|111 222|222 333|333 444|444";
	
    coord = coords.split(" ");
    coordSplit = coord[Math.round(Math.random()*(coord.length-1))].split("|");
    doc.forms[0].x.value=coordSplit[0];
    doc.forms[0].y.value=coordSplit[1];
	
//alert(troops[0][0]);
    if(troops[0][0].length<3)doc.units[troops[0]].value=troops[1];
    else{
	for(i=0;i<troops.length;i++){
            doc.units[troops[i][0]].value=troops[i][1];
            }
        }
    }
