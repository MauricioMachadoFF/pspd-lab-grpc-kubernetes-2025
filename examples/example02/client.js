const grpc = require('@grpc/grpc-js');
const readline = require('readline');
const { FibonacciClient } = require('../fibonacci_grpc_pb');
const { FibonacciRequest } = require('../fibonacci_pb');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const client = new FibonacciClient('localhost:50052', grpc.credentials.createInsecure());

  rl.question('Digite o valor máximo para a sequência de Fibonacci: ', (maxValueStr) => {
    const maxValue = parseInt(maxValueStr, 10);

    if (isNaN(maxValue) || maxValue < 0) {
      console.log('Por favor, digite um número inteiro não negativo.');
      rl.close();
      return;
    }

    const request = new FibonacciRequest();
    request.setMaxValue(maxValue);
    
    console.log(`\n[Cliente] Solicitando sequência de Fibonacci até ${maxValue}...`);

    const call = client.generateSequence(request);

    call.on('data', (response) => {
      console.log(`[Cliente] Recebido número: ${response.getNumber()}`);
    });

    call.on('end', () => {
      console.log('[Cliente] Stream finalizado pelo servidor.');
      rl.close();
    });

    call.on('error', (err) => {
      console.error(`[Cliente] Erro na chamada gRPC: ${err.details}`);
      rl.close();
    });

    call.on('status', (status) => {
      console.log(`[Cliente] Status da chamada: ${status.details} (código: ${status.code})`);
    });
  });
}

main();