module.exports.dispError = (err, req, res, next) => {
    let {statusCode = 500, message = "Something Went Wrong"} = err;
    console.log("Error handled:", message);

    return res.status(statusCode).json({ message });
}