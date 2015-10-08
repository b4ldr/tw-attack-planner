	var root=(window.frames.length>0)?window.main:window;
	var reportTable = getReportTable();

	for(var i=1;i<reportTable.rows.length-1;i++){
		var reportURL = reportTable.rows[i].getElementsByTagName("a")[0].href;
		createNewIframe("report_"+i, reportURL);
		getFrameBody("report_"+i);
	}

	function createNewIframe(id, reportURL){
		var newIframe = root.document.createElement('iframe');
		newIframe.setAttribute("id", id);
		newIframe.setAttribute("width", "0");
		newIframe.setAttribute("height", "0");
		newIframe.setAttribute("frameborder", "0");
		newIframe.setAttribute("src", reportURL);
		root.document.body.appendChild(newIframe);
		fnStatus("Appended iframe: " + id + " : " + reportURL);
	}
	function getReportTable(){
		var eleSpans = root.document.getElementsByTagName("span");
		for(var i=0;i<eleSpans.length;i++){
			if(eleSpans[i].id.match(/labelText\[\d+\]/i)){
				var table = eleSpans[i].getParent("table");
				fnStatus("Table found, header: " + table.rows[0].cells[0].innerHTML);
				return table;
			}
		}
	}
	function getFrameBody(id){
		var reportFrame = root.document.getElementById(id);
		if(reportFrame){
			reportFrame = reportFrame.contentWindow.document;
			if(reportFrame.getElementById("serverTime")){
				if(reportFrame.getElementById("attack_luck")){
					alert("Luck: " + reportFrame.getElementById("attack_luck").get("text").trim() + "\n" + reportFrame.getElementById("attack_moral").get("text").trim());
				}else{
					alert("This is not an attack of defense report!");
				}
			}else{
				setTimeout("getFrameBody("+id+");", 500);
			}
		}else{
			setTimeout("getFrameBody("+id+");", 500);
		}
	}
    function fnStatus(strMessage){
		root.document.body.appendChild(root.document.createTextNode(strMessage));
		root.document.body.appendChild(root.document.createElement('br'));
	}