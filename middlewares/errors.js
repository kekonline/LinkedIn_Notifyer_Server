module.exports = (app) => {
  // Define other routes and middleware here

  // 404 Handler for undefined routes
  app.use((req, res, next) => {
    res.status(404).json({ message: "This Route Does Not Exist" });
  });

  // General Error Handling Middleware
  app.use((err, req, res, next) => {
    // Handle specific errors before general logging
    if (err.status === 401) {
      res.status(401).json({ errorMessage: "Token Does Not Exist Or Is Invalid" });
      return;
    }

    // Log error for debugging purposes
    console.error("ERROR", req.method, req.path, err);

    // Only respond if headers haven't been sent
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error. Check The Server Console" });
    }
  });
};

