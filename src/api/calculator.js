/**
 * Calculator module with basic arithmetic operations
 */

/**
 * Adds two numbers
 * @param {number} a First number
 * @param {number} b Second number
 * @returns {number} The sum of a and b
 */
function add(a, b) {
  return a + b;
}

/**
 * Subtracts two numbers
 * @param {number} a First number
 * @param {number} b Second number
 * @returns {number} The difference of a and b
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Multiplies two numbers
 * @param {number} a First number
 * @param {number} b Second number
 * @returns {number} The product of a and b
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Divides two numbers
 * @param {number} a Dividend
 * @param {number} b Divisor
 * @returns {number} The quotient of a divided by b
 * @throws {Error} Error if b is zero
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide
};
