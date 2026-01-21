// backend/test.js
const { addition, multiplication } = require('./math');

console.log('Test backend:');
console.log('2 + 3 =', addition(2, 3));
console.log('4 * 5 =', multiplication(4, 5));