var settings = require("settings");
/// <reference path=`${settings.PROJECT_DIR}/ScreepsAutocomplete/.d.ts`/>

var roleHarvester = require('role_harvester');
var roleBuilder = require('role_builder');
var roleUpgrader = require('role_upgrader');
var roleHealer = require('role_healer');
var roleTemp = require('role_temp')
var ACTION_IDLE = 0
var ACTION_RENEW = -1

var roleGeneral = {

    /** @param {Creep} creep **/
    // ACTION: 
    // 
    run: function(creep) {
        if(creep.memory.action == ACTION_RENEW && creep.ticksToLive < 800)
        {
            creep.moveTo(creep.room.find(FIND_MY_SPAWNS)[0], { visualizePathStyle: { stroke: '#ffffff' }});
        } else if(creep.ticksToLive < 300) {
            creep.memory.action = ACTION_RENEW;
            creep.moveTo(creep.room.find(FIND_MY_SPAWNS)[0], { visualizePathStyle: { stroke: '#ffffff' }});
        } else if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if(creep.memory.role == 'healer') {
            roleHealer.run(creep);
        } else if(creep.memory.role == 'temp') {
            roleTemp.run(creep);
        }
    }
}

module.exports = roleGeneral