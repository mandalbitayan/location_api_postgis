const express = require("express");

const router = express.Router();

const validateLocation = require("../validators/locationValidator");

const {getLocations,getLocationById,createLocation,updateLocation,deleteLocation,getNearByLocation,getLocationByBBox} = require("../controllers/locationController");


// get all locations route
router.get("/locations",getLocations);

// get location as geojson
// router.get("/locationsjson",getLocationsGeoJSON);

router.get("/locations/bbox",getLocationByBBox)

router.get("locations/:id",getLocationById);

router.post("/createLocation",createLocation);

router.put("/locations/:id",updateLocation);

router.delete("/locations/:id",deleteLocation);

router.get("/locations/nearby",getNearByLocation);



module.exports = router;