
const prompt = require('prompt-sync')();

/**
 * Generates a CPF with a specific final digit
 * @param {number} targetDigit - The desired final digit (0-9)
 * @param {boolean} formatted - Whether to return formatted CPF (default: true)
 * @returns {string} Generated CPF
 * @throws {Error} If unable to generate CPF with target digit
 */
function generateCPFWithFinalDigit(targetDigit, formatted = true) {
    const randomDigit = (n) => Math.round(Math.random() * n);
    const mod = (dividend, divisor) => Math.round(dividend - (Math.floor(dividend / divisor) * divisor));
    
    const MAX_ITERATIONS = 10000;
    let iterations = 0;
    
    while (iterations < MAX_ITERATIONS) {
        iterations++;
        
        let n1 = 0;
        let n2 = randomDigit(9);
        let n3 = randomDigit(9);
        let n4 = randomDigit(9);
        let n5 = randomDigit(9);
        let n6 = randomDigit(9);
        let n7 = randomDigit(9);
        let n8 = randomDigit(9);
        let n9 = randomDigit(9);
        
        // Calculate first verification digit
        let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
        d1 = 11 - (mod(d1, 11));
        if (d1 >= 10) d1 = 0;
        
        // Calculate second verification digit
        let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
        d2 = 11 - (mod(d2, 11));
        if (d2 >= 10) d2 = 0;
        
        if (d2 === targetDigit) {
            const cpf = `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${d1}${d2}`;
            
            if (!formatted) return cpf;
            
            // Format CPF: XXX.XXX.XXX-XX
            return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
        }
    }
    
    throw new Error(`Unable to generate CPF with final digit ${targetDigit} after ${MAX_ITERATIONS} attempts`);
}

/**
 * Validates a CPF number
 * @param {string} cpf - CPF to validate (can be formatted or unformatted)
 * @returns {boolean} True if valid, false otherwise
 */
function validateCPF(cpf) {
    // Remove formatting
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    // Check length
    if (cleanCPF.length !== 11) return false;
    
    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    const mod = (dividend, divisor) => Math.round(dividend - (Math.floor(dividend / divisor) * divisor));
    
    // Calculate first verification digit
    let d1 = 0;
    for (let i = 0; i < 9; i++) {
        d1 += parseInt(cleanCPF[i]) * (10 - i);
    }
    d1 = 11 - (mod(d1, 11));
    if (d1 >= 10) d1 = 0;
    
    // Calculate second verification digit
    let d2 = 0;
    for (let i = 0; i < 10; i++) {
        d2 += parseInt(cleanCPF[i]) * (11 - i);
    }
    d2 = 11 - (mod(d2, 11));
    if (d2 >= 10) d2 = 0;
    
    return d1 === parseInt(cleanCPF[9]) && d2 === parseInt(cleanCPF[10]);
}

// Main execution (only when run directly)
if (require.main === module) {
    try {
        const digitInput = prompt('Digite o dígito final desejado (0-9): ');
        
        if (digitInput === null || digitInput === '') {
            console.error('Erro: Nenhum dígito fornecido.');
            process.exit(1);
        }
        
        const trimmedInput = digitInput.trim();
        
        if (!/^[0-9]$/.test(trimmedInput)) {
            console.error('Erro: Por favor, digite apenas um número de 0 a 9.');
            process.exit(1);
        }
        
        const targetDigit = parseInt(trimmedInput, 10);
        const generatedCPF = generateCPFWithFinalDigit(targetDigit, true);
        
        console.log(`[CPF GERADO] ${generatedCPF} (Final esperado: ${targetDigit})`);
        console.log(`[CPF SEM MÁSCARA] ${generatedCPF.replace(/[^\d]/g, '')}`);
        console.log(`[VALIDAÇÃO] ${validateCPF(generatedCPF) ? 'Válido' : 'Inválido'}`);
    } catch (error) {
        console.error(`Erro: ${error.message}`);
        process.exit(1);
    }
}

module.exports = {
    generateCPFWithFinalDigit,
    validateCPF
};