// const router = require("express").Router();
// const authentication = require("../middlewares/authentication.js");
// const userController = require('../controllers/user.controller');

// router.get("/gettoken", userController.getToken);

// // login, signin, verify
// const authRouter = require("./auth.routes")
// router.use("/auth", authentication, authRouter)

// // searchTerm routes
// const searchTermRouter = require("./searchTerm.routes")
// router.use("/searchterm", authentication, searchTermRouter)

// // job routes
// const jobRouter = require("./jobListing.routes.js")
// router.use("/job", authentication, jobRouter)

// module.exports = router;




// const router = require("express").Router();
// const { authentication, checkUserExistence } = require("../middlewares/authentication.js");
// const userController = require('../controllers/user.controller');

// router.get("/gettoken", userController.getToken);

// // login, signin, verify
// const authRouter = require("./auth.routes")
// router.use("/auth", authentication, checkUserExistence, authRouter)

// // searchTerm routes
// const searchTermRouter = require("./searchTerm.routes")
// router.use("/searchterm", authentication, checkUserExistence, searchTermRouter)

// // job routes
// const jobRouter = require("./jobListing.routes.js")
// router.use("/job", authentication, checkUserExistence, jobRouter)

// module.exports = router;



const router = require("express").Router();
const { authentication, checkUserExistence } = require("../middlewares/authentication.js");
const userController = require('../controllers/user.controller');

router.get("/gettoken", userController.getToken);

// login, signin, verify
const authRouter = require("./auth.routes")
router.use("/auth", authentication, authRouter)

// searchTerm routes
const searchTermRouter = require("./searchTerm.routes")
router.use("/searchterm", authentication, searchTermRouter)

// job routes
const jobRouter = require("./jobListing.routes.js")
router.use("/job", authentication, jobRouter)

module.exports = router;