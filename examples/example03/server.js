const grpc = require('@grpc/grpc-js');
const { AverageCalculatorService } = require('../average_grpc_pb');
const { AverageResponse } = require('../average_pb');

function calculateAverage(call, callback) {
  let sum = 0;
  let count = 0;

  console.log('[Servidor] Aguardando stream de números do cliente...');

  call.on('data', (request) => {
    const number = request.getNumber();
    console.log(`[Servidor] Recebeu número: ${number}`);
    sum += number;
    count++;
  });

  call.on('error', (err) => {
    console.error('[Servidor] Erro no stream do cliente:', err);
  });
  
  call.on('end', () => {
    if (count === 0) {
      console.log('[Servidor] Nenhum número recebido. Finalizando.');
      const response = new AverageResponse();
      response.setAverage(0);
      callback(null, response);
      return;
    }

    const average = sum / count;
    console.log(`[Servidor] Stream finalizado. Média calculada: ${average}`);
    
    const response = new AverageResponse();
    response.setAverage(average);
    
    callback(null, response);
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(AverageCalculatorService, { calculateAverage });
  
  const address = '0.0.0.0:50053';
  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Falha ao iniciar o servidor:', err);
      return;
    }
    console.log(`[Servidor] Exemplo 03 (Client Streaming) rodando em ${address}`);
  });
}

main();