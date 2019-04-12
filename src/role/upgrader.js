var settings = require("settings");
/// <reference path=`${settings.PROJECT_DIR}/ScreepsAutocomplete/.d.ts`/>

var utils = require('utils');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
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
            sources.sort(function(a, b) {return utils.cursor_occupied(b.pos) - utils.cursor_occupied(a.pos)});
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
};

module.exports = roleUpgrader;