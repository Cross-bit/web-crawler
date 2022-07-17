import express, { Router } from 'express'
import { getAllTags, createNewTag } from '../../controllers/tagsController';
import * as validations from './validations/tagsRouterValidations'
export const router: Router = express.Router();


router.get('/', getAllTags);

router.post('/', ...validations.createNewTagValidation, createNewTag);
