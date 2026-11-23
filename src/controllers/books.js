const Book = require('../models/book');

const getBooks = (request, response)=> {
    return Book.find({}).then(books => {
        response.status(200).send(books);
    }).catch(error => {
        response.status(500).send(error.message);
    })
}

const getBook = (request, response)=> {
    const { book_id } = request.params;
    return Book.findById(book_id).then(book => {
        response.status(200).send(book);
    }).catch(error => {
        response.status(500).send(error.message);
    })
}

const createBook = (request, response)=> {
    return Book.create({
        ...request.body,
    }).then((book) => {
        response.status(201).send(book);
    }).catch(error => {
        response.status(500).send(error.message);
    });
}

const updateBook = (request, response)=> {
    const { book_id } = request.params;
    return Book.findByIdAndUpdate(book_id, {
        ...request.body,
    }).then(book => {
        response.status(200).send(book);
    }).catch(error => {
        response.status(500).send(error.message);
    })
}

const deleteBook = (request, response)=> {
    const { book_id } = request.params;
    return Book.findByIdAndDelete(book_id).then(() => {
        response.status(204).send("Successfully deleted book");
    }).catch(error => {
        response.status(500).send(error.message);
    })
}

const getBorrowed = (request, response)=> {
    const { user_id } = request.params;
    return Book.find(b => b.borrowedBy === user_id).then(borrowedBooks => {
        response.status(200).send(borrowedBooks);
    }).catch(error => {
        response.status(500).send(error.message);
    })
}

const borrowBook = (request, response)=> {
    const { user_id } = request.params;

    return Book.findById(
        request.body.book_id
    ).then((book) => {
        book.borrowedBy = user_id;
        response.status(201).send(book);
    }).catch(error => {
        response.status(500).send(error.message);
    });
}

const returnBook = (request, response)=> {
    const { book_id } = request.params;
    return Book.findById(book_id).then((book) => {
        book.borrowedBy =null;
        response.status(204).send(book);
    }).catch(error => {
        response.status(500).send(error.message);
    })
}

module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getBorrowed,
    borrowBook,
    returnBook
}