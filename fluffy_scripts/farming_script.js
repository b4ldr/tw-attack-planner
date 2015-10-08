var doc=(window.frames.length>0)?window.main.document:document;

	var h=doc.getElementsByTagName("h3")[0];
	h.innerHTML='Give commands Load:<input size="5" value="2619" onblur="insertTroop(this.value,arrUnits);spys();"/>';
	
	function insertTroop(load,units) {
                spys();
                var inputs=doc.forms[0].getElementsByTagName('input');
		for(j=0;j<(inputs.length-4);j++){
                    inputs[j].value="";
                    }
                var arrUnits=units;
		for(i=0;i<(arrUnits.length);i++){
			var available = parseInt(doc.units[arrUnits[i][0]].getNext().innerHTML.match(/\d+/),10);
			var needed = Math.ceil(load/arrUnits[i][1]);
			if(needed<=available){doc.units[arrUnits[i][0]].value=needed;return load=0;}
			else if(needed>available&&available*arrUnits[i][1]>=90){doc.units[arrUnits[i][0]].value=available;load=load-(available*arrUnits[i][1]);}
			}
		if(load>0)alert("Not enough troops!\nThere is still " + load + " left to be collected.");
		else return load;
		}
	function spys(){var spy=doc.units["spy"];if(spy.value!=0)spy.value=1;doc.units["spy"].focus();}