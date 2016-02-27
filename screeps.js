function harvesterAction(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    } else {
        if (creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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
        if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(enemy);
        }
    } else {
        creep.moveTo(25, 25);
    }
}

function archerAction(creep, enemy) {
    if (enemy) {
        if (creep.rangedAttack(enemy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(enemy);
        }
    } else {
        creep.moveTo(25, 25);
    }
}

function healerAction(creep) {
    var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: function (object) {
            return object.hits < object.hitsMax;
        }
    });
    if (target) {
        if (creep.heal(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
        creep.moveTo(25, 25);
    }
}


var counter = 0;

var worker = ["builder", [CARRY, WORK, MOVE]];
var attacker = ["attacker", [MOVE, ATTACK]];
var archer = ["archer", [MOVE, RANGED_ATTACK]];
var healer = ["healer", [MOVE, HEAL]];

var died = undefined;

var plan = [attacker, archer, attacker, healer];

module.exports.loop = function () {
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
        nextCreep = plan[(counter - 3) % plan.length];
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
        var enemies = creep.room.find(FIND_HOSTILE_CREEPS).filter(function (enemy) {
            return enemy.hits < 1000;
        });


        if (creep.memory.role == 'harvester') {
            harvesterAction(creep);
        } else if (creep.memory.role == 'builder') {
            builderAction(creep);
        } else if (creep.memory.role == 'attacker' || creep.memory.role == 'archer') {
            var enemy = creep.pos.findClosestByRange(enemies);

            if (creep.memory.role == 'attacker') {
                attackerAction(creep, enemy);
            } else {
                archerAction(creep, enemy);
            }
        } else if (creep.memory.role == "healer") {
            healerAction(creep);
        }
    }
};