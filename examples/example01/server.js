const grpc = require('@grpc/grpc-js');
const { CalculatorService } = require('../calculadora_grpc_pb');
const { CalculatorResponse } = require('../calculadora_pb');

const calculator = {
  sum: (call, callback) => {
    const response = new CalculatorResponse();
    const result = call.request.getNumber1() + call.request.getNumber2();
    response.setResult(result);
    console.log(`[Servidor] Sum: ${call.request.getNumber1()} + ${call.request.getNumber2()} = ${result}`);
    callback(null, response);
  },
  subtract: (call, callback) => {
    const response = new CalculatorResponse();
    const result = call.request.getNumber1() - call.request.getNumber2();
    response.setResult(result);
    console.log(`[Servidor] Subtract: ${call.request.getNumber1()} - ${call.request.getNumber2()} = ${result}`);
    callback(null, response);
  }
};

function main() {
  const server = new grpc.Server();
  server.addService(CalculatorService, calculator);
  
  const address = '0.0.0.0:50051';
  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Falha ao iniciar o servidor:', err);
      return;
    }
    console.log(`[Servidor] Exemplo 01 (Unary) rodando em ${address}`);
  });
}

main();