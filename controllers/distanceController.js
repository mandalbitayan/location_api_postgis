const pool = require("../db/db");

const {validateLocation,validateNearbyQuery} = require("../validators/locationValidator");

// distance location 

const getNearbyLocationWithDistance = async(req,res)=>{
    try{

        const lat = Number(req.query.lat)
        const lng = Number(req.query.lng)
        const radias = Number(req.query.radius)

        const result = await pool.query(
            `select
            id,
            name,
            St_Diatance(
            geom::geography,
            st_setSrid(St_makepoint($1,$2),
            4326
            )::geography
            )as distance_meters
            
            from locations
            where st_dwithin(geom::geography,
            st_setsrid(st_makepoint($1,$2),
            4326
            )::geography,
            $3
            )
            order by distance_meters asc
            `,
            [lat,lng,radius]
        );
        res.json(result.rows);

    }catch(error){
        return res.send(500).json({
            success:false,
            message:"Failed to calculate distance"
        });
    }
}

module.exports = {getNearbyLocationWithDistance}