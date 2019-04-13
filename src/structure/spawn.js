var settings = require("settings");
/// <reference path=`${settings.PROJECT_DIR}/ScreepsAutocomplete/.d.ts`/>

var structureSpawn = {

    /** @param {StructureSpawn} spawn **/
    // ACTION: 
    //
    run: function(spawn) {
        var target;
        for(var i = -1; i < 2; ++i)
        {
            if(spawn.pos.x + i < 0 || spawn.pos.x + i >= 50)
                continue;
            for(var j = -1; j < 2; ++j)
            {
                if(spawn.pos.y + j < 0 || spawn.pos.y + j >= 50)
                    continue;
                var creep_on_pos = spawn.room.lookForAt(LOOK_CREEPS, spawn.pos.x+i, spawn.pos.y+j)[0];
                if(typeof creep_on_pos === 'undefined')
                    continue;
                if (typeof target === 'undefined' && creep_on_pos.ticksToLive < 1000)
                {
                    target = creep_on_pos;
                } else if (typeof creep_on_pos !== 'undefined' && creep_on_pos.ticksToLive < 1000 && target.ticksToLive > creep_on_pos.ticksToLive) {
                    target = creep_on_pos;
                }
            }
        }
        if(typeof target !== 'undefined')
            console.log(`renewing creeps: ${spawn.renewCreep(target)}`);
    }
}
module.exports = structureSpawn;
