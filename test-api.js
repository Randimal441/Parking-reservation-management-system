const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.setTimeout(5000, () => {
      console.error('Request timeout');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function testAPI() {
  try {
    console.log('Testing parking slots API...');
    
    // Test all slots
    const allSlots = await makeRequest('/parking-slots');
    console.log('All slots:', allSlots.length);
    
    // Test available slots
    const availableSlots = await makeRequest('/parking-slots/available');
    console.log('Available slots:', availableSlots.length);
    
    // Test statistics
    const stats = await makeRequest('/parking-slots/statistics');
    console.log('Statistics:', stats);
    
    if (availableSlots.length > 0) {
      console.log('First 3 available slots:');
      availableSlots.slice(0, 3).forEach(slot => {
        console.log(`- ${slot.slotId}: ${slot.location} (Floor: ${slot.floor}, Section: ${slot.section})`);
      });
    } else {
      console.log('No available slots found!');
    }
    
  } catch (error) {
    console.error('API Error:', error.message);
  }
}

testAPI();
