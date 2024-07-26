const router = require("express").Router();
const searchTermController = require('../controllers/searchTerm.controller');

// GET - /api/searchterm
// router.get('', searchTermController.getSearchTerm);

// POST - /api/searchterm/:keyword
// router.post('/:keyword', searchTermController.createSearchTerm);

// DELETE - /api/searchterm/:keywordId
// router.delete('/:keywordId', searchTermController.deleteSearchTerm);

module.exports = router;