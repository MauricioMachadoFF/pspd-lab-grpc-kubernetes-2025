const grpc = require('@grpc/grpc-js');
const readline = require('readline');
const { AverageCalculatorClient } = require('../average_grpc_pb');
const { AverageRequest } = require('../average_pb');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function main() {
  const client = new AverageCalculatorClient('localhost:50053', grpc.credentials.createInsecure());

  const call = client.calculateAverage((err, response) => {
    if (err) {
      return console.error('[Cliente] Erro ao receber resposta do servidor:', err.details);
    }
    console.log(`\n[Cliente] A média calculada pelo servidor é: ${response.getAverage()}`);
  });
  
  console.log("Digite os números para calcular a média. Digite 'done' para finalizar.");

  function askForNumber() {
    rl.question('Digite um número (ou "done"): ', (input) => {
      if (input.toLowerCase() === 'done') {
        console.log('[Cliente] Finalizando o envio de números...');
        call.end(); 
        rl.close();
        return;
      }

      const number = parseFloat(input);
      if (isNaN(number)) {
        console.log('Entrada inválida. Por favor, digite um número.');
      } else {
        const request = new AverageRequest();
        request.setNumber(number);
        call.write(request);
      }
      
      askForNumber();
    });
  }

  askForNumber();
}

main();