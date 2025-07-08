import express from 'express';
import {
  getTaskAnalytics,
} from '../controllers/analytics.controller';

const router = express.Router();

router.get('/', getTaskAnalytics);



export default router;
