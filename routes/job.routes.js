const router = require("express").Router();
const authentication = require("../middlewares/authentication.js");



//POST /api/job - XXXXXXXXXXXXXXXXXXXXXX
router.post("/", authentication, (req, res, next) => {

});


module.exports = router;
