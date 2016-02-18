var harvester = require('harvester');
var routeCreep = require('routeCreep');

var counter = 1;

var worker = ["builder", [CARRY, WORK, MOVE]];
var attacker = ["attacker", [ATTACK, MOVE]];


module.exports.loop = function () {
    //game.spawns.spawn1.createcreep( [work, carry, move], 'worker1' );
    var spawn1 = game.spawns.spawn1;
    var nextcreep = worker;
    if (counter % 3 == 0) {
        nextcreep = attacker;
    }
    var body = nextcreep[1];

    if (spawn1.cancreatecreep(body) == 0) {
        var creepname = "slave" + counter;
        console.log("spawning");
        spawn1.createcreep(body, creepname, {
            role: nextcreep[0]
        });
        counter++;
    } else {
        //console.log("can't make more creeps");
    }


    for (var name in game.creeps) {
        var creep = game.creeps[name];

        var enemies = creep.room.find(find_hostile_creeps);


        if (creep.memory.role == 'harvester') {
            harvester(creep);
        } else if (creep.memory.role == 'builder') {
            var targets = creep.room.find(find_construction_sites);
            if (targets.length) {
                if (creep.carry.energy == 0) {
                    if (game.spawns.spawn1.transferenergy(creep) == err_not_in_range) {
                        creep.moveto(game.spawns.spawn1);
                    }
                }
                else {
                    if (creep.build(targets[0]) == err_not_in_range) {
                        creep.moveto(targets[0]);
                    }
                }
            } else {
                harvester(creep);
            }
        } else if (creep.memory.role == 'attacker') {
            if (enemies.length) {
                if (creep.attack(enemies[0]) == err_not_in_range) {
                    creep.moveto(enemies[0]);
                }
            }
        }
    }
};