const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser} = require("../controllers/users");
const router = require('express').Router();

router.get('/users', getUsers);
router.get('/users/:user_id', getUser);
router.post('/user', createUser)
router.patch('/user/:user_id', updateUser)
router.delete('/user/:user_id', deleteUser)

module.exports = router;