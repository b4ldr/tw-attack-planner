// plan.js (Modernized Version)

/**
 * Calculate travel times between attacker and defender coordinates.
 */
function getTravelTimes(attackers, defenders, speed) {
	const travelTimes = {};

	for (const attackerCoord of attackers) {
		const [ax, ay] = attackerCoord.split('|').map(Number);
		travelTimes[attackerCoord] = {};

		for (const defenderCoord of defenders) {
			const [dx, dy] = defenderCoord.split('|').map(Number);
			const distance = Math.hypot(ax - dx, ay - dy);
			travelTimes[attackerCoord][defenderCoord] = distance * speed * 60;
		}
	}

	return travelTimes;
}

/**
 * Generate a plan from travel times.
 */
function getPlan(travelTimes, maxAttack, type) {
	const plan = {};
	const usedTargets = {};

	for (const attacker in travelTimes) {
		let fastestTime = Infinity;
		let target = '';
		let travelTime = 0;

		for (const defender in travelTimes[attacker]) {
			usedTargets[defender] ??= 0;

			if (usedTargets[defender] < maxAttack) {
				const currentTime = travelTimes[attacker][defender];
				if (currentTime < fastestTime) {
					fastestTime = currentTime;
					travelTime = currentTime;
					target = defender;
				}
			}
		}

		if (target) {
			usedTargets[target]++;
			plan[attacker] = {
				attacker,
				target,
				travel_time: travelTime,
				type
			};
		}
	}

	return plan;
}

/**
 * Calculate launch times based on plan and arrival time.
 */
function getResults(planArray, landTime) {
	let result = '';

	for (const entry of planArray) {
		const { attacker, target, travel_time } = entry;
		const launchTime = new Date(new Date(landTime) - travel_time * 1000);
		result += `${attacker} -> ${target} @ ${launchTime.toLocaleString()}<br />`;
	}

	return result;
}

/**
 * Determine unit tag based on type and unit value.
 */
function getTroop(type) {
	if (type === 'nobel') return '[unit]snob[/unit]';

	const troop = $(`select#${type}_unit`).val();

	const unitMap = {
		'9': '[unit]spy[/unit]',
		'10': type === 'nuke' ? '[unit]light[/unit]' : '[unit]knight[/unit]',
		'11': '[unit]heavy[/unit]',
		'18': type === 'nuke' ? '[unit]axe[/unit]' : '[unit]spear[/unit]',
		'22': '[unit]sword[/unit]',
		'30': type === 'nuke' ? '[unit]ram[/unit]' : '[unit]catapult[/unit]'
	};

	return unitMap[troop] || '';
}

/**
 * Format plan into TW code table.
 */
function getTWCode(planArray, landTime) {
	let twcode = '[table] [**]Troop[||]From[||]To[||]Launch At[/**]';

	for (const entry of planArray) {
		const { attacker, target, travel_time, type } = entry;
		const colour = type === 'nobel' ? '#2eb92e' : type === 'nuke' ? '#ff0e0e' : '#0eaeae';
		const launchTime = new Date(new Date(landTime) - travel_time * 1000);
		const formattedTime = $.format.date(launchTime, 'dd/MM/yyyy HH:mm:ss');

		twcode += `[*]${getTroop(type)}[|][coord]${attacker}[/coord][|][coord]${target}[/coord][|][b][color=${colour}]${formattedTime}[/color][/b][/*]`;
	}

	return twcode + '[/table]';
}


/**
 * Merge arrays, avoiding key collisions.
 */
function merge(obj1, obj2) {
	return { ...obj2, ...obj1 };
}

/**
 * Clean array from undesired values.
 */
function clean(arr, toRemove) {
	return arr.filter(item => !toRemove.includes(item));
}

/**
 * Sort plan by descending travel time.
 */
function sortPlan(plan) {
	return Object.values(plan)
		.filter(p => p.travel_time !== undefined)
		.sort((a, b) => b.travel_time - a.travel_time);
}

/**
 * Event bindings and form interactions
 */
$(() => {
	$('#submit_btn').on('click', () => {
		const coordRegex = /\d{1,3}\|\d{1,3}/g;
		const worldSpeed = parseFloat($('#world_speed').val());
		const unitSpeed = parseFloat($('#unit_speed').val());
		const arrivalTime = $('#arrival_time').val();

		const getSpeed = unit => parseFloat(unit) / worldSpeed / unitSpeed;

		const nobelSpeed = getSpeed(35);
		const nukeSpeed = getSpeed($('#nuke_unit').val());
		const supportSpeed = getSpeed($('#support_unit').val());

		const nobelCoords = ($('#nobel_coords').val().match(coordRegex) || []);
		const nukeCoords = clean($('#nuke_coords').val().match(coordRegex) || [], nobelCoords);
		const supportCoords = clean(clean($('#support_coords').val().match(coordRegex) || [], nobelCoords), nukeCoords);
		const targetCoords = $('#target_coords').val().match(coordRegex) || [];

		$('#target_coords').val(targetCoords.join('\n'));

		let allPlans = {};

		if (nobelCoords.length) {
			const times = getTravelTimes(nobelCoords, targetCoords, nobelSpeed);
			$('#nobel_coords').val(nobelCoords.join('\n'));
			allPlans = merge(allPlans, getPlan(times, $('#nobel_count').val(), 'nobel'));
		}

		if (nukeCoords.length) {
			const times = getTravelTimes(nukeCoords, targetCoords, nukeSpeed);
			$('#nuke_coords').val(nukeCoords.join('\n'));
			allPlans = merge(allPlans, getPlan(times, $('#nuke_count').val(), 'nuke'));
		}

		if (supportCoords.length) {
			const times = getTravelTimes(supportCoords, targetCoords, supportSpeed);
			$('#support_coords').val(supportCoords.join('\n'));
			allPlans = merge(allPlans, getPlan(times, $('#support_count').val(), 'support'));
		}

		const sorted = sortPlan(allPlans);
		$('#results').val(getTWCode(sorted, arrivalTime));
	});

	$('#arrival_time').datetimepicker({
		showSecond: true,
		timeFormat: 'hh:mm:ss'
	});
});
