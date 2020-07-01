var settings = require("settings");
var utils = require('utils');

var ACTION_WITHDRAW = 1;
var ACTION_UPGRADE = 2;

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.action == ACTION_UPGRADE && creep.carry.energy == 0) {
            creep.memory.action = ACTION_WITHDRAW;
            creep.say('🔄 harvest');
        }
        if(creep.memory.action != ACTION_UPGRADE && creep.carry.energy == creep.carryCapacity) {
            creep.memory.action = ACTION_UPGRADE;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.action == ACTION_UPGRADE) {
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
            sources.sort(function(a, b) {return utils.cursor_occupied(creep, b.pos) - utils.cursor_occupied(creep, a.pos)});
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
};

module.exports = roleUpgrader;