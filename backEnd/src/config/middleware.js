module.exports.dispError = (err, req, res, next) => {
    console.log("Error Handled : ", message);
    let {statusCode = 500, message = "Something Went Wrong"} = err;

    return res.status(statusCode).json({ message });
}