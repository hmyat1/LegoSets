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
const legoSets = require('./modules/legoSets');
const { body, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Initialize LEGO data
legoSets.initialize()
  .then(() => {
    console.log('Lego data initialized successfully.');

    // Routes
    app.get('/', (req, res) => {
      res.render('home');
    });

    app.get('/about', (req, res) => {
      res.render('about');
    });

    app.get('/lego/sets', async (req, res) => {
      const sets = await legoSets.getAllSets();
      res.render('sets', { sets });
    });

    app.get('/lego/sets/:id-demo', async (req, res) => {
      const setId = req.params.id-demo;
      const set = await legoSets.getSetById(setId);
      if (set) {
        res.render('setDetails', { set });
      } else {
        res.status(404).render('404');
      }
    });

    // Route to render the form for adding a new set
    app.get('/lego/addSet', async (req, res) => {
      const themes = await legoSets.getAllThemes();
      res.render('addSet', { themes });
    });

    // Route to handle form submission for adding a new set
    app.post('/lego/addSet', [
      body('name').notEmpty().withMessage('Name is required'),
      body('year').isNumeric().withMessage('Year must be a number'),
      body('num_parts').isNumeric().withMessage('Number of parts must be a number'),
      body('img_url').isURL().withMessage('Invalid image URL'),
      body('theme_id').notEmpty().withMessage('Theme is required'),
      body('set_num').notEmpty().withMessage('Set number is required'),
    ], async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const themes = await legoSets.getAllThemes();
        return res.render('addSet', { themes, errors: errors.array() });
      }

      const { name, year, num_parts, img_url, theme_id, set_num } = req.body;
      const setData = { name, year, num_parts, img_url, theme_id, set_num };

      try {
        await legoSets.addSet(setData);
        res.redirect('/lego/sets');
      } catch (error) {
        console.error('Error adding new set:', error);
        res.status(500).render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
      }
    });

    // Handle 404 errors
    app.use((req, res, next) => {
      res.status(404).render('404');
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Error initializing Lego data:', error);
  });
