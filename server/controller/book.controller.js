import Book from '../models/Book.js';

const requiredFields = ['bookName', 'bookTitle', 'author', 'sellingPrice', 'publishDate'];

const normalizeBookPayload = (body) => ({
    bookName: body.bookName?.trim(),
    bookTitle: body.bookTitle?.trim(),
    author: body.author?.trim(),
    sellingPrice: Number(body.sellingPrice),
    publishDate: body.publishDate,
});

const hasMissingFields = (data) =>
    requiredFields.some((field) => data[field] === undefined || data[field] === '' || Number.isNaN(data[field]));

export const createBookController = async (req, res) => {
    try {
        const bookData = normalizeBookPayload(req.body);
        if (hasMissingFields(bookData)) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const book = new Book(bookData);
        await book.save();
        res.status(201).json({ message: 'Book created successfully', book });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBookController = async (req, res) => {
    try {
        const { bookId } = req.params;
        const bookData = normalizeBookPayload(req.body);
        if (hasMissingFields(bookData)) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const updatedBook = await Book.findByIdAndUpdate(bookId, bookData, {
            new: true,
            runValidators: true,
        });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBooksController = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({ message: 'Books fetched successfully', books, total: books.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteBookController = async (req, res) => {
    try {
        const { bookId } = req.params;
        const deletedBook = await Book.findByIdAndDelete(bookId);
            if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully', deletedBook });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};