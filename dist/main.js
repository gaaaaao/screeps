/// <reference path="../ScreepsAutocomplete/.d.ts"/>

var utils = require('utils');

var roleHarvester = require('./role/harvester.js');
var roleBuilder = require('./role/builder.js');
var roleUpgrader = require('./role/upgrader.js');

var structureTower = require('./structure/tower.js');

var MAX_HARS = utils.max_hars();
module.exports.loop = function () {
    // Garbage collection
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory: ', name);
        }
    }


    // Creeps
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if (Game.time % 10 == 0)
        console.log('Harvesters: ' + harvesters.length);
    if (harvesters.length < Math.floor(MAX_HARS * 0.8) && Game.spawns['Spawn1'].energy > 200) {
        var newName = 'Har' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(utils.cal_parts(WORK, CARRY, MOVE), newName, { memory: { role: 'harvester' } });
    }

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if (Game.time % 10 == 0)
        console.log('Builders: ' + builders.length);
    if (builders.length * 4 < harvesters.length && Game.spawns['Spawn1'].energy > 200) {
        var newName = 'Bul' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(utils.cal_parts(WORK, CARRY, MOVE), newName, { memory: { role: 'builder' } });
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if (Game.time % 10 == 0)
        console.log('Upgrader: ' + upgraders.length);
    if (upgraders.length * 4 < harvesters.length && Game.spawns['Spawn1'].energy > 200) {
        var newName = 'Upg' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(utils.cal_parts(WORK, CARRY, MOVE), newName, { memory: { role: 'upgrader' } });
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }


    // Structures
    var towers = Game.rooms[utils.room_name()].find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_TOWER;}});
    for(var i = 0; i < towers.length; ++i)
    {
        structureTower.run(towers[i]);
    }
}