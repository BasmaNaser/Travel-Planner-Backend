// function globalErrorHandling(err,req,res,next){
//     let message = err.message || 'Internal Server Error'
//     let statusCode = err.statusCode || 500
//     res.status(statusCode).json({message:message})
// }

// module.exports = globalErrorHandling

function globalErrorHandling(err, req, res, next) {
  console.log("GLOBAL ERROR:", err);

  let message = err.message || "Internal Server Error";
  let statusCode = err.statusCode || 500;

  res.status(statusCode).json({ message: message });
}

module.exports = globalErrorHandling;
