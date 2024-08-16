const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const busSchema = new mongoose.Schema({
  number: String,
  route: String,
  location: {
    lat: Number,
    lng: Number,
  },
  timestamp: { type: Date, default: Date.now },
});

const Bus = mongoose.model('Bus', busSchema);

// Endpoint to handle real-time location updates
app.post('/update-location', async (req, res) => {
  const { number, location } = req.body;

  try {
    await Bus.findOneAndUpdate(
      { number },  // Update the bus with the specific number
      { location, timestamp: new Date() },
      { upsert: true, new: true }
    );
    res.status(200).send('Location updated');
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).send('Error updating location');
  }
});

// API to fetch all buses
app.get('/buses', async (req, res) => {
  const buses = await Bus.find({});
  res.json(buses);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
