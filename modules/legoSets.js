const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

function initialize() {
    return new Promise((resolve, reject) => {
        sets = [];
        setData.forEach(set => {
            const theme = themeData.find(theme => theme.id === set.theme_id);
            if (theme) {
                sets.push({
                    ...set,
                    theme: theme.name
                });
            }
        });
        resolve();
    });
}

function getAllSets() {
    return new Promise((resolve, reject) => {
        if (sets.length > 0) {
            resolve(sets);
        } else {
            reject("No sets available.");
        }
    });
}

function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        const set = sets.find(set => set.set_num === setNum);
        if (set) {
            resolve(set);
        } else {
            reject("Set not found.");
        }
    });
}

function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        const lowercaseTheme = theme.toLowerCase();
        const matchingSets = sets.filter(set => set.theme.toLowerCase().includes(lowercaseTheme));
        if (matchingSets.length > 0) {
            resolve(matchingSets);
        } else {
            reject("Sets not found for the provided theme.");
        }
    });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };

// Testing
initialize()
    .then(() => {
        console.log("Initialization complete.");
        return getAllSets();
    })
    .then(allSets => {
        console.log("All sets:", allSets);
        return getSetByNum("05-1"); 
    })
    .then(set => {
        console.log("Set by number:", set);
        return getSetsByTheme("Service Packs"); 
    })
    .then(setsByTheme => {
        console.log("Sets by theme:", setsByTheme);
    })
    .catch(error => {
        console.error("Error:", error);
    });
