const path = require('path');
const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.set('view engine', 'ejs');

// Enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/ai', require('./routes/openaiRoutes'));

app.get('/', (req, res) => {
  res.render('main')
});

app.listen(port, () => console.log(`Server started on port: ${port}`));