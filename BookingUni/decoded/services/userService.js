 const User = require('../models/User');
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');

 const JWT_SECRET = 'fhkj345j34kjfoi3409t';
 
 async function register (email, username, password) {

     const existingEmail = await User.findOne({ email }).collation({ locale: 'en', strength: 2});
     if (existingEmail) {
         throw new Error('Email is taken');
        }
     
        const existingUsername = await User.findOne({ username }).collation({ locale: 'en', strength: 2});
        if (existingUsername) {
            throw new Error('Username is taken');
        }
        
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        username,
        hashedPassword
    });

    //TODO See if register creates an user session

    const token = createSession(user);
    return token;
 }

 async function login(email, password) {
    const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2});

    if(!user) {
        throw new Error('Incorrect email or passowrd');
    }

    const match = await bcrypt.compare(password, user.hashedPassword);

    if(!match) {
        throw new Error('Incorrect email or passowrd');

    }

    return createSession(user);
 }

 function createSession({ _id, email, username }) {

    const payload = {
        _id,
        email,
        username
    };

    const token = jwt.sign(payload, JWT_SECRET);
    return token;
 }

 function verifyToken(token) {
    const user = jwt.verify(token, JWT_SECRET);   
   return user;
 }  

 module.exports = {
    login,
    register,
    verifyToken
 };