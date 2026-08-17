const pool = require("../db/db");

const {validateLocation,validateNearbyQuery} = require("../validators/locationValidator");

// distance location 

const getNearbyLocationWithDistance = async(req,res)=>{
    try{

        const validationError = validateNearbyQuery(req.query);

        if(validationError){
            return res.status(400).json({
                message:validationError
            });
        }

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

        const locations = result.rows.map((row) => {

            return {
                id: row.id,
                name: row.name,
                distance_meters: Number(row.distance_meters),
                distance_km: Number(
                    (row.distance_meters / 1000).toFixed(2) //kilometer
                )
            };

        });

        res.json({
            count:location.length,
            locations:locations
        });

    }catch(error){
        return res.send(500).json({
            success:false,
            message:"Failed to calculate distance"
        });
    }
}

module.exports = {getNearbyLocationWithDistance}