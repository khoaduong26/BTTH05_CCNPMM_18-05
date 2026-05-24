
const path = require("path");
const express = require("express");

let configViewEngine = (app) => {
    app.set("view engine", "ejs"); //thiết lập viewEngine 
    app.set("views", path.join("./src", "views")) ;//thư mục chứa views

    app.use(express.static(path.join("./src", "public"))); //thiết lập thư mục chứa file tĩnh
}
module.exports = configViewEngine;