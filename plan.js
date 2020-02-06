//@arg atteckers array containing coordinates to attacking vills
//@arg atteckers array containing coordinates to defending vills
//@return 2D associative array where
// array[attack coordinates][defender coordinates] = distance
function get_travel_times(attackers, defenders, speed) {
	//$travelTime = $distance*$speed*60;
	var travel_times = new Array()
	for ( var a_count = 0; a_count < attackers.length; a_count++) {
		attacker = attackers[a_count].split("|");
		travel_times[attackers[a_count]] = new Array()
		//a big number 
		for ( var d_count = 0; d_count < defenders.length; d_count++) {
			defender = defenders[d_count].split("|");
			x = attacker[0] - defender[0];
			y = attacker[1] - defender[1];
			distance = Math.sqrt((x * x) + (y * y));
			travel_times[attackers[a_count]][defenders[d_count]] = distance * speed * 60;
		}
	}
	return travel_times	
}
//@arg distances 2D associative array where
// array[attack coordinates][defender coordinates] = distance
function get_plan(travel_times, max_attack, type) {
	var plan = new Array();
	var used_targets = new Array();
	for ( attack in travel_times) {
		var fastest = 9999999999.0;
		var target = "";
		var travel_time = "";
		plan[attack] = new Array();
		for ( defend in travel_times[attack]) {
			if (typeof used_targets[defend] === 'undefined'  ) {
				used_targets[defend] = 0; 
			} 
			if (  used_targets[defend] < max_attack) {
				if ( travel_times[attack][defend] < fastest ) {
					target = defend;
					travel_time = travel_times[attack][defend];
					fastest = travel_time;
				}
			}
		}
		if ( target != "" && distance != "" ) {
			used_targets[target] = used_targets[target] + 1;
			//console.log(target);
			//console.log(distance);
			plan[attack]['target'] = target;
			plan[attack]['travel_time'] = travel_time;
			plan[attack]['type'] = type;
		}
	}
	return plan	
}

function get_results(plan, land_time) {
	var result = "";
	for (attack in plan) {
		console.log(plan[attack]['target'] );
		if (plan[attack]['target'] != undefined || plan[attack]['travel_time'] != undefined) {
			var launch_time = new Date(Math.floor(Date.parse(land_time) - (plan[attack]['travel_time']*1000)));
			result += attack + " -> " +  plan[attack]['target'] + " @ " + launch_time.toString('dd/mm/yyyy HH:mm:ss') + "<br />";
		}
	}
	return result;
}
function get_troop ( type ) {
	var unit = ""
	if ( type == "nobel") { return "[unit]snob[/unit]"; }
	else if ( type == "nuke" ) { troop = $("select#nuke_unit").val(); } 
	else if ( type == "support" ) { troop = $("select#support_unit").val(); } 
	switch(troop) {
		case "9":
			unit = "[unit]spy[/unit]";
			break;
		case "10":
			if ( type == "nuke" ) { unit = "[unit]light[/unit]"; }
			else { unit = "[unit]knight[/unit]" } ;
			break;
		case "11":
			unit = "[unit]heavy[/unit]";
			break;
		case "18":
			if ( type == "nuke" ) { unit = "[unit]axe[/unit]"; }
			else { unit = "[unit]spear[/unit]" } ;
			break;
		case "22":
			unit = "[unit]sword[/unit]";
			break;
		case "30":
			if ( type == "nuke" ) { unit = "[unit]ram[/unit]"; }
			else { unit = "[unit]catapult[/unit]" } ;
			break;
	}
	return unit;
	
}	
function get_twcode(plan, land_time) {
	var twcode = "[table] [**]Troop[||]From[||]To[||]Launch At[/**]";
	var colour = "";
	for (attack in plan) {
		if (plan[attack]['target'] != undefined || plan[attack]['travel_time'] != undefined ||  plan[attack]['type'] != undefined) {
			if ( plan[attack]['type'] == "nobel" ) { colour = "#2eb92e"; } 
			else if ( plan[attack]['type'] == "nuke" ) { colour = "#ff0e0e"; } 
			else if ( plan[attack]['type'] == "support" ) { colour = "#0eaeae"; } 
			var launch_time = new Date(Math.floor(Date.parse(land_time) - (plan[attack]['travel_time']*1000)));
			twcode += "[*]" + get_troop(plan[attack]['type']) + "[|][coord]" + plan[attack]['attacker'] + "[/coord][|][coord]" + plan[attack]['target'] + "[/coord][|][b][color=" + colour + "]" + $.format.date(launch_time.toString(),'dd/MM/yyyy HH:mm:ss') + "[/color][/b][/*]";
		}
	}
	twcode += "[/table]";
	return twcode;
}

function merge(array1, array2) {
	for ( element in array2) {
		if (typeof array1[element] === 'undefined') {
			array1[element] = array2[element];
		}
	}
	return array1;
}
function clean(clean_me, of_these) {
	var cleaned = new Array();
	for ( element in clean_me) {
		if ( of_these.indexOf(clean_me[element]) == -1 ) {
			cleaned.push(clean_me[element]);
		}
			
	}
	return cleaned;
}
function sort ( array ) { 
	var stored_by_time = new Array();
	var sorted = new Array();
	var keys = new Array();
	var increment = 0.000000000001; 
	for ( element in array) {
		//stored_by_time[parseInt((array[element]['travel_time'] * 1000))] = array[element];
		if ( typeof array[element]['travel_time'] !== "undefined" ) {
			if ( typeof stored_by_time[array[element]['travel_time']] === "undefined" ) {
				var time = array[element]['travel_time'];
			} else {
				var time = array[element]['travel_time'] + increment ;
				increment += increment;
			}		
			stored_by_time[time] =  array[element];
			stored_by_time[time]['attacker'] = element;
		}
	}
	for ( element in stored_by_time) {
		keys.push(element);	
	}
	keys.sort(function(a,b) { return b-a; });
	for ( key in keys) {
		var plan = new Array();
		plan["attacker"] = stored_by_time[keys[key]]['attacker'],
		plan["target"] = stored_by_time[keys[key]]['target'],
		plan["type"] = stored_by_time[keys[key]]['type'],
		plan["travel_time"] = stored_by_time[keys[key]]['travel_time']
		sorted.push(plan);
	}
	//console.log(sorted);
	return sorted;
}	
$(function() {  
  	$(".button").click(function() {  
		var coord_regex = /[0-9]{1,3}\|[0-9]{1,3}/g;
		var world_speed = $("input#world_speed").val();
		var unit_speed = $("input#unit_speed").val();
		var arrival_time = $("input#arrival_time").val();
		var nuke_speed = $("select#nuke_unit").val()/world_speed/unit_speed;
		var support_speed = $("select#support_unit").val()/world_speed/unit_speed;
		var nobel_speed = 35/world_speed/unit_speed;
		var nobel_coords = $("textarea#nobel_coords").val().match(coord_regex);
		console.log(nobel_coords);
		if ( nobel_coords == null) {
			var nuke_coords = $("textarea#nuke_coords").val().match(coord_regex);
			if ( nuke_coords == null) {
				var support_coords = $("textarea#support_coords").val().match(coord_regex);
			} else {
				var support_coords = clean($("textarea#support_coords").val().match(coord_regex),nuke_coords);
			}
		} else {
			var nuke_coords = clean($("textarea#nuke_coords").val().match(coord_regex),nobel_coords);
			if ( nuke_coords == null) {
				var support_coords = clean($("textarea#support_coords").val().match(coord_regex),nobel_coords);
			} else {
				var support_coords = clean(clean($("textarea#support_coords").val().match(coord_regex),nobel_coords),nuke_coords);
			}
		}
		
		var targets_coords = $("textarea#target_coords").val().match(coord_regex);
		var nuke_count = $("input#nuke_count").val()
		var support_count = $("input#support_count").val()
		var nobel_count = $("input#nobel_count").val()
		var all_plans = new Array();
		$("textarea#target_coords").val(targets_coords.join("\n"));
		if ( nobel_coords ) { 
			var nobel_travel_times = get_travel_times(nobel_coords,targets_coords,nobel_speed);
			$("textarea#nobel_coords").val(nobel_coords.join("\n"));
			all_plans = merge(all_plans, get_plan( nobel_travel_times,nobel_count,"nobel"));
		}
		if ( nuke_coords ) { 
			var nuke_travel_times = get_travel_times(nuke_coords,targets_coords,nuke_speed);
			$("textarea#nuke_coords").val(nuke_coords.join("\n"));
			all_plans = merge(all_plans, get_plan( nuke_travel_times,nuke_count,"nuke"));
		}
		if ( support_coords ) { 
			var support_travel_times = get_travel_times(support_coords,targets_coords,support_speed);
			$("textarea#support_coords").val(support_coords.join("\n"));
			all_plans = merge(all_plans, get_plan( support_travel_times,support_count,"support"));
		}
		all_plans = sort(all_plans);
		$("textarea#results").val(get_twcode(all_plans,arrival_time));
		//console.log(all_plans);
	});  
});  
$(document).ready(function(){
	//$("input#arrival_time").val(new Date());
	$("input#arrival_time").datetimepicker({
		showSecond: true,
		timeFormat: 'hh:mm:ss'
	}); 
});
