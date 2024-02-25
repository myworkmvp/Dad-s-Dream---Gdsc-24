const { error } = require('console');
const path = require("path")
const dotenv = require("dotenv");
const express = require('express');
const mysql = require("mysql");
const cookieBarser = require("cookie-parser");
const app = express();

dotenv.config({
    path:"./.env",
});

app.use(cookieBarser());
app.use(express.urlencoded({extended:false}));
const location = path.join(__dirname,"./public");
app.use(express.static(location));

app.set("view engine","hbs");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:null,
    database:"gdsc",
    port:"3306"
});
db.connect((err)=>{
    if(err){
        console.log(err.code)
    }
    else{console.log("SQL SERVER CONNECTED SUCCESSFULLY")}
    
});

app.use("/",require("./routers/pages"));
app.use("/auth",require("./routers/auth"));

// Start the server
const port = 3010;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
