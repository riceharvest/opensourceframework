import bcrypt from '@opensourceframework/bcryptjs';

const password = 'password';
const rounds = 10;

console.log('Testing bcrypt hashing...');
const hash = bcrypt.hashSync(password, rounds);
console.log('Hash:', hash);

// Verify that the hash can be used to compare
const match = bcrypt.compareSync(password, hash);
console.log('Password matches hash:', match);

if (!match) {
  console.error('❌ Test failed: hash did not match');
  process.exit(1);
}

console.log('✅ Test passed');
process.exit(0);
