const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Campus Resource Reservation API is running' 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Test the health route: http://localhost:${PORT}/health`);
});