/// <reference path="../../ScreepsAutocomplete/.d.ts"/>

const {ACTION_ATTACK} = require('settings');
const {ACTION_IDLE} = require('settings');

var roleDefender = {

    /** @param {Creep} creep **/
    // ACTION: 
    // 
    run: function(creep) {
        // Action selection
        var closestHostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if(creep.memory.action != ACTION_ATTACK && closestHostile) {
            creep.memory.action == ACTION_ATTACK;
            creep.say('⚔ SPARTA!')
        } else if(creep.memory.action == ACTION_ATTACK && !closestHostile) {
            creep.memory.action == ACTION_IDLE;
            creep.say('☮ PLUR')
        }

        if(creep.memory.action == ACTION_ATTACK) {
            if(creep.attack(closestHostile) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestHostile);
            }
        } else if(creep.memory.action == ACTION_IDLE) {
            creep.moveTo(creep.pos.findClosestByRange(FIND_MY_SPAWNS));
        }
    }
}

module.exports = roleDefender;