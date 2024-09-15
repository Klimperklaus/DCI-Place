// middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    
    res.json({
      message: err.message,
      // nur in der Entwicklungsumgebung den Stacktrace senden
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  export default errorHandler;
  
  
  
  
  
  
  
  