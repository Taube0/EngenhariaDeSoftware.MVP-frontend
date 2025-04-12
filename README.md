# 🛍️ Loja Frontend – React + FastAPI

Interface de uma loja online integrada com um backend REST em FastAPI e com dados de produtos oriundos da FakeStore API.

---

## 📦 Tecnologias

- React
- Axios
- React Toastify
- Docker

---

## 🔧 Funcionalidades

- Listagem de produtos com imagens e preços
- Carrinho de compras com totalizador
- Envio de pedidos para o backend
- Remoção de pedidos existentes
- Popular produtos automaticamente via botão (FakeStore)

---

## 🚀 Comandos

### Rodar localmente (dev):

```bash
cd frontend
npm install
npm start
```

### Rodar via Docker:

```bash
docker-compose build frontend
docker-compose up frontend
```

---

## 📡 Integração com API

O frontend se comunica com as seguintes rotas da API backend:

| Método | Rota            | Ação no Frontend           |
|--------|------------------|----------------------------|
| GET    | /produtos        | Carrega produtos           |
| POST   | /produtos/seed   | Popula produtos da API     |
| GET    | /pedidos         | Lista todos os pedidos     |
| POST   | /pedidos         | Cria pedido com o carrinho |
| DELETE | /pedidos/{id}    | Remove pedido              |

---

## 🗂️ Estrutura

```
frontend/
├── src/
│   ├── App.js           # Componente principal
│   ├── api.js           # Requisições HTTP via Axios
│   └── App.css
├── public/
├── Dockerfile
├── package.json
```

---

## 🖼️ Arquitetura

```
[ React Frontend ] → [ FastAPI Backend ] → [ PostgreSQL + FakeStoreAPI ]
```
