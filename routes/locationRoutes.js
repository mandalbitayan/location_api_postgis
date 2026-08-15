const express = require("express");

const router = express.Router();

const validateLocation = require("../validators/locationValidator");

const {getLocations} = require("../controllers/locationController");


// get all locations route
router.get("/locations",getLocations)



module.exports = router;