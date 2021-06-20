const express = require('express');

const app = express();
const api = require('./index');
const cors = require('cors');

//console.log(api);

app.use(cors());
app.use('/api', api);

app.listen(3001, ()=>console.log(`Listening on port 3001`));