const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.static('./dist'));
app.use('*', (req, res) => {
    fs.readFile('./dist/index.html', (err, body) => res.end(body.toString()));
})
console.log('listen at http://localhost:9999');
app.listen(9999);