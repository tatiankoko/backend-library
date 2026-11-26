const User = require('../models/user');
const Book = require('../models/book');
const { HttpError, run, ensureId, ensureBody } = require('./http');

const getUsers = (request, response) => run(response, async () => {
    const users = await User.find({});
    response.status(200).send(users);
});

const getUser = (request, response) => run(response, async () => {
    const { user_id } = request.params;
    ensureId(user_id, 'User');
    const user = await User.findById(user_id);
    if (!user) {
        throw new HttpError(404, 'User not found');
    }
    response.status(200).send(user);
});

const createUser = (request, response) => run(response, async () => {
    ensureBody(request.body);
    if (request.body.name === undefined || request.body.name === null || request.body.name === '') {
        throw new HttpError(400, 'name is required');
    }
    const user = await User.create(request.body);
    response.status(201).send(user);
});

const updateUser = (request, response) => run(response, async () => {
    const { user_id } = request.params;
    ensureId(user_id, 'User');
    ensureBody(request.body);
    const user = await User.findByIdAndUpdate(user_id, request.body, {
        new: true,
        runValidators: true
    });
    if (!user) {
        throw new HttpError(404, 'User not found');
    }
    response.status(200).send(user);
});

const deleteUser = (request, response) => run(response, async () => {
    const { user_id } = request.params;
    ensureId(user_id, 'User');
    const user = await User.findById(user_id);
    if (!user) {
        throw new HttpError(404, 'User not found');
    }
    const borrowedBook = await Book.exists({ borrowedBy: user_id });
    if (borrowedBook) {
        throw new HttpError(409, 'A user with borrowed books cannot be deleted');
    }
    const deletedUser = await User.findByIdAndDelete(user_id);
    if (!deletedUser) {
        throw new HttpError(404, 'User not found');
    }
    response.status(200).send(deletedUser);
});

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};
