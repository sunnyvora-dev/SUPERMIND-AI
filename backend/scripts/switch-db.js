const fs = require('fs');
const path = require('path');

const target = process.argv[2] || 'postgresql';
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

if (!fs.existsSync(schemaPath)) {
  console.error('Schema not found at:', schemaPath);
  process.exit(1);
}

let content = fs.readFileSync(schemaPath, 'utf8');

if (target === 'postgresql' || target === 'postgres') {
  content = content.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  console.log('Switched Prisma datasource provider to: postgresql');
} else if (target === 'sqlite') {
  content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  console.log('Switched Prisma datasource provider to: sqlite');
} else {
  console.error('Unknown target database provider:', target);
  process.exit(1);
}

fs.writeFileSync(schemaPath, content, 'utf8');
console.log('Prisma schema updated successfully.');
