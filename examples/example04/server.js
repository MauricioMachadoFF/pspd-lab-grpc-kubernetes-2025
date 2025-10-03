const grpc = require('@grpc/grpc-js');
const { ChatService } = require('../chat_grpc_pb');
const { ChatMessage } = require('../chat_pb');

function startChat(call) {
  console.log('[Servidor] Novo cliente conectado ao chat.');

  call.on('data', (request) => {
    const user = request.getUser();
    const message = request.getMessage();
    console.log(`[Servidor] Mensagem recebida de '${user}': ${message}`);

    const response = new ChatMessage();
    response.setUser('Servidor');
    response.setMessage(`Olá, ${user}! Recebi sua mensagem: "${message}"`);
    call.write(response);
  });

  call.on('end', () => {
    console.log('[Servidor] Cliente desconectado.');
    call.end();
  });
  
  call.on('error', (err) => {
    console.error('[Servidor] Erro no chat:', err);
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(ChatService, { startChat });
  
  const address = '0.0.0.0:50054';
  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Falha ao iniciar o servidor:', err);
      return;
    }
    console.log(`[Servidor] Exemplo 04 (Bidirectional Streaming) rodando em ${address}`);
  });
}

main();