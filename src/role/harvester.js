/// <reference path="../../ScreepsAutocomplete/.d.ts"/>

var {energy_cap} = require('utils');
var {cursor_occupied} = require('utils');

const {ACTION_HARVEST} = require('settings');
const {ACTION_UPGRADE} = require('settings');
const {ACTION_TRANSFER} = require('settings');

var roleHarvester = {

    /** @param {Creep} creep **/
    // ACTION: 
    // 
    run: function (creep) {
        // Action selection
        var cur_action = creep.memory.action;
        var cur_energy = creep.carry.energy;
        var energy_total = energy_cap(creep);
        var fill_able_list = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                if((structure.structureType == structure.structureType == STRUCTURE_EXTENSION
                || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) && structure.energy == structure.energyCapacity) {
                    return true;
                } else if(structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < energy_total) {
                    return true;
                }
                return false;
            }
        });

        if ((cur_action == ACTION_HARVEST && cur_energy != creep.carryCapacity) ||
            (cur_action != ACTION_HARVEST && cur_energy == 0)) {
            if (cur_action != ACTION_HARVEST) {
                creep.say('🔄 Harvest');
                creep.memory.action = ACTION_HARVEST;
            }
        } else if ((cur_action == ACTION_HARVEST && cur_energy == creep.carryCapacity && fill_able_list.length) ||
            (cur_action != ACTION_HARVEST && cur_energy != 0 && fill_able_list.length)) {
            if (cur_action != ACTION_TRANSFER) {
                creep.say('🔋 Transfer');
                creep.memory.action = ACTION_TRANSFER;
            }
        } else if ((cur_action == ACTION_HARVEST && cur_energy == creep.carryCapacity && !fill_able_list.length) ||
            (cur_action != ACTION_HARVEST && cur_energy != 0 && !fill_able_list.length)) {
            if (cur_action != ACTION_UPGRADE) {
                creep.say('⚡ Upgrade');
                creep.memory.action = ACTION_UPGRADE;
            }
        }

        // Moving
        if (creep.memory.action == ACTION_HARVEST) {
            var sources = creep.room.find(FIND_SOURCES, {
                filter: (source) => {
                    return source.energy > 0;
                }
            });
            for(var i = 0; i < sources.length; ++i) {
                if(creep.harvest(sources[i]) == OK) {
                    return;
                }
            }
            sources.sort(function(a, b) {return cursor_occupied(creep, b.pos) - cursor_occupied(creep, a.pos)});
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
        else if (creep.memory.action == ACTION_TRANSFER) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if((structure.structureType == structure.structureType == STRUCTURE_EXTENSION
                    || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) {
                        return true;
                    } else if(structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < energy_total) {
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
        else if (creep.memory.action == ACTION_UPGRADE) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffaa00" } });
            }
        }
    }
};

module.exports = roleHarvester;