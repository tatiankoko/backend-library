const Book = require('../models/book');
const User = require('../models/user');
const { HttpError, run, ensureId, ensureBody } = require('./http');

const getBooks = (request, response) => run(response, async () => {
    const books = await Book.find({});
    response.status(200).send(books);
});

const getBook = (request, response) => run(response, async () => {
    const { book_id } = request.params;
    ensureId(book_id, 'Book');
    const book = await Book.findById(book_id);
    if (!book) {
        throw new HttpError(404, 'Book not found');
    }
    response.status(200).send(book);
});

const createBook = (request, response) => run(response, async () => {
    ensureBody(request.body);
    if (request.body.title === undefined || request.body.title === null || request.body.title === '') {
        throw new HttpError(400, 'title is required');
    }
    const book = await Book.create(request.body);
    response.status(201).send(book);
});

const updateBook = (request, response) => run(response, async () => {
    const { book_id } = request.params;
    ensureId(book_id, 'Book');
    ensureBody(request.body);
    const book = await Book.findByIdAndUpdate(book_id, request.body, {
        new: true,
        runValidators: true
    });
    if (!book) {
        throw new HttpError(404, 'Book not found');
    }
    response.status(200).send(book);
});

const deleteBook = (request, response) => run(response, async () => {
    const { book_id } = request.params;
    ensureId(book_id, 'Book');
    const book = await Book.findOneAndDelete({
        _id: book_id,
        $or: [{ borrowedBy: null }, { borrowedBy: { $exists: false } }]
    });
    if (book) {
        response.status(204).end();
        return;
    }
    const existingBook = await Book.findById(book_id);
    if (!existingBook) {
        throw new HttpError(404, 'Book not found');
    }
    throw new HttpError(409, 'A borrowed book cannot be deleted');
});

const getBorrowed = (request, response) => run(response, async () => {
    const { user_id } = request.params;
    ensureId(user_id, 'User');
    const user = await User.findById(user_id);
    if (!user) {
        throw new HttpError(404, 'User not found');
    }
    const borrowedBooks = await Book.find({ borrowedBy: user_id });
    response.status(200).send(borrowedBooks);
});

const borrowBook = (request, response) => run(response, async () => {
    const { user_id } = request.params;
    ensureId(user_id, 'User');
    ensureBody(request.body);
    if (!request.body.bookId) {
        throw new HttpError(400, 'bookId is required');
    }
    ensureId(request.body.bookId, 'Book');

    const user = await User.findById(user_id);
    if (!user) {
        throw new HttpError(404, 'User not found');
    }
    const book = await Book.findOneAndUpdate({
        _id: request.body.bookId,
        $or: [{ borrowedBy: null }, { borrowedBy: { $exists: false } }]
    }, {
        $set: { borrowedBy: user_id }
    }, {
        new: true
    });
    if (!book) {
        const existingBook = await Book.findById(request.body.bookId);
        if (!existingBook) {
            throw new HttpError(404, 'Book not found');
        }
        throw new HttpError(409, 'Book is already borrowed');
    }
    response.status(201).send(book);
});

const returnBook = (request, response) => run(response, async () => {
    const { user_id } = request.params;
    ensureId(user_id, 'User');
    ensureBody(request.body);
    if (!request.body.bookId) {
        throw new HttpError(400, 'bookId is required');
    }
    ensureId(request.body.bookId, 'Book');

    const user = await User.findById(user_id);
    if (!user) {
        throw new HttpError(404, 'User not found');
    }
    const book = await Book.findOneAndUpdate({
        _id: request.body.bookId,
        borrowedBy: user_id
    }, {
        $set: { borrowedBy: null }
    }, {
        new: true
    });
    if (!book) {
        const existingBook = await Book.findById(request.body.bookId);
        if (!existingBook) {
            throw new HttpError(404, 'Book not found');
        }
        throw new HttpError(409, 'User has not borrowed this book');
    }
    response.status(201).send(book);
});

module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getBorrowed,
    borrowBook,
    returnBook
};
