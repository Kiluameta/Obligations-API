const express = require('express')
const app = express()
const db = require('./config/db')
const consign = require('consign')

// app.use(express.json())
// app.use(express.urlencoded({extended: true}))

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.db = db

app.post('/teste/', (req, res) => {
    res.status(200).send('Teste inicial - ' + JSON.stringify(req.body))
})

app.listen(3430, () => {
    console.log('Executando...')
})