var harvester = require('harvester');
var routeCreep = require('routeCreep');

var counter = 1;

var worker = ["builder", [CARRY, WORK, MOVE]];
var attacker = ["attacker", [ATTACK, MOVE]];


module.exports.loop = function () {
    //Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Worker1' );
    var spawn1 = Game.spawns.Spawn1;
    var nextCreep = worker;
    if (counter % 3 == 0) {
        nextCreep = attacker;
    }
    var body = nextCreep[1];

    if (spawn1.canCreateCreep(body) == 0) {
        var creepName = "Slave" + counter;
        console.log("spawning");
        spawn1.createCreep(body, creepName, {
            role: nextCreep[0]
        });
        counter++;
    } else {
        //console.log("can't make more creeps");
    }


    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        var enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length) {


            if (creep.memory.role == 'harvester') {
                harvester(creep);
            } else if (creep.memory.role == 'builder') {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (creep.carry.energy == 0) {
                        if (Game.spawns.Spawn1.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.spawns.Spawn1);
                        }
                    }
                    else {
                        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    }
                } else {
                    harvester(creep);
                }
            } else if (creep.memory.role == 'attacker') {
                if (enemies.length) {
                    if (creep.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(enemies[0]);
                    }
                }
            }
        }
    }
}