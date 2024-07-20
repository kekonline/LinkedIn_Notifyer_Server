const router = require("express").Router();
const authentication = require("../middlewares/authentication.js");



//POST /api/searchterm - XXXXXXXXXXXXXXXXXXXXXX
router.post("/", authentication, (req, res, next) => {

});


module.exports = router;
