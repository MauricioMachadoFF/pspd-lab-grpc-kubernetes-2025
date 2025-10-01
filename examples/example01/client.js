const grpc = require('@grpc/grpc-js');
const readline = require('readline');
const { CalculatorClient } = require('../calculadora_grpc_pb');
const { BinaryOpRequest } = require('../calculadora_pb');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  const client = new CalculatorClient('localhost:50051', grpc.credentials.createInsecure());
  
  try {
    const operation = await askQuestion('Qual operação você quer fazer? (sum ou subtract): ');
    
    if (operation !== 'sum' && operation !== 'subtract') {
      console.log('Operação inválida. Tente "sum" ou "subtract".');
      rl.close();
      return;
    }

    const num1Str = await askQuestion('Digite o primeiro número: ');
    const num2Str = await askQuestion('Digite o segundo número: ');

    const num1 = parseFloat(num1Str);
    const num2 = parseFloat(num2Str);

    if (isNaN(num1) || isNaN(num2)) {
        console.log('Valores inválidos. Por favor, digite apenas números.');
        rl.close();
        return;
    }

    const request = new BinaryOpRequest();
    request.setNumber1(num1);
    request.setNumber2(num2);

    const method = (operation === 'sum') ? client.sum : client.subtract;

    method.call(client, request, (err, response) => {
      if (err) {
        console.error(`Erro ao chamar ${operation}:`, err.details || err.message);
      } else {
        console.log(`\nResultado de ${operation}(${num1}, ${num2}) = ${response.getResult()}`);
      }
      rl.close();
    });

  } catch (e) {
    console.error("Ocorreu um erro inesperado:", e);
    rl.close();
  }
}

main();