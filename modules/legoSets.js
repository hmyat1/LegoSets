require('dotenv').config();
const Sequelize = require('sequelize');
const { Set, Theme } = require('./models'); // Import your Sequelize models

const sequelize = new Sequelize({
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  dialect: 'postgres',
  define: {
    timestamps: false, // Disable createdAt and updatedAt fields
  },
});

// Define the Theme and Set models
const ThemeModel = sequelize.define('Theme', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: Sequelize.STRING,
});

const SetModel = sequelize.define('Set', {
  set_num: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  year: Sequelize.INTEGER,
  num_parts: Sequelize.INTEGER,
  theme_id: Sequelize.INTEGER,
  img_url: Sequelize.STRING,
});

// Establish the association between Set and Theme
SetModel.belongsTo(ThemeModel, { foreignKey: 'theme_id' });

// Sync the models with the database
async function initialize() {
  try {
    await sequelize.sync();
    console.log("Database synchronized.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
    throw error;
  }
}

// Function to add a new set to the database
async function addSet(setData) {
  try {
    await SetModel.create(setData);
  } catch (err) {
    throw err;
  }
}

// Function to get all themes from the database
async function getAllThemes() {
  try {
    return await ThemeModel.findAll();
  } catch (err) {
    throw err;
  }
}

// Function to get all sets with their associated themes from the database
async function getAllSets() {
  try {
    return await SetModel.findAll({ include: [ThemeModel] });
  } catch (error) {
    console.error("Error fetching sets:", error);
    throw error;
  }
}

// Function to get a set by its set_num with its associated theme from the database
async function getSetByNum(setNum) {
  try {
    return await SetModel.findOne({ where: { set_num: setNum }, include: [ThemeModel] });
  } catch (error) {
    console.error("Error fetching set by number:", error);
    throw error;
  }
}

// Function to get sets by a specific theme from the database
async function getSetsByTheme(theme) {
  try {
    return await SetModel.findAll({
      include: [ThemeModel],
      where: {
        '$Theme.name$': {
          [Sequelize.Op.iLike]: `%${theme}%`
        }
      }
    });
  } catch (error) {
    console.error("Error fetching sets by theme:", error);
    throw error;
  }
}

module.exports = { initialize, addSet, getAllThemes, getAllSets, getSetByNum, getSetsByTheme };
