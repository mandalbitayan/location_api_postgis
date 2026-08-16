const express = require("express");

const router = express.Router();

const validateLocation = require("../validators/locationValidator");

const {getLocations,getLocationById,createLocation,updateLocation,deleteLocation} = require("../controllers/locationController");


// get all locations route
router.get("/locations",getLocations);

router.get("locations/:id",getLocationById);

route.post("/createLocation",createLocation)

route.put("/location/:id",updateLocation)

route.delete("/location/:id",deleteLocation)



module.exports = router;