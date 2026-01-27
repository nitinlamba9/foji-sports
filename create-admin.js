const bcrypt = require('bcryptjs');

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 12);
  console.log('Hashed password for admin123:', hashedPassword);
}

createAdmin();
