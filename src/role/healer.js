var settings = require("settings");
/// <reference path=`${settings.PROJECT_DIR}/ScreepsAutocomplete/.d.ts`/>

const {ACTION_HEAL} = require('settings');

var roleHealer = {

    /** @param {Creep} creep **/
    // ACTION: 
    // 
    run: function (creep) {
        if(creep.memory.action != ACTION_HEAL)
            creep.memory.action = ACTION_HEAL;

        if(creep.memory.action == ACTION_HEAL)
        {
            var targets = creep.room.find(FIND_CREEPS, {
                filter: (creep) => {
                    return (creep.my && creep.hits < creep.hitsMax);
                }
            });
            if (targets.length) {
                if(creep.heal(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
}

module.exports = roleHealer;