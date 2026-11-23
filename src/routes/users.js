const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser} = require("../controllers/users");
const {
    getBorrowed,
    borrowBook,
    returnBook
} = require("../controllers/books");
const router = require('express').Router();

router.get('/users', getUsers);
router.get('/users/:user_id', getUser);
router.post('/users', createUser)
router.patch('/users/:user_id', updateUser)
router.delete('/users/:user_id', deleteUser)
router.get('/users/:user_id/books', getBorrowed);
router.post('/users/:user_id/books', borrowBook);
router.post('/users/:user_id/books/return', returnBook);

module.exports = router;