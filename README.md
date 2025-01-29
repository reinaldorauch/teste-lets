# Teste LETS

Repositório para submeter a avaliação para a vaga de backend senior na LETS

## Como rodar o código

Dependências:

- aws-cli
- aws-sam
- nodejs@22
- pnpm@10

Antes de tudo, rode o comando para instalar as dependencias de desenvolvimento:

```sh
pnpm install
```

Para fazer o deploy das funções no AWS Lambda é nessesário o [aws-cli](https://aws.amazon.com/pt/cli/)
configurado com permissões do AWS Lambda e do DynamoDB e o [aws-sam-cli](https://aws.amazon.com/pt/serverless/sam/)
para orquestrar a criação do stack na AWS

Rode o comando:

```sh
pnpm deploy-stack
```

Para rodar os testes unitários rode o comando:

```sh
pnpm test
```

Para rodar os testes unitários com code coverate rode o comando

```sh
pnpm coverage
```

- Para rodar os testes e2e é necessário uma instância do DynamoDB local com o
  endpoint configurado no arquivo `.env`. Leia mais aqui: [Rodar o DynamoDB localmente](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html#docker)

```sh
cp .env.example .env
```

Edite o arquivo .env para definir o `AWS_ENDPOINT_URL` para o endpoint da sua
instância do DynamoDB.

Com ela rodando, rode o comando abaixo:

```sh
pnpm test-e2e
```

Para rodar os testes e2e com code coverage, rode o comando:

```sh
pnpm coverage-e2e
```

## Arquitetura da API

Ela disponibiliza o recurso clientes nas rotas (use a url retornada pelo comando
deploy como base):

- `GET /clients` - Lista os clientes da aplicação
- `POST /clients` - Cadastra novo cliente da aplicação
- `GET /clients/{id}` - Recupera um cliente pelo seu ID
- `PUT /clients/{id}` - Atualiza um cliente pelo seu ID
- `DELETE /clients/{id}` - Remove um cliente pelo seu ID
