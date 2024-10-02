import { Router } from "express";
import * as  searchTermController from '../controllers/searchTerm.controller';
const searchTermRouter: Router = Router();
// GET - /api/searchterm
searchTermRouter.get('', searchTermController.getSearchTerm);

// POST - /api/searchterm /: keyword
searchTermRouter.post('/', searchTermController.createSearchTerm);

// DELETE - /api/searchterm /: keywordId
searchTermRouter.delete('/:searchTermId', searchTermController.deleteSearchTerm);

export default searchTermRouter;