/// <reference path="../ScreepsAutocomplete/.d.ts"/>

var utils = require('utils');

var roleGeneral = require('role_general');

var structureTower = require('structure_tower');
var structureSpawn = require('structure_spawn');

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
    if (harvesters.length < Math.floor(MAX_HARS * 0.8) && Game.spawns['Spawn1'].energy > Game.spawns['Spawn1'].energyCapacity * 0.5) {
        var newName = 'Har' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(utils.cal_parts(WORK, CARRY, MOVE), newName, { memory: { role: 'harvester' } });
    }

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if (Game.time % 10 == 0)
        console.log('Builders: ' + builders.length);
    if (builders.length * 4 < harvesters.length && harvesters.length == Math.floor(MAX_HARS * 0.8) && Game.spawns['Spawn1'].energy > Game.spawns['Spawn1'].energyCapacity * 0.8) {
        var newName = 'Bul' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(utils.cal_parts(WORK, CARRY, MOVE), newName, { memory: { role: 'builder' } });
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if (Game.time % 10 == 0)
        console.log('Upgrader: ' + upgraders.length);
    if (upgraders.length * 4 < harvesters.length && harvesters.length == Math.floor(MAX_HARS * 0.8) && Game.spawns['Spawn1'].energy > Game.spawns['Spawn1'].energyCapacity * 0.8) {
        var newName = 'Upg' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(utils.cal_parts(WORK, CARRY, MOVE), newName, { memory: { role: 'upgrader' } });
    }

    var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');
    if (Game.time % 10 == 0)
        console.log('Healer: ' + healers.length);
    if (healers.length * 4 < harvesters.length && harvesters.length == Math.floor(MAX_HARS * 0.8) && Game.spawns['Spawn1'].energy > Game.spawns['Spawn1'].energyCapacity * 0.8) {
        var newName = 'Hel' + Game.time;
        console.log('Spawning new healer: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(utils.cal_parts(TOUGH, HEAL, MOVE, MOVE, MOVE), newName, { memory: { role: 'healer' } });
    }

    var temps = _.filter(Game.creeps, (creep) => creep.memory.role == 'temp');
    if (Game.time % 10 == 0)
        console.log('Temp: ' + temps.length);
    if (temps.length * 4 < harvesters.length && harvesters.length == Math.floor(MAX_HARS * 0.8) && Game.spawns['Spawn1'].energy > Game.spawns['Spawn1'].energyCapacity * 0.8) {
        var newName = 'Tmp' + Game.time;
        console.log('Spawning new temp: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(utils.cal_parts(CARRY, MOVE), newName, { memory: { role: 'temp' } });
    }


    // Creeps
    for (var name in Game.creeps) {
        roleGeneral.run(Game.creeps[name]);
    }

    // Structures
    for(var name in Game.structures)
    {
        var structure = Game.structures[name];
        if(structure.structureType == STRUCTURE_TOWER)
            structureTower.run(structure);
        else if(structure.structureType == STRUCTURE_SPAWN)
            structureSpawn.run(structure);
    }
}