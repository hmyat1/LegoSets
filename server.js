/*********************************************************************************
WEB322 – Assignment 04
I declare that this assignment is my own work in accordance with Seneca's
Academic Integrity Policy:
https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
Name: ____Hla Myint Myat__________________
Student ID: __185923216____________
Date: _____8.3.24_________
Published URL: _______https://github.com/hmyat1/LegoSets____________________________________________________
*********************************************************************************/

const express = require('express');
const path = require('path');
const legoData = require('./modules/legoSets');
const fs = require('fs').promises;

const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

legoData.initialize()
  .then(() => {
    app.get('/', async (req, res) => {
      try {
        res.render('home');
      } catch (error) {
        console.error('Error serving home page:', error);
        res.status(500).send('Internal Server Error: ' + error.message);
      }
    });

    // Update your routes to render EJS views instead of sending HTML files
    app.get('/about', (req, res) => {
      res.render('about');
    });

    app.get('/lego/sets', (req, res) => {
      // Your existing route logic remains unchanged
    });

    app.get('/lego/sets/:id-demo', (req, res) => {
      // Your existing route logic remains unchanged
    });

    // Handle 404 errors
    app.use((req, res, next) => {
      res.status(404).render('404');
    });

    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Error initializing Lego data:', error);
  });
