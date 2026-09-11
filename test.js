/**
 * Unit tests for Brazilian document generators
 * Tests validation functions for CPF, CNPJ, and registration numbers
 */

const { validateCPF, generateCPFWithFinalDigit } = require('./geradorCPF');
const { CNPJGenerator } = require('./geradorCNPJ');
const { generateRegistrationNumber, validateRegistrationNumber } = require('./geradorMatricula');

// Test results tracking
let testsPassed = 0;
let testsFailed = 0;

/**
 * Test helper function
 * @param {string} testName - Name of the test
 * @param {boolean} condition - Test condition (true = pass)
 * @param {string} errorMessage - Error message if test fails
 */
function test(testName, condition, errorMessage = '') {
    if (condition) {
        console.log(`✅ PASS: ${testName}`);
        testsPassed++;
    } else {
        console.log(`❌ FAIL: ${testName}`);
        if (errorMessage) console.log(`   Error: ${errorMessage}`);
        testsFailed++;
    }
}

/**
 * Assert equality helper
 * @param {string} testName - Name of the test
 * @param {*} actual - Actual value
 * @param {*} expected - Expected value
 */
function assertEquals(testName, actual, expected) {
    const condition = actual === expected;
    const errorMessage = `Expected ${expected}, got ${actual}`;
    test(testName, condition, errorMessage);
}

console.log('=== RUNNING UNIT TESTS ===\n');

// CPF VALIDATION TESTS
console.log('--- CPF VALIDATION TESTS ---');

// Test valid CPFs
test('Valid CPF: 123.456.789-09', validateCPF('123.456.789-09') === true);
test('Valid CPF: 529.982.247-25', validateCPF('529.982.247-25') === true);
test('Valid CPF without formatting: 12345678909', validateCPF('12345678909') === true);

// Test invalid CPFs
test('Invalid CPF: all same digits', validateCPF('111.111.111-11') === false);
test('Invalid CPF: wrong length', validateCPF('123.456.789') === false);
test('Invalid CPF: wrong check digits', validateCPF('123.456.789-00') === false);
test('Invalid CPF: empty string', validateCPF('') === false);
test('Invalid CPF: non-numeric', validateCPF('abc.def.ghi-jk') === false);

// CPF GENERATION TESTS
console.log('\n--- CPF GENERATION TESTS ---');

try {
    const generatedCPF = generateCPFWithFinalDigit(5, false);
    test('Generated CPF has correct length', generatedCPF.length === 11);
    test('Generated CPF ends with 5', generatedCPF.endsWith('5'));
    test('Generated CPF is valid', validateCPF(generatedCPF) === true);
    
    const formattedCPF = generateCPFWithFinalDigit(7, true);
    test('Formatted CPF has format XXX.XXX.XXX-XX', /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formattedCPF));
    test('Formatted CPF ends with 7', formattedCPF.endsWith('7'));
} catch (error) {
    test('CPF generation', false, error.message);
}

// CNPJ VALIDATION TESTS
console.log('\n--- CNPJ VALIDATION TESTS ---');

// Test valid CNPJs
test('Valid CNPJ: 11.444.777/0001-61', CNPJGenerator.validate('11.444.777/0001-61') === true);
test('Valid CNPJ without formatting: 11444777000161', CNPJGenerator.validate('11444777000161') === true);

// Test invalid CNPJs
test('Invalid CNPJ: all same digits', CNPJGenerator.validate('11.111.111/1111-11') === false);
test('Invalid CNPJ: wrong length', CNPJGenerator.validate('11.444.777/0001') === false);
test('Invalid CNPJ: wrong check digits', CNPJGenerator.validate('11.444.777/0001-00') === false);
test('Invalid CNPJ: empty string', CNPJGenerator.validate('') === false);

// CNPJ GENERATION TESTS
console.log('\n--- CNPJ GENERATION TESTS ---');

try {
    const numericCNPJ = CNPJGenerator.generate(1, false);
    test('Numeric CNPJ has correct length', numericCNPJ.length === 14);
    test('Numeric CNPJ is valid', CNPJGenerator.validate(numericCNPJ) === true);
    
    const formattedCNPJ = CNPJGenerator.generate(1, true);
    test('Formatted CNPJ has format XX.XXX.XXX/XXXX-XX', /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formattedCNPJ));
    
    const alphaCNPJ = CNPJGenerator.generate(2, false);
    test('Alphanumeric CNPJ has correct length', alphaCNPJ.length === 14);
    test('Alphanumeric CNPJ is valid', CNPJGenerator.validate(alphaCNPJ) === true);
} catch (error) {
    test('CNPJ generation', false, error.message);
}

// REGISTRATION NUMBER TESTS
console.log('\n--- REGISTRATION NUMBER TESTS ---');

try {
    const registration = generateRegistrationNumber(15);
    test('Registration has correct length', registration.length === 15);
    test('Registration is valid', validateRegistrationNumber(registration, 15) === true);
    test('Registration contains only alphanumeric', /^[A-Z0-9]+$/i.test(registration));
    
    const customRegistration = generateRegistrationNumber(20);
    test('Custom registration has correct length', customRegistration.length === 20);
    test('Custom registration is valid', validateRegistrationNumber(customRegistration, 20) === true);
} catch (error) {
    test('Registration generation', false, error.message);
}

// REGISTRATION VALIDATION TESTS
console.log('\n--- REGISTRATION VALIDATION TESTS ---');

test('Valid registration: ABC123DEF456GHI', validateRegistrationNumber('ABC123DEF456GHI', 15) === true);
test('Invalid registration: wrong length', validateRegistrationNumber('ABC123', 15) === false);
test('Invalid registration: contains special chars', validateRegistrationNumber('ABC123@DEF456GHI', 15) === false);
test('Invalid registration: empty string', validateRegistrationNumber('', 15) === false);
test('Invalid registration: not a string', validateRegistrationNumber(12345, 15) === false);

// EDGE CASES AND ERROR HANDLING
console.log('\n--- EDGE CASES AND ERROR HANDLING ---');

// CPF edge cases
test('CPF validation with spaces', validateCPF('123.456.789 - 09') === false);
test('CPF validation with lowercase letters', validateCPF('abc.def.ghi-jk') === false);

// CNPJ edge cases
test('CNPJ validation with spaces', CNPJGenerator.validate('11.444.777 / 0001-61') === false);

// Registration edge cases
test('Registration validation with spaces', validateRegistrationNumber('ABC 123 DEF 456', 15) === false);
test('Registration validation with special chars', validateRegistrationNumber('ABC-123-DEF-456', 15) === false);

// BULK GENERATION TESTS
console.log('\n--- BULK GENERATION TESTS ---');

try {
    const bulkCPFs = [];
    for (let i = 0; i < 10; i++) {
        const cpf = generateCPFWithFinalDigit(Math.floor(Math.random() * 10), false);
        bulkCPFs.push(cpf);
    }
    
    test('Bulk CPF generation: all generated', bulkCPFs.length === 10);
    test('Bulk CPF generation: all valid', bulkCPFs.every(cpf => validateCPF(cpf)));
    
    const bulkCNPJs = [];
    for (let i = 0; i < 10; i++) {
        const cnpj = CNPJGenerator.generate(1, false);
        bulkCNPJs.push(cnpj);
    }
    
    test('Bulk CNPJ generation: all generated', bulkCNPJs.length === 10);
    test('Bulk CNPJ generation: all valid', bulkCNPJs.every(cnpj => CNPJGenerator.validate(cnpj)));
} catch (error) {
    test('Bulk generation', false, error.message);
}

// TEST SUMMARY
console.log('\n=== TEST SUMMARY ===');
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);

if (testsFailed === 0) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
} else {
    console.log('\n⚠️  Some tests failed.');
    process.exit(1);
}