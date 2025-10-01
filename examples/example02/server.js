const grpc = require('@grpc/grpc-js');
const { FibonacciService } = require('../fibonacci_grpc_pb');
const { FibonacciResponse } = require('../fibonacci_pb');


function generateSequence(call) {
  const maxValue = call.request.getMaxValue();
  console.log(`[Servidor] Recebida requisição para gerar Fibonacci até ${maxValue}.`);

  let a = 0;
  let b = 1;

  if (a <= maxValue) {
    const response = new FibonacciResponse();
    response.setNumber(a);
    call.write(response);
  }

  while (b <= maxValue) {
    const response = new FibonacciResponse();
    response.setNumber(b);
    call.write(response);

    const next_b = a + b;
    a = b;
    b = next_b;
  }

  console.log('[Servidor] Sequência enviada. Finalizando o stream.');
  call.end();
}

function main() {
  const server = new grpc.Server();
  server.addService(FibonacciService, { generateSequence });
  
  const address = '0.0.0.0:50052';
  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Falha ao iniciar o servidor:', err);
      return;
    }
    console.log(`[Servidor] Exemplo 02 (Server Streaming) rodando em ${address}`);
  });
}

main();