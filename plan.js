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
function get_plan(travel_times, max_attack) {
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
	
function get_twcode(plan, land_time, colour) {
	var twcode = "";
	for (attack in plan) {
		console.log(plan[attack]['target'] );
		if (plan[attack]['target'] != undefined || plan[attack]['travel_time'] != undefined) {
			var launch_time = new Date(Math.floor(Date.parse(land_time) - (plan[attack]['travel_time']*1000)));
			twcode += "[color=" + colour + "][coord]" + attack + "[/coord]"  + " -> " +  "[color=" + colour + "][coord]" + plan[attack]['target'] + "[/coord]"  +" @ " + launch_time.toString('dd/mm/yyyy HH:mm:ss') + "[/color]<br />";
		}
	}
	return twcode;
}
	
$(function() {  
  	$(".button").click(function() {  
		var coord_regex = /[0-9]{1,3}\|[0-9]{1,3}/g;
		var world_speed = $("input#world_speed").val();
		var unit_speed = $("input#unit_speed").val();
		var arrival_time = $("input#arrival_time").val();
		var clearing_speed = $("select#clearing_unit").val()/world_speed/unit_speed;
		var support_speed = $("select#support_unit").val()/world_speed/unit_speed;
		var noble_speed = 35/world_speed/unit_speed;
		var noble_coords = $("textarea#noble_coords").val().match(coord_regex);
		var clearing_coords = $("textarea#clearing_coords").val().match(coord_regex);
		var support_coords = $("textarea#support_coords").val().match(coord_regex);
		var targets_coords = $("textarea#target_coords").val().match(coord_regex);
		var clearing_count = $("input#clearing_count").val()
		var support_count = $("input#support_count").val()
		var noble_count = $("input#noble_count").val()
		//var clearing_results = $("div#clearing_results")
		//var support_results = $("div#support_results")
		//var targets_results = $("div#target_results")
		if ( clearing_coords ) { 
			var clearing_travel_times = get_travel_times(clearing_coords,targets_coords,clearing_speed);
			//console.log(clearing_distances);
			var clearing_plan = get_plan( clearing_travel_times,clearing_count);
			//console.log(clearing_plan);
			$("div#clearing_results").html(get_results(clearing_plan,arrival_time));
			$("div#clearing_twcode").html(get_twcode(clearing_plan,arrival_time,"#ff0e0e"));
			
		}
		if ( noble_coords ) { 
			var noble_travel_times = get_travel_times(noble_coords,targets_coords,noble_speed);
			//console.log(noble_distance);
			var noble_plan = get_plan( noble_travel_times,noble_count);
			//console.log(noble_plan);
			$("div#noble_results").html(get_results(noble_plan,arrival_time));
			$("div#noble_twcode").html(get_twcode(clearing_plan,arrival_time,"#2eb92e"));
		}
		if ( support_coords ) { 
			var support_travel_times = get_travel_times(support_coords,targets_coords,support_speed);
			var support_plan = get_plan( support_travel_times,support_count);
			$("div#support_results").html(get_results(support_plan,arrival_time));
			$("div#support_twcode").html(get_twcode(clearing_plan,arrival_time,"#0eaeae"));
		}
	});  
});  
