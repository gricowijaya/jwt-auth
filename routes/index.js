const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth')
const restrict = require('../middlewares/restrict');

router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/whoami', restrict, auth.whoami);

module.exports = router;
