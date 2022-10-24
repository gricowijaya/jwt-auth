require('dotenv').config();
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Users } = require('../models');

var options = {};
options.jwtFromRequest = ExtractJwt.fromHeader('authorization');
options.secretOrKey = process.env.JWT_SECRET_KEY;

passport.use(new JwtStrategy(options, async (payload, done)=> {
    try {
        const users = await Users.findOne({where: { id: payload.id }});
        if (users) { 
            return done(null, users);
        }
        return done(null, null);
    } catch(err) {
        return done(err, null);
    }
}));

module.exports = passport;
