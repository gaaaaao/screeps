const { ACTION_TRANSFER } = require('settings');
const { ACTION_PICK } = require('settings');
const { ACTION_WITHDRAW } = require('settings');

var { energy_cap } = require('utils');
var {fillable_list} = require('utils');

var roleTemp = {

    /** @param {Creep} creep **/
    // ACTION: 
    // 
    run: function (creep) {
        var cur_action = creep.memory.action;
        var cur_energy = creep.carry.energy;
        var creep_cap = creep.carryCapacity;
        var fill_list = fillable_list(creep, false);
        var stored_energy = creep.room.storage.store[RESOURCE_ENERGY];
        var energy_total = energy_cap(creep);
        var pick_targets = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: (d) => {
                if(d.resourceType == RESOURCE_ENERGY && d.amount < 50) {
                    return false;
                }
                return true;
            }
        });
        // Actions
        if ((pick_targets.length && cur_action == ACTION_TRANSFER && cur_energy == 0)
            || (pick_targets.length && cur_action == ACTION_TRANSFER && cur_energy < creep_cap && !fill_list && stored_energy == energy_total)
            || (pick_targets.length && cur_action != ACTION_TRANSFER && cur_energy < creep_cap)
            || (pick_targets.length && cur_action == ACTION_TRANSFER && cur_energy == 0 && !fill_list)
            || (!pick_targets.length && cur_action == ACTION_TRANSFER && cur_energy == 0 && fill_list && stored_energy == 0)
            || (!pick_targets.length && cur_action == ACTION_PICK && cur_energy == 0 && !fill_list)
            || (!pick_targets.length && cur_action == ACTION_PICK && cur_energy == 0 && fill_list && stored_energy == 0)
            || (!pick_targets.length && cur_action == ACTION_WITHDRAW && cur_energy == 0 && !fill_list)
        ) {
            creep.memory.action = ACTION_PICK;
            creep.say('👌 PickUp');
        } else if ((pick_targets.length && cur_action == ACTION_TRANSFER && cur_energy < creep_cap && !fill_list && stored_energy == energy_total)
            || (pick_targets.length && cur_action == ACTION_TRANSFER && cur_energy < creep_cap && fill_list)
            || (pick_targets.length && cur_action == ACTION_TRANSFER && cur_energy == creep_cap)
            || (pick_targets.length && cur_action != ACTION_TRANSFER && cur_energy == creep_cap)
            || (!pick_targets.length && cur_energy != 0)
        ) {
            creep.memory.action = ACTION_TRANSFER;
            creep.say('⚡ Trans')
        } else if ((!pick_targets.length && cur_action != ACTION_WITHDRAW && cur_energy == 0 && fill_list && stored_energy != 0)
            || (!pick_targets.length && cur_action == ACTION_WITHDRAW && cur_energy == 0 && fill_list)
        ) {
            creep.memory.action = ACTION_WITHDRAW;
            creep.say('🔄 Withdraw')
        }

        // Move
        if (creep.memory.action == ACTION_TRANSFER) {
            if (fill_list.length > 0) {
                if (creep.transfer(fill_list[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(fill_list[0], { visualizePathStyle: { stroke: '#ffffff' } });
                return;
            }
            for(const resourceType in creep.carry) {
                if(creep.transfer(creep.room.storage, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, { visualizePathStyle: { stroke: '#ffffff' } });
                    break;
                }
            }
        } else if (creep.memory.action == ACTION_PICK) {
            if (pick_targets.length) {
                if (creep.pickup(pick_targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(pick_targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else if (creep.memory.action == ACTION_WITHDRAW) {
            if (creep.room.storage) {
                if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
}

module.exports = roleTemp;