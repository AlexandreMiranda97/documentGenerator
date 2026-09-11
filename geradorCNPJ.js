/**
 * CNPJ Generator (Numeric Traditional and Alphanumeric)
 * Supports both traditional numeric CNPJ and alphanumeric CNPJ formats
 */
const readline = require('readline');

class CNPJGenerator {
    /**
     * Converts character to numeric value according to Brazilian Federal Revenue standards
     * @param {string} char - Character to convert
     * @returns {number} Numeric value
     */
    static getCharValue(char) {
        const code = char.toUpperCase().charCodeAt(0);
        // '0'-'9' (48-57) -> 0-9 | 'A'-'Z' (65-90) -> 17-42
        return code - 48;
    }

    /**
     * Calculates the two verification digits (DV)
     * @param {string} base12 - First 12 characters of CNPJ
     * @returns {string} Two verification digits
     */
    static calculateDV(base12) {
        const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        // Calculate first verification digit
        let sum1 = 0;
        for (let i = 0; i < 12; i++) {
            sum1 += this.getCharValue(base12[i]) * weights1[i];
        }
        const rest1 = sum1 % 11;
        const dv1 = rest1 < 2 ? 0 : 11 - rest1;

        // Calculate second verification digit (includes DV1)
        const base13 = base12 + dv1;
        let sum2 = 0;
        for (let i = 0; i < 13; i++) {
            sum2 += this.getCharValue(base13[i]) * weights2[i];
        }
        const rest2 = sum2 % 11;
        const dv2 = rest2 < 2 ? 0 : 11 - rest2;

        return `${dv1}${dv2}`;
    }

    /**
     * Generates CNPJ based on selected option (1 or 2)
     * @param {number|string} option - 1 for Numeric, 2 for Alphanumeric
     * @param {boolean} formatted - Whether to return formatted CNPJ (default: true)
     * @returns {string} Generated CNPJ
     * @throws {Error} If option is invalid
     */
    static generate(option, formatted = true) {
        const charsAlpha = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const charsNumeric = "0123456789";

        let base = "";

        if (option === 1 || option === "1") {
            // Numeric: 8 root digits + 4 branch digits (e.g., 0001)
            for (let i = 0; i < 8; i++) {
                base += charsNumeric[Math.floor(Math.random() * charsNumeric.length)];
            }
            base += "0001"; // Default branch
        } else if (option === 2 || option === "2") {
            // Alphanumeric: 8 alphanumeric characters + 4 branch characters
            for (let i = 0; i < 8; i++) {
                base += charsAlpha[Math.floor(Math.random() * charsAlpha.length)];
            }
            for (let i = 0; i < 4; i++) {
                base += charsAlpha[Math.floor(Math.random() * charsAlpha.length)];
            }
        } else {
            throw new Error("Invalid option! Choose 1 for Numeric or 2 for Alphanumeric.");
        }

        const dv = this.calculateDV(base);
        const cnpjRaw = base + dv;

        if (!formatted) return cnpjRaw;

        // Format: XX.XXX.XXX/XXXX-XX
        return `${cnpjRaw.slice(0, 2)}.${cnpjRaw.slice(2, 5)}.${cnpjRaw.slice(5, 8)}/${cnpjRaw.slice(8, 12)}-${cnpjRaw.slice(12)}`;
    }

    /**
     * Validates a CNPJ number
     * @param {string} cnpj - CNPJ to validate (can be formatted or unformatted)
     * @returns {boolean} True if valid, false otherwise
     */
    static validate(cnpj) {
        // Remove formatting
        const cleanCNPJ = cnpj.replace(/[^\dA-Za-z]/g, '');
        
        // Check length
        if (cleanCNPJ.length !== 14) return false;
        
        // Check if all characters are the same
        if (/^(\w)\1{13}$/.test(cleanCNPJ)) return false;
        
        try {
            const base12 = cleanCNPJ.slice(0, 12);
            const calculatedDV = this.calculateDV(base12);
            const actualDV = cleanCNPJ.slice(12, 14);
            
            return calculatedDV === actualDV;
        } catch (error) {
            return false;
        }
    }
}

/**
 * Generates CNPJ by user option
 * @param {string} option - User selected option
 */
function generateByOption(option) {
    try {
        const cnpjFormatted = CNPJGenerator.generate(option, true);
        const cnpjUnformatted = cnpjFormatted.replace(/[^\w]/g, '');
        const isValid = CNPJGenerator.validate(cnpjFormatted);

        console.log(`\n--- CNPJ ---`);
        console.log(`Formatado:   ${cnpjFormatted}`);
        console.log(`Sem máscara: ${cnpjUnformatted}`);
        console.log(`Validação:   ${isValid ? 'Válido' : 'Inválido'}`);
    } catch (error) {
        console.error(`Erro: ${error.message}`);
        process.exit(1);
    }
}

// Main execution (only when run directly)
if (require.main === module) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Escolha o tipo de CNPJ (1-Numérico, 2-Alfanumérico): ', (opcao) => {
        const trimmedOption = opcao.trim();
        
        if (!/^[12]$/.test(trimmedOption)) {
            console.error('Erro: Opção inválida. Escolha 1 para Numérico ou 2 para Alfanumérico.');
            rl.close();
            process.exit(1);
        }
        
        generateByOption(trimmedOption);
        rl.close();
    });
}

module.exports = {
    CNPJGenerator
};