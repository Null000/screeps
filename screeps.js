var harvester = require('harvester');

var counter = 0

var creepBody = [WORK,MOVE,CARRY]
module.exports.loop = function () {
    //Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Worker1' );
    var spawn1 = Game.spawns.Spawn1;
    if (spawn1.canCreateCreep(creepBody) == 0) {
        var creepName = "Slave"+counter;
        console.log("spawning")
        spawn1.createCreep(creepBody, creepName);
        counter++;
    } else {
        console.log("can't make more creeps");
    }


	for(var name in Game.creeps) {
		var creep = Game.creeps[name];

        if(!creep.memory.role) {
            creep.memory.role = 'harvester';
        }


		if(creep.memory.role == 'harvester') {
			harvester(creep);
		}

		if(creep.memory.role == 'builder') {
		
			if(creep.carry.energy == 0) {
				if(Game.spawns.Spawn1.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
					creep.moveTo(Game.spawns.Spawn1);				
				}
			}
			else {
				var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				if(targets.length) {
					if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0]);					
					}
				}
			}
		}
		
		if(creep.memory.role == 'guard') {
        	var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        	if(targets.length) {
        		if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
        			creep.moveTo(targets[0]);		
        		}
        	}
        }
	}
}
