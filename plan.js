//@arg atteckers array containing coordinates to attacking vills
//@arg atteckers array containing coordinates to defending vills
//@return 2D associative array where
// array[attack coordinates][defender coordinates] = distance
function get_distances(attackers, defenders) {
	var distances = new Array()
	for ( var a_count = 0; a_count < attackers.length; a_count++) {
		attacker = attackers[a_count].split("|");
		distances[attackers[a_count]] = new Array()
		//a big number 
		for ( var d_count = 0; d_count < defenders.length; d_count++) {
			defender = defenders[d_count].split("|");
			x = attacker[0] - defender[0];
			y = attacker[1] - defender[1];
			distance = Math.sqrt((x * x) + (y * y));
			distances[attackers[a_count]][defenders[d_count]] = distance;
		}
	}
	return distances	
}
//@arg distances 2D associative array where
// array[attack coordinates][defender coordinates] = distance
function get_plan(distances, max_attack) {
	var plan = new Array();
	var used_targets = new Array();
	for ( attack in distances) {
		var fastest = 9999999999.0;
		var target = "";
		var distance = "";
		plan[attack] = new Array();
		for ( defend in distances[attack]) {
			if (typeof used_targets[defend] === 'undefined'  ) {
				used_targets[defend] = 0; 
			} 
			if (  used_targets[defend] < max_attack) {
				if ( distances[attack][defend] < fastest ) {
					target = defend;
					distance = distances[attack][defend];
					fastest = distance;
				}
			}
		}
		if ( target != "" && distance != "" ) {
			used_targets[target] = used_targets[target] + 1;
			//console.log(target);
			//console.log(distance);
			plan[attack]['target'] = target;
			plan[attack]['speed'] = distance;
		}
	}
	return plan	
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
		if ( clearing_coords ) { 
			var clearing_distances = get_distances(clearing_coords,targets_coords);
			//console.log(clearing_distances);
			var clearing_plan = get_plan( clearing_distances,3);
			console.log(clearing_plan);
		}
		if ( noble_coords ) { 
			var noble_distances = get_distances(noble_coords,targets_coords);
			//console.log(noble_distance);
			var noble_plan = get_plan( noble_distances,3);
			console.log(noble_plan);
		}
		if ( support_coords ) { 
			var support_distances = get_distances(support_coords,targets_coords);
			var support_plan = get_plan( support_distances,3);
		}
	});  
});  
