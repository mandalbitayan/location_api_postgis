const express = require("express");

const router = express.Router();

const {
    getFloodAffectedRoad
} = require("../controllers/roadController");


router.get(
    "/flood-affected",
    getFloodAffectedRoad
);


module.exports = router;