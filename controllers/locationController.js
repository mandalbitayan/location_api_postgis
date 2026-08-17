const pool = require("../db/db");
const {validateLocation,validateNearbyQuery} = require("../validators/locationValidator");

// // get get locations
// const getLocations = async(req,res)=>{
//     try{

//         const result = await pool.query(
//             `select * from locations order by id`
//         )
//         res.json(result.rows)

//     }catch(error){
//         console.error(error);
//         return res.status(500).json({
//             message:"Failed to fetch location"
//         });
//     }
// };


// get all location features as geojson (new)

const getLocations= async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                name,
                ST_AsGeoJSON(geom) AS geometry
            FROM locations
            ORDER BY id
        `);

        const features = result.rows.map((row) => {

            return {
                type: "Feature",

                properties: {
                    id: row.id,
                    name: row.name
                },

                geometry: JSON.parse(row.geometry)
            };

        });

        res.json({
            type: "FeatureCollection",
            features: features
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch locations"
        });
    }
};


// get nearby location

const getNearByLocation = async(req,res)=>{
    try{

        const validationError = validateNearbyQuery(req.query);

        if(validationError){
            return res.status(400).json({
                message:validationError
            });
        }

        const lat = Number(req.query.lat);
        const lng = Number(req.query.lng);
        const radius = Number(req.query.radius);

        const result = await pool.query(
            `select
            id,
            name,
            st_asgeojson(geom) as geometry
            from locations
            where st_dwithin(
            geom:geography,
            st_setsrid(
            st_makepoint($1,$2),
            4326
            )::geography,
            $3
            )order by id
            `,
            [lng,lat,radiun]
        );

        const features = result.rows.map((row)=>{

            return{
                type:"Feature",

                properties:{
                    id:row.id,
                    name:row.name
                },

                geometry : JSON.parse(row.geometry)
            };
        });

        res.json({
            type:"FeatureCollection",
            feature:features
        });


    }catch(error){
        console.log(error)

        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}




// get location by id
const getLocationById = async(req,res)=>{
    try{
        const id = parseInt(req.params.id);

        if(Number.isNaN(id)){
            return res.status(401).json({
                message:"Invalid location id"
            });
        };

        const result = await pool.query(
            `select * from locations where id = $1`,
            [id]
        );

        if(result.rows.length === 0){
            return res.status(401).json({
                message:"location not found"
            });
        }

        res.json(result.rows[0])

    }catch(error){
        console.error(error);

        res.status(500).json({
            success:false,
            message:"Failed to fetch location"
        });
    }
   
};


// create new data 

const createLocation = async(req,res)=>{

    try{
        const error = validateLocation(req.body);

        if(error){
            return res.status(400).json({
                message:error
            })
        };


        const{name,latitude,longitude} = req.body;

        const result = await pool.query(
            `insert into locations(name,latitude,longitude)
            values ($1,$2,$3)
            returning *
            `,
            [name,latitude,longitude]
        );

        res.status(201).json(result.rows[0]);


    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create locations"
        })
    }

}

// update location

const updateLocation = async(req,res)=>{
    try{

        const id = parseInt(req.params.id);

        if(Number.isNaN(id)){
            return res.status(400).json({
                message:"Location id invalid"
            })
        };

        const error = validateLocation(req.body);

        if(error){
            return res.status(400).json({
                message:error
            });
        };

        const {name,latitude,longitude} = req.body;

        const result = await pool.query(
            `update locations
            set name = $1,
            latitude = $2,
            longitude = $3
            where id = $4
            returning *`,
            [name,latitude,longitude,id]
        )

        if(result.rows.length === 0){
            return res.status(404).json({
                message:"location not found"
            });
        }

        res.json(result.rows[0]);

    }catch(error){
        console.error(error);
        return res.status(500).json({
            message:"Failed to fetch location"
        });
    }
};


// delete Location 

const deleteLocation = async(req,res)=>{
    try{

        const id = parseInt(req.params.id);

        if(Number.isNaN(id)){
            return res.status(404).json({
                success:false,
                message:"Invalid location id" 
            })
        };

        const result = await pool.query(`
            delete from location where id = $1 returning *`,
            [id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
                success:false,
                message:"Location not found"
            });
        };

        res.status(202).send()

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"failed to delete location "
        })
    }
}




module.exports = {getLocations,getLocationById,createLocation,updateLocation,deleteLocation,getNearByLocation};