import { Express, Request, Response, NextFunction } from 'express';

const setupMiddleware = (app: Express) => {
  // Define other routes and middleware here

  // 404 Handler for undefined routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "This Route Does Not Exist" });
  });

  // General Error Handling Middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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

export default setupMiddleware;
