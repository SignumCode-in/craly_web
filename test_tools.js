const axios = require('axios');

async function check() {
  try {
    const res = await axios.get('http://localhost:5000/api/tools');
    console.log(JSON.stringify(res.data.data.tools[0], null, 2));
  } catch (err) {
    console.error(err.message);
  }
}
check();
