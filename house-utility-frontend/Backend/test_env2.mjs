import dotenv from 'dotenv';
const result = dotenv.config({ path: '.env' });
console.log('dotenv.config result:', result);
console.log('GOOGLE_CLIENT_ID from process.env:', process.env.GOOGLE_CLIENT_ID);
