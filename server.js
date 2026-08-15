const express = require("express")
const pool = require("./db/db")

const locationRoutes = require("./routes/locationRoutes")

const app = express()

const PORT = 3000;

app.use(express.json());

// test route for database connection 

app.get("/db-test",async(req,res)=>{
  const result = await pool.query("SELECT NOW()")

  res.json({
    message:"Database connected",
    time:result.rows[0].now
  });
});


app.get("/",(req,res)=>{
    res.json({
        message:"Gis location api is running"
    });
});

app.use("/api",locationRoutes)

// GET ALL LOCATIONS
app.get("/locations",async(req,res)=>{
    try{
         const result = await pool.query(
        "select * from locations order by id"
    )
    res.json(result.rows)

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false
        });
    }
   
});



// get location by id

app.get("/locations/:id",async(req,res)=>{
    try{
        const id = parseInt(req.params.id);

        if(Number.isNaN(id)){
            return res.status(400).json({
                message:"invalid location ID"
            });
        }

        const result = await pool.query(
            "select * from locations where id=$1",[id]
        );

        if(result.rows.length === 0){
          return res.status(404).json({
            message:"Location not found"
          });
        }
        res.json(result.rows[0]);

    }catch(error){

      console.error(error)

      res.status(500).json({
        message:"Failed to fetch location"
      });

    }
});



// create location

app.post("/locations",async(req,res)=>{
  try{

    const {name,latitude,longitude} = req.body;

    if(!name){
      return res.status(400).json({
        message:"Name is required"
      })
    };

    if(latitude === undefined){
      return res.status(400).json({
        message:"Latitude is required"
      })
    };

    if(longitude === undefined){
      return res.status(400).json({
        message:"Longitude must be between -90 to +90"
      })
    };

    if(latitude <-90 || latitude >90){
      return res.status(400).json({
        message:"Longitude must be between -180 to +180"
      });
    }

    const result = await pool.query(
      `insert into locations
      (name,latitude,longitude)
      values
      ($1,$2,$3)
      returning *`,
      [name,latitude,longitude]
    );
    res.status(201).json(result.rows[0])

  }catch(error){
    console.log(error);

    res.status(500).json({
      message:"Failed to create location"
    });
  }
});



// update locations

app.put("/locations/:id",async(req,res)=>{
  try{
    const id = parseInt(req.params.id);

  if(Number.isNaN(id)){
    return res.status(400).json({
      message:"Invalid location id"
    })
  }

  const {name,latitude,longitude} = req.body;

   if(!name){
      return res.status(400).json({
        message:"Name is required"
      })
    };

    if(latitude === undefined){
      return res.status(400).json({
        message:"Latitude is required"
      })
    };

    if(longitude === undefined){
      return res.status(400).json({
        message:"Longitude must be between -90 to +90"
      })
    };

    if(latitude <-90 || latitude >90){
      return res.status(400).json({
        message:"Longitude must be between -180 to +180"
      });
    }

    const result = await pool.query(
      `update locations
      set 
      name = $1,
      latitude =$2,
      longitude = $3
      where id = $4
      returning *`,
      [name,latitude,longitude,id]
    );

    if(result.rows.length === 0){
      return res.status(404).json({
        message:"location not found"
      });
    }

    res.json(result.rows[0])

  }catch(error){
    console.error(error)

    return res.status(500).json({
      message:"Failed to update locations"
    })
  }
});


// delete locations

app.delete("/locations/:id",async(req,res)=>{
  try{
    const id = parseInt(req.params.id)

  if(Number.isNaN(id)){
    return res.status(400).json({
      message:"Invalid location id"
    });
  }

  const result = await pool.query(
    `delete from locations where id = $1 returning *`,[id]
  );

  if(result.row.length === 0){
    return res.status(404).json({
      message:"Location not found"
    })
  };

  res.status(204).send()

  }catch(error){
    console.error(error);
    res.status(500).json({
      message: "Failed to delete location"
    });
  }
});


app.listen(PORT,()=>{
  console.log(`server is running on podt ${PORT}`)
})