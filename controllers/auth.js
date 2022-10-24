const { Users } = require('../models') 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {
    JWT_SIGNATURE_KEY
} = process.env

module.exports = { 
    register: async (req, res, next) => {
        try {
            const {username, email, password } = req.body;

            const existUser = await Users.findOne({ where: { username: username } });
            if (existUser) {
                return res.status(409).json({
                    status: false,
                    message: 'username already used!'
                });
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = await Users.create({
                username: username,
                email: email,
                password: encryptedPassword
            });
            
            console.log(user)

            return res.status(201).json({
                status: true,
                message: 'success',
                data: {
                    username: user.username,
                    email: user.email
                }
            });
        } catch (err) {
            // console.log(err);
            next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            const user = await Users.authenticate(req.body);
            const accesstoken = user.generateToken();

            res.status(200).json({
                status: true,
                message: 'success login',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    access_token: accesstoken,
                }
            });
        } catch (err) {
            // console.log(err)
            next(err);
        }
    },

    whoami: (req, res, next) => {
        const user = req.user;

        try {
            return res.status(200).json({
                status: false,
                message: 'success',
                data: user
            });
        } catch (err) {
            next(err);
        }
    }
}
