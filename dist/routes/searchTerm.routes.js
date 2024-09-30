"use strict";
const router = require("express").Router();
const searchTermController = require('../controllers/searchTerm.controller');
// GET - /api/searchterm
router.get('', searchTermController.getSearchTerm);
// POST - /api/searchterm /: keyword
router.post('/', searchTermController.createSearchTerm);
// DELETE - /api/searchterm /: keywordId
router.delete('/:searchTermId', searchTermController.deleteSearchTerm);
module.exports = router;
