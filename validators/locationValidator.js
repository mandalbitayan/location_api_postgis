function validateLocation(data) {

    if (!data.name) {
        return "Name is required";
    }

    if (data.latitude === undefined) {
        return "Latitude is required";
    }

    if (data.longitude === undefined) {
        return "Longitude is required";
    }

    if (typeof data.latitude !== "number") {
        return "Latitude must be a number";
    }

    if (typeof data.longitude !== "number") {
        return "Longitude must be a number";
    }

    if (data.latitude < -90 || data.latitude > 90) {
        return "Latitude must be between -90 and 90";
    }

    if (data.longitude < -180 || data.longitude > 180) {
        return "Longitude must be between -180 and 180";
    }

    return null;
};


// validation nearby query function 

function validateNearbyQuery(data) {

    const lat = Number(data.lat);
    const lng = Number(data.lng);
    const radius = Number(data.radius);


    if (
        Number.isNaN(lat) ||
        Number.isNaN(lng) ||
        Number.isNaN(radius)
    ) {
        return "lat, lng and radius must be valid numbers";
    }


    if (lat < -90 || lat > 90) {
        return "Latitude must be between -90 and 90";
    }


    if (lng < -180 || lng > 180) {
        return "Longitude must be between -180 and 180";
    }


    if (radius <= 0) {
        return "Radius must be greater than 0";
    }
        return null;
};


// only for limit data query
function validateCoordinateQuery(data){

    const lat = Number(data.lat);
    const lng = Number(data.lng);
    
    if(
        Number.isNaN(lat) ||
        Number.isNaN(lng)
    ){
        return res.status(400).json({
            message:"Location must be in number"
        })
    }

    if(lat <-90 || lat >90){
        return "Latitude must be between -90 to 90"
    };
    if(lng <-180 || lng >180){
        return "Longitude must be between -180 to 180"
    }
    return null
};


// bounding box validation
function validateBBoxQuery(data){

    const minlng = Number(data.minlng);
    const minlat = Number(data.minlat);
    const maxlng = Number(data.maxlng);
    const maxlag = Number(data.maxlng);

    if(
        Number.isNan(minlng) ||
        Number.isNaN(minlat) ||
        Number.isNaN(maxlng) ||
        Number.isNaN(maxlng)
    ){
        return "Bounding box coordinates must be valid numbers";
    }
    if(minlng <-180 || minlng > 180){
        return "minlng must be between -180 and 180"
    }
    if(maxlng <-180 || maxlng >180){
        return "maxlng must be between -180 and 180"
    }
    if(minlat <-90 || minlat >90){
        return "minlat must be between -90 and 90"
    }
    if(maxlat <-90 || maxlat >90){
        return "maxlat must be between -90 and 90"
    }
    return null
}


module.exports = {validateLocation,validateNearbyQuery,validateCoordinateQuery,validateBBoxQuery};