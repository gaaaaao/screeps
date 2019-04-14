var settings = require("settings");
/// <reference path=`${settings.PROJECT_DIR}/ScreepsAutocomplete/.d.ts`/>

var ACTION_ATTACK = 1;
var ACTION_REPAIR = 2;

var structureTower = {

    /** @param {Tower} tower **/
    // ACTION: 
    // 
    run: function(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && structure.hits < tower.room.energyCapacityAvailable * 2
        })
        if(closestDamagedStructure)
        {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile)
        {
            tower.attack(closestHostile);
        }
    }
}

module.exports = structureTower;