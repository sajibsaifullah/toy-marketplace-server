const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('TOY MARKETPLACE server is running on test...');
})

app.listen(port, () => {
    console.log(`Toy Marketplace server is running on port: ${port}`);
})