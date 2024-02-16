legoData.initialize()
  .then(() => {
    app.get('/', async (req, res) => {
      try {
        const filePath = path.join(__dirname, 'views', 'home.html');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        res.send(fileContent);
      } catch (error) {
        console.error('Error serving home.html:', error);
        res.status(500).send('Internal Server Error: ' + error.message);
      }
    });