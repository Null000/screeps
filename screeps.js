function harvesterAction(creep) {
    if(creep.carry.energy < creep.carryCapacity) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    }
    else {
        if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns.Spawn1);
        }
    }
}

function builderAction(creep) {
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
        harvesterAction(creep);
    }
}

function attackerAction(creep, enemy) {
    if (enemy) {
        if (enemy && creep.attack(enemy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(enemy);
        }
    } else {
        creep.moveTo(25,25);
    }
}


var counter = 0;

var worker = ["builder", [CARRY, WORK, MOVE]];
var attacker = ["attacker", [MOVE,ATTACK]];
var archer = ["archer", [MOVE, RANGED_ATTACK]];

var died = undefined;


module.exports.loop = function () {
    //Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Worker1' );
    var spawn1 = Game.spawns.Spawn1;

    if (!spawn1) {
        if (!died) {
            died = Game.time;
        }

        console.log("died at " + died);
        return;
    }

    var nextCreep = worker;
    if (counter >= 3) {
        nextCreep = counter % 2 == 0 ? archer: attacker;
    }
    var body = nextCreep[1];
    var role = nextCreep[0];

    if (spawn1.canCreateCreep(body) == 0) {
        var creepName = role + " " + counter;
        console.log("spawning " + role);
        spawn1.createCreep(body, creepName, {
            role: role
        });
        counter++;
    } else {
        //console.log("can't make more creeps");
    }


    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        var enemies = creep.room.find(FIND_HOSTILE_CREEPS);


        if (creep.memory.role == 'harvester') {
            harvesterAction(creep);
        } else if (creep.memory.role == 'builder') {
            builderAction(creep);
        } else if (creep.memory.role == 'attacker' || creep.memory.role == 'archer') {
            var enemy = enemies[0];
            if (enemy && enemy.hits > 1000) {
                enemy = enemies[1];
            }
            attackerAction(creep, enemy);
        }
    }
};