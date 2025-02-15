const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');


dotenv.config();//לטעון את קובץ ההגדרות
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api', require('./routes/costRoutes'));

app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
