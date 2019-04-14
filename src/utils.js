/// <reference path="../ScreepsAutocomplete/.d.ts"/>

var utils = {
    all_usable_energy: function() {
        return Game.spawns['Spawn1'].room.energyCapacityAvailable;
    },
    room_name: function(){
        return Object.keys(Game.rooms);
    },
    cal_parts: function(){
        var total_usable_energy = Game.spawns['Spawn1'].room.energyCapacityAvailable;
        var parts_energy = 0;
        for(var i = 0; i < arguments.length; ++i)
        {
            parts_energy += BODYPART_COST[arguments[i]];
        }
        var parts = Math.floor(total_usable_energy / parts_energy);
        var res = [];
        for(var i = 0; i < arguments.length; ++i)
        {
            res = res.concat(Array(parts).fill(arguments[i]));
        }
        return res;
    },
    cursor_occupied: function(pos) {
        var room_name = Object.keys(Game.rooms);
        var res = 0;
        for(var i = -1; i < 2; ++i)
        {
            if(pos.x + i < 0 || pos.x + i >= 50)
                continue;
            for(var j = -1; j < 2; ++j)
            {
                if(pos.y+j < 0 || pos.y +j >= 50)
                    continue;
                var things_on_pos = Game.rooms[room_name].lookAt(pos.x+i, pos.y+j);
                if(things_on_pos.length == 1 && things_on_pos[0].terrain === 'plain') {
                    res = 1;
                }
            }
        }
        return res;
    },
    max_hars: function() {
        var room_name = Object.keys(Game.rooms);
        var sources = Game.rooms[room_name].find(FIND_SOURCES);
        var res = 0;
        for(var k = 0; k < sources.length; ++k)
        {
            for(var i = -1; i < 2; ++i)
            {
                if(sources[k].pos.x + i < 0 || sources[k].pos.x + i >= 50)
                    continue;
                for(var j = -1; j < 2; ++j)
                {
                    if(sources[k].pos.y+j < 0 || sources[k].pos.y +j >= 50)
                        continue;
                    if(Game.rooms[room_name].getTerrain().get(sources[k].pos.x+i, sources[k].pos.y+j) === 0) {
                        res += 1;
                    }
                }
            }
        }
        return res;
    },
    energy_cap: function(creep) {
        return creep.room.energyCapacityAvailable * 10;
    }
}

module.exports = utils