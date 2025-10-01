const grpc = require('@grpc/grpc-js');
const readline = require('readline');
const { ChatClient } = require('../chat_grpc_pb');
const { ChatMessage } = require('../chat_pb');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function main() {
  const client = new ChatClient('localhost:50054', grpc.credentials.createInsecure());
  
  rl.question('Por favor, digite seu nome de usuário: ', (user) => {
    console.log(`Bem-vindo ao chat, ${user}! Digite 'exit' para sair.\n`);
    
    const call = client.startChat();
    
    call.on('data', (response) => {
      console.log(`[${response.getUser()}]: ${response.getMessage()}`);
    });

    call.on('end', () => {
      console.log('Conexão com o servidor finalizada.');
      rl.close();
    });

    call.on('error', (err) => {
      console.error('Erro na conexão:', err);
      rl.close();
    });

    rl.on('line', (line) => {
      if (line.toLowerCase() === 'exit') {
        call.end();
      } else {
        const request = new ChatMessage();
        request.setUser(user);
        request.setMessage(line);
        call.write(request);
      }
    });
  });
}

main();