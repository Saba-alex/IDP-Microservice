import express from 'express';
import * as userController from './user.controller';
import {authenticateUser  } from './user.auth';

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/profile', authenticateUser, userController.viewProfile);
router.put('/profile', authenticateUser, userController.editProfile);

export default router;