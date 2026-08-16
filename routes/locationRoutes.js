const express = require("express");

const router = express.Router();

const validateLocation = require("../validators/locationValidator");

const {getLocations,getLocationById,createLocation,updateLocation,deleteLocation} = require("../controllers/locationController");


// get all locations route
router.get("/locations",getLocations);

router.get("locations/:id",getLocationById);

router.post("/createLocation",createLocation)

router.put("/location/:id",updateLocation)

router.delete("/location/:id",deleteLocation)



module.exports = router;