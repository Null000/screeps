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

function workerAction(creep) {
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

var worker1 = ["worker", [CARRY, WORK, MOVE]];
var worker2 = ["worker", [WORK, CARRY, WORK, MOVE]];
var attacker = ["attacker", [MOVE, ATTACK, MOVE, ATTACK]];
var archer = ["archer", [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK]];
var healer = ["healer", [MOVE, HEAL]];

var died = undefined;
var previousCreepCount = {};

var plan0 = [worker1, worker2, worker2, attacker];
var plan = [attacker, archer, attacker, archer, healer];

module.exports.loop = function () {
    var spawn1 = Game.spawns.Spawn1;
    var time = Game.time;

    if (!spawn1) {
        if (!died) {
            died = time;
        }

        console.log("died at " + died);
        return;
    }

    if (time % 50 == 0) {
        console.log(time);
    }

    var creepCount = {
        worker: 0,
        attacker: 0,
        archer: 0,
        healer: 0
    };


    var totalCreeps = 0;
    for (var name in Game.creeps) {
        totalCreeps++;

        var creep = Game.creeps[name];
        var enemies = creep.room.find(FIND_HOSTILE_CREEPS).filter(function (enemy) {
            return enemy.hits < 5000;
        });

        var creepRole = creep.memory.role;
        creepCount[creepRole]++;

        if (creepRole == 'harvester') {
            harvesterAction(creep);
        } else if (creepRole == 'worker') {
            workerAction(creep);
        } else if (creepRole == "healer") {
            healerAction(creep);
        } else {
            var enemy = creep.pos.findClosestByRange(enemies);

            if (creepRole == 'attacker') {
                attackerAction(creep, enemy);
            } else {
                archerAction(creep, enemy);
            }
        }
    }

    if (previousCreepCount && !_.isEqual(creepCount, previousCreepCount)) {
        console.log(JSON.stringify(creepCount));
    }
    previousCreepCount = creepCount;

    var nextCreep = worker2;
    if (totalCreeps < plan0.length) {
        nextCreep = plan0[totalCreeps];
    } else if (creepCount.worker >= 4) {
        nextCreep = plan[(totalCreeps - 3) % plan.length];
    }
    var body = nextCreep[1];
    var role = nextCreep[0];

    if (spawn1.canCreateCreep(body) == 0) {
        console.log("spawning " + role);
        spawn1.createCreep(body, null, {
            role: role
        });
    }
};