# 🇧🇷 Gerador de Documentos Brasileiros

Um gerador de documentos brasileiros (CPF, CNPJ e Matrícula) com validação, interface CLI unificada e geração em lote.

## 🚀 Funcionalidades

- **Gerador de CPF**: Gera CPFs com dígito final específico, com e sem formatação
- **Gerador de CNPJ**: Suporta CNPJ numérico tradicional e alfanumérico
- **Gerador de Matrícula**: Gera números de matrícula alfanuméricos personalizados
- **Validação**: Valida CPF, CNPJ e matrículas geradas
- **Interface CLI Unificada**: Menu interativo para acessar todas as funcionalidades
- **Geração em Lote**: Gera múltiplos documentos de uma vez
- **Exportação**: Salva resultados em arquivos de texto
- **Tratamento de Erros**: Validação de entrada e mensagens de erro claras
- **Documentação**: JSDoc completo para todas as funções

## 📋 Pré-requisitos

- Node.js (versão 12 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório ou navegue até a pasta do projeto:
```bash
cd "GERADOR CPF"
```

2. Instale as dependências:
```bash
npm install
```

## 🎯 Uso

### Interface CLI Unificada (Recomendado)

Execute o menu principal para acessar todas as funcionalidades:

```bash
node index.js
```

O menu oferece as seguintes opções:
1. Gerar CPF
2. Gerar CNPJ
3. Gerar Matrícula
4. Gerar em Lote (Batch)
5. Validar Documento
0. Sair

### Execução Individual

#### Gerar CPF

```bash
node geradorCPF.js
```

Você será solicitado a digitar o dígito final desejado (0-9).

#### Gerar CNPJ

```bash
node geradorCNPJ.js
```

Escolha entre:
- 1: CNPJ Numérico (tradicional)
- 2: CNPJ Alfanumérico

#### Gerar Matrícula

```bash
node geradorMatricula.js
```

Gera uma matrícula alfanumérica de 15 caracteres por padrão.

## 📚 Uso Programático

### CPF

```javascript
const { generateCPFWithFinalDigit, validateCPF } = require('./geradorCPF');

// Gerar CPF com final específico (formatado)
const cpf = generateCPFWithFinalDigit(5, true);
console.log(cpf); // "123.456.789-05"

// Gerar CPF sem formatação
const cpfRaw = generateCPFWithFinalDigit(5, false);
console.log(cpfRaw); // "12345678905"

// Validar CPF
const isValid = validateCPF("123.456.789-05");
console.log(isValid); // true ou false
```

### CNPJ

```javascript
const { CNPJGenerator } = require('./geradorCNPJ');

// Gerar CNPJ numérico
const cnpjNumeric = CNPJGenerator.generate(1, true);
console.log(cnpjNumeric); // "12.345.678/0001-95"

// Gerar CNPJ alfanumérico
const cnpjAlpha = CNPJGenerator.generate(2, true);
console.log(cnpjAlpha); // "A1.B2C.3D4/E5F6-G7"

// Validar CNPJ
const isValid = CNPJGenerator.validate("12.345.678/0001-95");
console.log(isValid); // true ou false
```

### Matrícula

```javascript
const { generateRegistrationNumber, validateRegistrationNumber } = require('./geradorMatricula');

// Gerar matrícula com comprimento padrão (15)
const registration = generateRegistrationNumber();
console.log(registration); // "A1B2C3D4E5F6G7H"

// Gerar matrícula com comprimento personalizado
const customRegistration = generateRegistrationNumber(20);
console.log(customRegistration); // "A1B2C3D4E5F6G7H8I9J0"

// Validar matrícula
const isValid = validateRegistrationNumber("A1B2C3D4E5F6G7H");
console.log(isValid); // true ou false
```

## 🔄 Geração em Lote

Através da interface CLI, você pode gerar múltiplos documentos de uma vez:

1. Execute `node index.js`
2. Escolha a opção 4 (Gerar em Lote)
3. Selecione o tipo de documento (cpf/cnpj/matricula)
4. Informe a quantidade (1-1000)
5. Opcionalmente, salve os resultados em um arquivo

## ✨ Melhorias Implementadas

### Correções de Bugs Críticos
- ✅ Corrigido variável `opcao` indefinida em `geradorCNPJ.js`
- ✅ Adicionada validação de entrada em `geradorCPF.js`
- ✅ Implementado timeout safeguard para prevenir loops infinitos

### Estrutura do Projeto
- ✅ Criado arquivo `.gitignore` para excluir `node_modules`
- ✅ Interface CLI unificada em `index.js`
- ✅ Modularização com exportação de funções

### Qualidade do Código
- ✅ Padronização de estilo de código em todos os arquivos
- ✅ Tratamento de erros comprehensivo
- ✅ JSDoc completo para documentação
- ✅ Nomenclatura consistente (inglês para código, português para interface)

### Funcionalidades
- ✅ Funções de validação para CPF, CNPJ e matrícula
- ✅ Geração em lote com opção de exportação
- ✅ Formatação opcional de documentos
- ✅ Menu interativo amigável

### Dependências e Modernização
- ✅ Scripts npm configurados
- ✅ Metadados do projeto atualizados
- ✅ Código modular e reutilizável

## 🧪 Testes

Para testar as funções de validação:

```bash
node test.js
```

## 📝 Scripts Disponíveis

No `package.json`:

```json
{
  "scripts": {
    "start": "node index.js",
    "cpf": "node geradorCPF.js",
    "cnpj": "node geradorCNPJ.js",
    "matricula": "node geradorMatricula.js",
    "test": "node test.js"
  }
}
```

Uso:
```bash
npm start           # Inicia o menu principal
npm run cpf         # Executa gerador de CPF
npm run cnpj        # Executa gerador de CNPJ
npm run matricula   # Executa gerador de matrícula
npm test            # Executa testes
```

## 🛠️ Desenvolvimento

### Estrutura de Arquivos

```
GERADOR CPF/
├── index.js              # Interface CLI unificada
├── geradorCPF.js         # Gerador e validador de CPF
├── geradorCNPJ.js        # Gerador e validador de CNPJ
├── geradorMatricula.js   # Gerador e validador de matrícula
├── test.js              # Testes unitários
├── package.json         # Dependências e scripts
├── README.md           # Documentação
└── .gitignore          # Arquivos ignorados pelo git
```

### Adicionando Novos Geradores

Para adicionar um novo gerador:

1. Crie um novo arquivo (ex: `geradorXYZ.js`)
2. Implemente as funções de geração e validação
3. Exporte as funções usando `module.exports`
4. Importe e integre em `index.js`
5. Adicione opção ao menu principal

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto é fornecido como está para fins educacionais e de teste.

## ⚠️ Aviso Legal

Este gerador deve ser usado apenas para:
- Desenvolvimento e teste de software
- Validação de formulários
- Demonstrações educacionais
- Testes de integração

Não use para fins fraudulentos ou ilegais. Os documentos gerados são fictícios e não devem ser usados como identificação real.

## 👤 Autor

Desenvolvido para fins de prática e aprendizado.

## 📞 Suporte

Para problemas ou sugestões, abra uma issue no repositório.