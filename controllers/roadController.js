const pool = require("../db/db")

const getFloodAffectedRoad = async(req,res)=>{
    try{

        const result = await(
            `
            select
            r.id,
            r.name,
            st_asgeojson(r.geom) as geometry
            from roads as r
            join flood_zones as f

            on st_intersects(
                r.geom,
                f.geom
            )
                order by r.id
            `
        );

        const features = result.rows.map((row)=>{

            return{
                type:"Feature",

            properties:{
                id:row.id,
                name:row.name
            },

            geometry : JSON.parse(row.geometry),
            };
            
        });

        res.json({
            type:"FeatureCollection",
            features:features
        });


    }catch(error){
        console.error(error)
        res.status(500).json({
            message:"Failed to find flood affected roads"
        });
    }
}

module.exports = {getFloodAffectedRoad}