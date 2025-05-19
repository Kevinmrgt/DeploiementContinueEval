const express = require('express');
const router = express.Router();

// Mock data for demonstration
const sensors = [
  { id: '1', name: 'Temperature Sensor', type: 'temperature', value: 22.5, unit: '°C', location: 'Living Room', lastUpdate: new Date().toISOString() },
  { id: '2', name: 'Humidity Sensor', type: 'humidity', value: 45, unit: '%', location: 'Kitchen', lastUpdate: new Date().toISOString() },
  { id: '3', name: 'CO2 Sensor', type: 'co2', value: 650, unit: 'ppm', location: 'Bedroom', lastUpdate: new Date().toISOString() }
];

// Get all sensors
router.get('/', (req, res) => {
  res.json(sensors);
});

// Get a specific sensor
router.get('/:id', (req, res) => {
  const sensor = sensors.find(s => s.id === req.params.id);
  if (!sensor) {
    return res.status(404).json({ error: 'Sensor not found' });
  }
  res.json(sensor);
});

// Create a new sensor (mock)
router.post('/', (req, res) => {
  const { name, type, value, unit, location } = req.body;
  
  if (!name || !type || value === undefined || !unit || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newSensor = {
    id: (sensors.length + 1).toString(),
    name,
    type,
    value,
    unit,
    location,
    lastUpdate: new Date().toISOString()
  };
  
  // This is just a mock - in a real app, we would save to a database
  sensors.push(newSensor);
  
  res.status(201).json(newSensor);
});

// Update sensor data (mock)
router.put('/:id', (req, res) => {
  const sensorIndex = sensors.findIndex(s => s.id === req.params.id);
  
  if (sensorIndex === -1) {
    return res.status(404).json({ error: 'Sensor not found' });
  }
  
  const updatedSensor = {
    ...sensors[sensorIndex],
    ...req.body,
    lastUpdate: new Date().toISOString()
  };
  
  // This is just a mock - in a real app, we would update in a database
  sensors[sensorIndex] = updatedSensor;
  
  res.json(updatedSensor);
});

// Delete a sensor (mock)
router.delete('/:id', (req, res) => {
  const sensorIndex = sensors.findIndex(s => s.id === req.params.id);
  
  if (sensorIndex === -1) {
    return res.status(404).json({ error: 'Sensor not found' });
  }
  
  // This is just a mock - in a real app, we would delete from a database
  const deletedSensor = sensors.splice(sensorIndex, 1)[0];
  
  res.json({ message: 'Sensor deleted successfully', sensor: deletedSensor });
});

module.exports = router;
