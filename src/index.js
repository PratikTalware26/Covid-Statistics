const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const dataRoutes= require("./Routes/dataRoutes")

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')


app.use('/', dataRoutes)



app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;