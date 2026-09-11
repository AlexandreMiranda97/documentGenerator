/**
 * Generates a random alphanumeric registration number
 * @param {number} length - Length of the registration number (default: 15)
 * @returns {string} Generated registration number
 */
function generateRegistrationNumber(length = 15) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let registration = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        registration += characters[randomIndex];
    }
    
    return registration;
}

/**
 * Validates a registration number format
 * @param {string} registration - Registration number to validate
 * @param {number} expectedLength - Expected length (default: 15)
 * @returns {boolean} True if valid format, false otherwise
 */
function validateRegistrationNumber(registration, expectedLength = 15) {
    if (typeof registration !== 'string') return false;
    if (registration.length !== expectedLength) return false;
    return /^[A-Z0-9]+$/i.test(registration);
}

// Main execution (only when run directly)
if (require.main === module) {
    try {
        const registrationNumber = generateRegistrationNumber(15);
        console.log(`[MATRÍCULA GERADA] ${registrationNumber}`);
        console.log(`[VALIDAÇÃO] ${validateRegistrationNumber(registrationNumber) ? 'Válido' : 'Inválido'}`);
    } catch (error) {
        console.error(`Erro: ${error.message}`);
        process.exit(1);
    }
}

module.exports = {
    generateRegistrationNumber,
    validateRegistrationNumber
};