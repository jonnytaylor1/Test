require('dotenv').config();
require = require("esm")(module/*, options*/)
module.exports = require("./server.js")

//This file means you can use import instead of require
//Could not 'require' dotenv in server.js and so required it here