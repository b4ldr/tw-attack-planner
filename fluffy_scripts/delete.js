	var doc=(window.frames.length>0)?window.main.document:document;

	var table=doc.getElement("th:contains('Subject')").getParent("table");
	var eleAs=table.getElementsByTagName('a');
	
	function mark(colour,type){
		for (i=0;i<eleAs.length;i++){
			if(eleAs[i].innerHTML.match(colour,"i")){
				eleAs[i].getParent('td').getElement('input').checked=type;
				}
			}		
		}
		

	var newElement='<tr><th><a href="JavaScript:mark(\'\',false);mark(\'green.png\',true);"><img src="/graphic/dots/green.png?1" /></a><a href="JavaScript:mark(\'\',false);mark(\'yellow.png\',true);"> <img src="/graphic/dots/yellow.png?1" /></a><a href="JavaScript:mark(\'\',false);mark(\'red.png\',true);"> <img src="/graphic/dots/red.png?1" /></a><a href="JavaScript:mark(\'\',false);mark(\'blue.png\',true);"> <img src="/graphic/dots/blue.png?1" /></a><a href="JavaScript:mark(\'\',false);mark(\'max_loot\/0.png\',true);"> <img src="/graphic/max_loot/0.png?1" /></a> <a href="JavaScript:mark(\'\',false);mark(\'max_loot\/1.png\',true);"> <img src="/graphic/max_loot/1.png?1" /></a> <input value="Fake" type="text" size="5" onBlur="mark(\'\',false);mark(this.value,true)" /></th></tr>';
	table.innerHTML=newElement+table.innerHTML+newElement;
