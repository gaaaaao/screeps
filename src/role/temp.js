/// <reference path="../../ScreepsAutocomplete/.d.ts"/>

var ACTION_PICK = 1
var ACTION_TRANSFER = 3;

var roleTemp = {

    /** @param {Creep} creep **/
    // ACTION: 
    // 
    run: function (creep) {
        var cur_action = creep.memory.action;
        var cur_energy = creep.carry.energy;
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if (cur_action != ACTION_PICK && cur_energy == 0) {
            creep.memory.action = ACTION_PICK;
            creep.say('👌 PickUp');
        }
        else if (cur_action == ACTION_PICK && cur_energy == creep.carryCapacity) {
            creep.memory.action = ACTION_TRANSFER;
            creep.say('🔋 Transfer');
        }

        if (creep.memory.action == ACTION_TRANSFER) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if((structure.structureType == structure.structureType == STRUCTURE_EXTENSION
                    || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) {
                        return true;
                    } else if(structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < 100000) {
                        return true;
                    }
                    return false;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else if(creep.memory.action == ACTION_PICK){
            var targets = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (d) => {
                    return d.amount >= 50;
                }
            });

            if (targets.length) {
                if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
}

module.exports = roleTemp;