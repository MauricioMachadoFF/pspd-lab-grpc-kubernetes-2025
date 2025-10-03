# **Exercícios de gRPC com Node.js**

Este diretório contém quatro exemplos práticos que demonstram os quatro tipos de comunicação possíveis com gRPC em um ambiente Node.js. Cada exemplo está contido em sua própria pasta e pode ser executado de forma independente.

O projeto utiliza um único arquivo package.json na raiz para gerenciar as dependências e os scripts de execução de todos os exemplos.

## **Pré-requisitos**

Antes de começar, garanta que você tenha os seguintes softwares instalados em sua máquina:

* [Node.js](https://nodejs.org/) (versão 14 ou superior)  
* [npm](https://www.npmjs.com/) (geralmente instalado junto com o Node.js)

## **Instalação**

1. Navegue até a pasta examples que contém este projeto:
    ```bash
   cd examples/
   ```

2. Instale todas as dependências necessárias com um único comando:  

    ```bash
   npm install
   ```

## **Executando os Exemplos**

Para cada exemplo, você precisará de **dois terminais abertos** na raiz da pasta examples: um para rodar o servidor e outro para rodar o cliente.

### **Exemplo 01: Calculadora (Unary Call)**

* **Pasta:** example01/  
* **Descrição:** Este exemplo demonstra uma chamada **Unária**. É uma calculadora simples que realiza operações de soma e subtração. O cliente solicita ao usuário uma operação e dois números via terminal, envia uma única requisição ao servidor e recebe uma única resposta com o resultado.

#### **Como Executar**

1. **Gerar o código do Protobuf** (só precisa ser feito uma vez):
    
    ```bash
   npm run proto:gen1
   ```

2. **No Terminal 1**, inicie o servidor:  

    ```bash
   npm run start:ex1-server
   ```

3. **No Terminal 2**, inicie o cliente:  

    ```bash
   npm run start:ex1-client
   ```

#### **Saída Esperada**

O cliente se tornará interativo. Ele fará perguntas e, após receber as respostas, exibirá o resultado do servidor.

Qual operação você quer fazer? (sum ou subtract): sum  
Digite o primeiro número: 40  
Digite o segundo número: 2

Resultado de sum(40, 2\) \= 42

### **Exemplo 02: Sequência de Fibonacci (Server Streaming)**

* **Pasta:** example02/  
* **Descrição:** Este exemplo demonstra uma chamada de **Server Streaming**. O cliente envia uma única requisição contendo um número limite. O servidor responde com um *stream* de mensagens, enviando cada número da sequência de Fibonacci até aquele limite, um por um.

#### **Como Executar**

1. **Gerar o código do Protobuf**:  

    ```bash
   npm run proto:gen2
   ```

2. **No Terminal 1**, inicie o servidor:  

    ```bash
   npm run start:ex2-server
   ```

3. **No Terminal 2**, inicie o cliente:  
    ```bash
   npm run start:ex2-client
   ```

#### **Saída Esperada**

O cliente pedirá um número. Após o envio, ele começará a receber e imprimir os números do stream vindo do servidor.

Digite o valor máximo para a sequência de Fibonacci: 30

\[Cliente\] Solicitando sequência de Fibonacci até 30...  
\[Cliente\] Recebido número: 0  
\[Cliente\] Recebido número: 1  
\[Cliente\] Recebido número: 1  
\[Cliente\] Recebido número: 2  
\[Cliente\] Recebido número: 3  
\[Cliente\] Recebido número: 5  
\[Cliente\] Recebido número: 8  
\[Cliente\] Recebido número: 13  
\[Cliente\] Recebido número: 21  
\[Cliente\] Stream finalizado pelo servidor.

### **Exemplo 03: Média de Números (Client Streaming)**

* **Pasta:** example03/  
* **Descrição:** Este exemplo demonstra uma chamada de **Client Streaming**. O cliente envia um *stream* de números para o servidor. Quando o cliente finaliza o envio (digitando "done"), o servidor calcula a média de todos os números recebidos e retorna uma única resposta.

#### **Como Executar**

1. **Gerar o código do Protobuf**:
    ```bash
   npm run proto:gen3
   ```

2. **No Terminal 1**, inicie o servidor:  
    ```bash
   npm run start:ex3-server
   ```

3. **No Terminal 2**, inicie o cliente: 
    ```bash
   npm run start:ex3-client
   ``` 

#### **Saída Esperada**

O cliente permitirá que você digite vários números. Ao final, ele exibirá a resposta única do servidor.

Digite os números para calcular a média. Digite 'done' para finalizar.  
Digite um número (ou "done"): 10  
Digite um número (ou "done"): 15  
Digite um número (ou "done"): 20  
Digite um número (ou "done"): done  
\[Cliente\] Finalizando o envio de números...

\[Cliente\] A média calculada pelo servidor é: 15

### **Exemplo 04: Chat Simples (Bidirectional Streaming)**

* **Pasta:** example04/  
* **Descrição:** Este exemplo demonstra uma chamada de **Bidirectional Streaming**. É uma aplicação de chat em tempo real onde tanto o cliente quanto o servidor podem enviar e receber mensagens de forma assíncrona.

#### **Como Executar**

1. **Gerar o código do Protobuf**:  
    ```bash
   npm run proto:gen4
   ```

2. **No Terminal 1**, inicie o servidor: 
    ```bash
   npm run start:ex4-server
   ``` 

3. **No Terminal 2**, inicie o cliente:  
    ```bash
   npm run start:ex4-client
   ```

#### **Saída Esperada**

A interação é um chat em tempo real. O cliente pedirá seu nome. Em seguida, você poderá enviar mensagens, que serão respondidas pelo servidor.

**Exemplo de interação no terminal do Cliente:**

Por favor, digite seu nome de usuário: Natan  
Bem-vindo ao chat, Natan\! Digite 'exit' para sair.

Olá, tudo bem?  
\[Servidor\]: Olá, Natan\! Recebi sua mensagem: "Olá, tudo bem?"