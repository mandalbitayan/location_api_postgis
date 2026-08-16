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
}

module.exports = validateLocation;