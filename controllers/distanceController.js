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
};


// get district between locations
const getDistanceBetweenLocations = async (req, res) => {

    try {

        const fromId = Number(req.query.from);
        const toId = Number(req.query.to);


        if (
            Number.isNaN(fromId) ||
            Number.isNaN(toId)
        ) {
            return res.status(400).json({
                message: "from and to must be valid numbers"
            });
        }


        if (fromId <= 0 || toId <= 0) {
            return res.status(400).json({
                message: "from and to must be greater than 0"
            });
        }


        const result = await pool.query(
            `
            SELECT
                from_location.id AS from_id,
                from_location.name AS from_name,

                to_location.id AS to_id,
                to_location.name AS to_name,

                ST_Distance(
                    from_location.geom::geography,
                    to_location.geom::geography
                ) AS distance_meters

            FROM locations AS from_location

            CROSS JOIN locations AS to_location

            WHERE from_location.id = $1
              AND to_location.id = $2
            `,
            [fromId, toId]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "One or both locations not found"
            });

        }


        const row = result.rows[0];


        const distanceMeters = Number(
            row.distance_meters
        );


        res.json({

            from: {
                id: row.from_id,
                name: row.from_name
            },

            to: {
                id: row.to_id,
                name: row.to_name
            },

            distance_meters: distanceMeters,

            distance_km: Number(
                (distanceMeters / 1000).toFixed(2)
            )

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to calculate distance"
        });
    }
};

module.exports = {getNearbyLocationWithDistance,getDistanceBetweenLocations}