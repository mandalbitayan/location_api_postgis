const pool = require("../db/db");
const validateLocation = require("../validators/locationValidator");

// get get locations
const getLocations = async(req,res)=>{
    try{

        const result = await pool.query(
            `select * from locations order by id`
        )
        res.json(result.rows)

    }catch(error){
        console.error(error);
        return res.status(500).json({
            message:"Failed to fetch location"
        });
    }
};


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
        console.error(error)
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




module.exports = {getLocations,getLocationById,createLocation,updateLocation};