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


app.listen(PORT,()=>{
  console.log(`server is running on podt ${PORT}`)
})