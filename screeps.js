var harvester = require('harvester');

var counter = 0

var workerBody = [WORK,MOVE,CARRY, ATTACK]

module.exports.loop = function () {
    //Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Worker1' );
    var spawn1 = Game.spawns.Spawn1;
    var body = workerBody;
    if (spawn1.canCreateCreep(body) == 0) {
        var creepName = "Slave"+counter;
        console.log("spawning")
        spawn1.createCreep(body, creepName);
        counter++;
    } else {
        console.log("can't make more creeps");
    }


	for(var name in Game.creeps) {
		var creep = Game.creeps[name];

        var enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    	if(enemies.length) {
    	    creep.memory.role = 'attacker';
    	} else {
            creep.memory.role = 'builder';
        }


		if(creep.memory.role == 'harvester') {
			harvester(creep);
		} else if(creep.memory.role == 'builder') {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if(targets.length) {
	    		if(creep.carry.energy == 0) {
		    		if(Game.spawns.Spawn1.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
					    creep.moveTo(Game.spawns.Spawn1);
		    		}
				}
    			else {
					if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0]);					
					}
				}
			} else {
			   harvester(creep); 
			}
		} else if(creep.memory.role == 'attacker') {
    		if(creep.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
    			creep.moveTo(enemies[0]);		
        	}
        }
	}
}
