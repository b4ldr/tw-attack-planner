/**
 *	@author fluffy88
 *
 *	@version 1.0
 *
 *	Script to upload details of an attack to a server via a script element and GET variables.
 *	Script needs to be run from the page ?screen=info_command&type=own
 *
 */

	var root = (window.frames.length>0)?window.main:window;
	var objHeader = root.document.getElementsByTagName('h2')[0];

	/* I use the text string "Duration" and "Arrival" to identify the required info, for non english servers these will need to be edited. */
	var translateStrings = {"duration":"Duration:", "arrival":"Arrival:"};
	/* This array is used to identify the month as a string rather than a number. */
	var months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

	/* the below methods are just used to get information. */
	function getParent(obj, ele){ /* method to get a parentNode of a particular type. */
		var table = obj;
		do{
			table = table.parentNode;
		}while(!table.nodeName.match(new RegExp(ele, "i")));
		return table;
	}
	function getText(obj) { /* method to get the inner text of a element. */
		return typeof(obj.innerText)=='undefined'?obj.textContent:obj.innerText;
	}
	function getRow(String) { /* method to get the row for the passed string, e.g. Duration or Arrival. */
		var arrRows = attackTable.rows;
		for(var i=0; i<arrRows.length; i++) {
			if(arrRows[i].cells[0].innerHTML.match(new RegExp(String))) {
				return arrRows[i];
			}
		}
	}
	function reply(str){ /* method to append a reply message to the page. */
		objHeader.innerHTML += ' - ' + str;
	}

	/* pull attack id from the url. */
	var attackID = root.document.URL.match(/id=(\d+)/i)[1];

	/* get the table containing the attack information, then grab the duration and arrival times. */
	var attackTable = getParent(root.document.getElementById("label"), "table");
	var duration = getRow(translateStrings.duration).cells[1].innerHTML.match(/\d+/g);
	var arrival = getText(getRow(translateStrings.arrival).cells[1]);

	/* if 'Attack' is not in the title then the troops are returning so double the duration to calculate the send time. */
	var attackTitle = root.document.getElementById("content_value").innerHTML.match(/<h2>(.*?)<\/h2>/i)[1];
	if(!attackTitle.match(/Attack/i)) {
		duration[0] = duration[0] * 2;
		duration[1] = duration[1] * 2;
		duration[2] = duration[2] * 2;
	}

	/* get the hours, minutes and seconds from the duration. */
	var hours = duration[0];
	var minutes = duration[1];
	var seconds = duration[2];

	/* if seconds are greater than 60 then the loop increments the number of minutes and reduces seconds by 60 until seconds is less than 60. */
	var days = 0;
	while(seconds >= 60) {
		minutes++;
		seconds = seconds - 60;
	}
	/* do same for minutes and hours */
	while(minutes >= 60) {
		hours++;
		minutes = minutes - 60;
	}
	while(hours >= 24) {
		days++;
		hours = hours - 24;
	}

	/* this section takes care of the (arrival time - duration) so identifies the time attack was sent. */
	var sentTime = new Date(arrival.match(/(.+):\d+/)[1]);
	sentTime.setDate(sentTime.getDate() - days);
	sentTime.setHours(sentTime.getHours() - hours);
	sentTime.setMinutes(sentTime.getMinutes() - minutes);
	sentTime.setSeconds(sentTime.getSeconds() - seconds);

	/* the final part of the script constructs the url and creates a script element to append to the page that will upload the data. */
	var newScript = root.document.createElement('script');
	var url = "http://www.twclaimer.com/"+root.game_data.world+"/att_id.php?page=add&id="+attackID+"&sent_mo="+months[sentTime.getMonth()];
	url = url + "&sent_day=" + sentTime.getDate() + "&sent_yr=" + sentTime.getFullYear() + "&sent_time=" + sentTime.toString().match(/\d+:\d+:\d+/);
	newScript.setAttribute('src', url);
	root.document.body.appendChild(newScript);

	void(0);