import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Produtos
export const getProdutos = () => api.get('/produtos');
export const criarProduto = (produto) => api.post('/produtos', produto);
export const popularProdutos = () => api.post('/produtos/seed');

// Pedidos
export const getPedidos = () => api.get('/pedidos');
export const criarPedido = (pedido) => api.post('/pedidos', pedido);
export const atualizarPedido = (id, pedido) => api.put(`/pedidos/${id}`, pedido);
export const deletarPedido = (id) => api.delete(`/pedidos/${id}`);

// Frete (com fallback no backend)
export const calcularFrete = (cep) => api.post('/frete', { cep_destino: cep });

export default api;
