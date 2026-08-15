const {Pool} = require("pg")

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"gis_api",
    password:"743428",
    port:5434
});

module.exports = pool;