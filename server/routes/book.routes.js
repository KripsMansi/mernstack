import express from 'express';
import {
  createBookController,
  getBooksController,
  updateBookController,
  deleteBookController,
} from '../controller/book.controller.js';

const router = express.Router();

router.post('/create-book', createBookController);
router.get('/get-books', getBooksController);
router.put('/update-book/:bookId', updateBookController);
router.delete('/delete-book/:bookId', deleteBookController);

export default router;