const express = require("express");
const con = require('./connection'); // mysql connection pool
const routes = express.Router();

routes.get("/", (request, response) => {
    const query = ``;
    
    con.query(query, (err, results) => {
        if (err) throw err;

        response.json();
    });
});

module.exports = routes;