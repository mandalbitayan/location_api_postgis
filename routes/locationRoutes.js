const express = require("express");

const router = express.Router();

const validateLocation = require("../validators/locationValidator");

const {getLocations,getLocationById,createLocation,updateLocation,deleteLocation,getNearByLocation} = require("../controllers/locationController");


// get all locations route
router.get("/locations",getLocations);

// get location as geojson
// router.get("/locationsjson",getLocationsGeoJSON);

router.get("locations/:id",getLocationById);

router.post("/createLocation",createLocation);

router.put("/location/:id",updateLocation);

router.delete("/location/:id",deleteLocation);

router.get("/locations/nearby",getNearByLocation);


module.exports = router;