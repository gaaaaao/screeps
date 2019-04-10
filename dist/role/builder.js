var settings = require("settings");
/// <reference path=`${settings.PROJECT_DIR}/ScreepsAutocomplete/.d.ts`/>

var ACTION_WITHDRAW = 0;
var ACTION_BUILD = 1;

var roleBuilder = {

    /** @param {Creep} creep **/
    // ACTION: 
    // 
    run: function (creep) {
        var cur_action = creep.memory.action;
        var cur_energy = creep.carry.energy;
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if (cur_action != ACTION_WITHDRAW && cur_energy == 0 && harvesters.length > 3) {
            creep.memory.action = ACTION_WITHDRAW;
            creep.say('🔄 Withdraw');
        }
        else if (cur_action == ACTION_WITHDRAW && cur_energy == creep.carryCapacity) {
            creep.memory.action = ACTION_BUILD;
            creep.say('🚧 build');
        }

        if (creep.memory.action == ACTION_BUILD) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE)
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else if(creep.memory.action == ACTION_WITHDRAW){
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy > 25
                }
            });
            if (targets.length) {
                if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
}

module.exports = roleBuilder;