const express = require('express');
const Router = express.Router();
const Users = require("../models/User");
const {renderRegistPage, renderLoginPage, getUserProfile} = require("../controllers/userController");
const protectHandler = require('../middleware/protectHandler');

Router.post('/register', renderRegistPage);
Router.post('/login', renderLoginPage);
Router.get('/profile', protectHandler, getUserProfile);

module.exports = Router;