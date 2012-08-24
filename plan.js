//@arg atteckers array containing coordinates to attacking vills
//@arg atteckers array containing coordinates to defending vills
//@return 2D associative array where
// array[attack coordinates][defender coordinates] = distance
function get_distances(attackers, defenders) {
	var distances = new Array()
	for ( var d_count = 0; d_count < defenders.length; d_count++) {
		defender = defenders[d_count].split("|");
		distances[defenders[d_count]] = new Array()
		//a big number 
		for ( var a_count = 0; a_count < attackers.length; a_count++) {
			attacker = attackers[a_count].split("|");
			x = attacker[0] - defender[0];
			y = attacker[1] - defender[1];
			distance = Math.sqrt((x * x) + (y * y));
			distances[defenders[d_count]][attackers[a_count]] = distance;
		}
	}
	return distances	
}
//@arg distances 2D associative array where
// array[attack coordinates][defender coordinates] = distance
function get_plan(distances) {
	var plan = new Array()
	for ( defend in distances) {
		var fastest = 9999999999.0;
		for ( attack in defend) {
			if ( attack < fastest ) {
				plan[defend] = attack;	
			}
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
		var nobel_speed = 35/world_speed/unit_speed;
		var noble_coords = $("textarea#noble_coords").val().match(coord_regex);
		var clearing_coords = $("textarea#clearing_coords").val().match(coord_regex);
		var support_coords = $("textarea#support_coords").val().match(coord_regex);
		var targets_coords = $("textarea#target_coords").val().match(coord_regex);
		if ( clearing_coords ) { 
			var clearing_distance = get_distances(clearing_coords,targets_coords);
			console.log(clearing_distance);
		}
		if ( nobel_coords ) { 
			var nobel_distance = get_distances(nobel_coords,targets_coords);
		}
		if ( support_coords ) { 
			var support_distance = get_distances(support_coords,targets_coords);
		}
	});  
});  
