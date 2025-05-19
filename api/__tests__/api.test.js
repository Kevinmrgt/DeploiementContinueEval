const request = require('supertest');
const app = require('../index');

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const res = await request(app).get('/');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('endpoints');
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'UP');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('Sensors API', () => {
    it('should return a list of sensors', async () => {
      const res = await request(app).get('/api/sensors');
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return a specific sensor', async () => {
      const res = await request(app).get('/api/sensors/1');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', '1');
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('type');
      expect(res.body).toHaveProperty('value');
    });

    it('should return 404 for non-existent sensor', async () => {
      const res = await request(app).get('/api/sensors/9999');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should create a new sensor', async () => {
      const newSensor = {
        name: 'Test Sensor',
        type: 'pressure',
        value: 1013.25,
        unit: 'hPa',
        location: 'Test Room'
      };
      
      const res = await request(app)
        .post('/api/sensors')
        .send(newSensor);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', newSensor.name);
      expect(res.body).toHaveProperty('type', newSensor.type);
      expect(res.body).toHaveProperty('value', newSensor.value);
    });
  });
});