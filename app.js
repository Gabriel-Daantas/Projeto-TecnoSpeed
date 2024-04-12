const express = require('express')
const https = require('https')
const path = require('path')
const fs = require('fs')

const app = express()

app.use('/', (req, res, next) => {
    res.send('Hello Form SSL SERVER')
})

const sslServer = https.createServer({
    key: '',
    cert: ''
}, app)

sslServer.listen(3443, () => console.log('Servidor rodando na porta "3443"'))