/* JavaScript: */
	var doc=(window.frames.length>1)?window.main.document:document;
	
	var reportTable = doc.getElement("th:contains('Subject')").getParent("table");

	function openAll(){	
		var reportTable=document.getElement("th:contains(\'Subject\')").getParent("table");
		var eleTrs = reportTable.rows;
		for(var i=1;i<eleTrs.length-1;i++){
			window.open(eleTrs[i].cells[0].getElementsByTagName("a")[0].href);
		}
		void(0);
	}

	var eleTrs = reportTable.rows;
	var newTh = doc.createElement('th');
	var openA = '<a href="JavaScript:openAll();">Open all</a>';
	newTh.innerHTML = openA;
	eleTrs[0].insertBefore(newTh, eleTrs[0].cells[0]);
	for(var i=1;i<eleTrs.length-1;i++){
		var reportId = eleTrs[i].getElementsByTagName("input")[0].name.match(/\d+/);
		var villageId = eleTrs[i].cells[0].get("text").match(/\d+/);
		var newTd = doc.createElement('td');
		var newA = '<a href="?village='+villageId+'&screen=place&try=confirm&type=same&report_id='+reportId+'" target="_blank"> => </a>';
		newTd.innerHTML = newA;
		eleTrs[i].insertBefore(newTd, eleTrs[i].cells[0]);
	}
	var newTh = doc.createElement('th');
	eleTrs[eleTrs.length-1].insertBefore(newTh, eleTrs[eleTrs.length-1].cells[0]);
	void(0);