const readline = require('readline');
const fs = require('fs');
const { generateCPFWithFinalDigit, validateCPF } = require('./geradorCPF');
const { CNPJGenerator } = require('./geradorCNPJ');
const { generateRegistrationNumber, validateRegistrationNumber } = require('./geradorMatricula');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Displays the main menu
 */
function displayMenu() {
    console.log('\n=== GERADOR DE DOCUMENTOS BRASILEIROS ===');
    console.log('1. Gerar CPF');
    console.log('2. Gerar CNPJ');
    console.log('3. Gerar Matrícula');
    console.log('4. Gerar em Lote (Batch)');
    console.log('5. Validar Documento');
    console.log('0. Sair');
    console.log('==========================================');
}

/**
 * Asks for user input with a prompt
 * @param {string} question - Question to ask
 * @returns {Promise<string>} User response
 */
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

/**
 * Handles CPF generation
 */
async function handleCPFGeneration() {
    try {
        const digitInput = await askQuestion('Digite o dígito final desejado (0-9): ');
        
        if (!/^[0-9]$/.test(digitInput)) {
            console.error('Erro: Por favor, digite apenas um número de 0 a 9.');
            return;
        }
        
        const targetDigit = parseInt(digitInput, 10);
        const formatted = await askQuestion('Formatar CPF? (s/n): ');
        const shouldFormat = formatted.toLowerCase() === 's';
        
        const generatedCPF = generateCPFWithFinalDigit(targetDigit, shouldFormat);
        const unformattedCPF = generatedCPF.replace(/[^\d]/g, '');
        
        console.log(`\n[CPF GERADO] ${generatedCPF}`);
        console.log(`[SEM MÁSCARA] ${unformattedCPF}`);
        console.log(`[VALIDAÇÃO] ${validateCPF(generatedCPF) ? 'Válido' : 'Inválido'}`);
    } catch (error) {
        console.error(`Erro: ${error.message}`);
    }
}

/**
 * Handles CNPJ generation
 */
async function handleCNPJGeneration() {
    try {
        const optionInput = await askQuestion('Escolha o tipo (1-Numérico, 2-Alfanumérico): ');
        
        if (!/^[12]$/.test(optionInput)) {
            console.error('Erro: Opção inválida. Escolha 1 ou 2.');
            return;
        }
        
        const formatted = await askQuestion('Formatar CNPJ? (s/n): ');
        const shouldFormat = formatted.toLowerCase() === 's';
        
        const cnpj = CNPJGenerator.generate(optionInput, shouldFormat);
        const unformattedCNPJ = cnpj.replace(/[^\w]/g, '');
        
        console.log(`\n[CNPJ GERADO] ${cnpj}`);
        console.log(`[SEM MÁSCARA] ${unformattedCNPJ}`);
        console.log(`[VALIDAÇÃO] ${CNPJGenerator.validate(cnpj) ? 'Válido' : 'Inválido'}`);
    } catch (error) {
        console.error(`Erro: ${error.message}`);
    }
}

/**
 * Handles registration number generation
 */
async function handleRegistrationGeneration() {
    try {
        const lengthInput = await askQuestion('Digite o comprimento da matrícula (padrão: 15): ');
        const length = lengthInput ? parseInt(lengthInput, 10) : 15;
        
        if (isNaN(length) || length < 1) {
            console.error('Erro: Comprimento inválido.');
            return;
        }
        
        const registration = generateRegistrationNumber(length);
        
        console.log(`\n[MATRÍCULA GERADA] ${registration}`);
        console.log(`[VALIDAÇÃO] ${validateRegistrationNumber(registration, length) ? 'Válido' : 'Inválido'}`);
    } catch (error) {
        console.error(`Erro: ${error.message}`);
    }
}

/**
 * Handles batch generation
 */
async function handleBatchGeneration() {
    try {
        const docType = await askQuestion('Tipo de documento (cpf/cnpj/matricula): ');
        const quantityInput = await askQuestion('Quantidade a gerar: ');
        const quantity = parseInt(quantityInput, 10);
        
        if (isNaN(quantity) || quantity < 1 || quantity > 1000) {
            console.error('Erro: Quantidade deve ser entre 1 e 1000.');
            return;
        }
        
        console.log(`\n=== GERANDO ${quantity.toUpperCase()} ${docType.toUpperCase()}(S) ===`);
        
        const results = [];
        
        for (let i = 0; i < quantity; i++) {
            let result;
            
            switch (docType.toLowerCase()) {
                case 'cpf':
                    const randomDigit = Math.floor(Math.random() * 10);
                    result = generateCPFWithFinalDigit(randomDigit, true);
                    break;
                case 'cnpj':
                    const randomOption = Math.random() > 0.5 ? '1' : '2';
                    result = CNPJGenerator.generate(randomOption, true);
                    break;
                case 'matricula':
                    result = generateRegistrationNumber(15);
                    break;
                default:
                    console.error('Erro: Tipo de documento inválido.');
                    return;
            }
            
            results.push(result);
            console.log(`${i + 1}. ${result}`);
        }
        
        console.log(`\n=== TOTAL GERADO: ${quantity} ${docType.toUpperCase()}(S) ===`);
        
        const saveToFile = await askQuestion('Salvar resultados em arquivo? (s/n): ');
        if (saveToFile.toLowerCase() === 's') {
            const filename = `${docType}_batch_${Date.now()}.txt`;
            fs.writeFileSync(filename, results.join('\n'));
            console.log(`Resultados salvos em: ${filename}`);
        }
    } catch (error) {
        console.error(`Erro: ${error.message}`);
    }
}

/**
 * Handles document validation
 */
async function handleValidation() {
    try {
        const docType = await askQuestion('Tipo de documento (cpf/cnpj/matricula): ');
        const document = await askQuestion('Digite o documento para validar: ');
        
        let isValid;
        
        switch (docType.toLowerCase()) {
            case 'cpf':
                isValid = validateCPF(document);
                break;
            case 'cnpj':
                isValid = CNPJGenerator.validate(document);
                break;
            case 'matricula':
                isValid = validateRegistrationNumber(document);
                break;
            default:
                console.error('Erro: Tipo de documento inválido.');
                return;
        }
        
        console.log(`\n[VALIDAÇÃO] ${isValid ? 'VÁLIDO' : 'INVÁLIDO'}`);
    } catch (error) {
        console.error(`Erro: ${error.message}`);
    }
}

/**
 * Main application loop
 */
async function main() {
    console.log('Bem-vindo ao Gerador de Documentos Brasileiros!');
    
    while (true) {
        displayMenu();
        const choice = await askQuestion('Escolha uma opção: ');
        
        switch (choice) {
            case '1':
                await handleCPFGeneration();
                break;
            case '2':
                await handleCNPJGeneration();
                break;
            case '3':
                await handleRegistrationGeneration();
                break;
            case '4':
                await handleBatchGeneration();
                break;
            case '5':
                await handleValidation();
                break;
            case '0':
                console.log('Obrigado por usar o Gerador de Documentos Brasileiros!');
                rl.close();
                process.exit(0);
            default:
                console.error('Opção inválida. Tente novamente.');
        }
        
        const continueChoice = await askQuestion('\nPressione Enter para continuar...');
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n\nEncerrando aplicação...');
    rl.close();
    process.exit(0);
});

// Start the application (only when run directly)
if (require.main === module) {
    main().catch((error) => {
        console.error('Erro fatal:', error);
        rl.close();
        process.exit(1);
    });
}

module.exports = {
    handleCPFGeneration,
    handleCNPJGeneration,
    handleRegistrationGeneration,
    handleBatchGeneration,
    handleValidation
};