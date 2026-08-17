const express = require("express")

const router = express.Router();

const {
    getNearbyLocationWithDistance
} = require("../controllers/distanceController");

router.get("/nearby",getNearbyLocationWithDistance);

module.exports = router;