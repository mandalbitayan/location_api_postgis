const express = require("express")

const router = express.Router();

const {
    getNearbyLocationWithDistance,
    getDistanceBetweenLocations,
    getNearestLocation
} = require("../controllers/distanceController");

router.get("/nearby",getNearbyLocationWithDistance);

router.get("/between",getDistanceBetweenLocations);

route.get("/nearest",getNearestLocation);

module.exports = router;