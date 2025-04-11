import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  getProdutos,
  getPedidos,
  criarPedido,
  deletarPedido,
  popularProdutos,
} from './api';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [cliente, setCliente] = useState(localStorage.getItem('cliente') || '');
  const [carrinho, setCarrinho] = useState(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });
  const [cepFrete, setCepFrete] = useState('');
  const [frete, setFrete] = useState(null);
  const [calculandoFrete, setCalculandoFrete] = useState(false);

  const carregarProdutos = async () => {
    const existing = await getProdutos();
    if (existing.data.length === 0) {
      await popularProdutos();
      const res = await getProdutos();
      setProdutos(res.data);
    } else {
      setProdutos(existing.data);
    }
  };

  const carregarPedidos = async () => {
    const res = await getPedidos();
    setPedidos(res.data);
  };

  const salvarCarrinho = (novoCarrinho) => {
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    setCarrinho(novoCarrinho);
  };

  const adicionarAoCarrinho = (produto) => {
    const novoCarrinho = [...carrinho, produto];
    salvarCarrinho(novoCarrinho);
    toast.success(`Adicionado: ${produto.nome}`);
  };

  const removerDoCarrinho = (index) => {
    const produto = carrinho[index];
    const novoCarrinho = carrinho.filter((_, i) => i !== index);
    salvarCarrinho(novoCarrinho);
    toast.info(`Removido: ${produto.nome}`);
  };

  const handleCriarPedido = async () => {
    if (!cliente || carrinho.length === 0) return;
    for (const p of carrinho) {
      await criarPedido({ cliente, produto_id: p.id });
    }
    salvarCarrinho([]);
    localStorage.removeItem('carrinho');
    localStorage.removeItem('cliente');
    setCliente('');
    setFrete(null);
    setCepFrete('');
    carregarPedidos();
    toast.success('Pedido criado com sucesso!');
  };

  const handleDeletar = async (id) => {
    await deletarPedido(id);
    carregarPedidos();
    toast.warn('Pedido excluído.');
  };

  const consultarFrete = async () => {
    if (!cepFrete) return;
    try {
      setCalculandoFrete(true);
      const res = await axios.post('http://localhost:8000/frete', {
        cep_destino: cepFrete,
      });
      setFrete(res.data);
    } catch (error) {
      toast.error("Erro ao calcular frete");
      setFrete(null);
    } finally {
      setCalculandoFrete(false);
    }
  };

  const totalCarrinho = carrinho.reduce((total, p) => total + p.preco, 0);
  const valorFrete = frete ? parseFloat(frete.valor) : 0;
  const totalGeral = totalCarrinho + valorFrete;

  useEffect(() => {
    carregarProdutos();
    carregarPedidos();
  }, []);

  useEffect(() => {
    localStorage.setItem('cliente', cliente);
  }, [cliente]);

  return (
    <div className="container">
      <ToastContainer />

      <header>
        <h1>Loja Sustentável</h1>
      </header>

      <section>
        <h2>Produtos</h2>
        <div className="product-list">
          {produtos.map((p) => (
            <div className="product" key={p.id}>
              <img src={p.imagem_url} alt={p.nome} />
              <h3>{p.nome}</h3>
              <p>R$ {p.preco.toFixed(2)}</p>
              <button onClick={() => adicionarAoCarrinho(p)}>
                Adicionar ao carrinho
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="cart">
        <h2>Carrinho</h2>
        {carrinho.length === 0 ? (
          <p>O carrinho está vazio.</p>
        ) : (
          <>
            {carrinho.map((p, index) => (
              <div className="cart-item" key={index}>
                <span>
                  {p.nome} - R$ {p.preco.toFixed(2)}
                </span>
                <button onClick={() => removerDoCarrinho(index)}>
                  Remover
                </button>
              </div>
            ))}
            <h3>Total de produtos: R$ {totalCarrinho.toFixed(2)}</h3>
            {frete && !calculandoFrete && (
              <h3>Frete: R$ {valorFrete.toFixed(2)}</h3>
            )}
            {frete && (
              <h3>
                Total geral:{' '}
                <strong
                  style={{
                    color: '#fff',
                    backgroundColor: '#198754',
                    padding: '6px 10px',
                    borderRadius: '5px',
                  }}
                >
                  R$ {totalGeral.toFixed(2)}
                </strong>
              </h3>
            )}
          </>
        )}
      </section>

      <section className="form-container">
        <h2>Finalizar Pedido</h2>
        <input
          placeholder="Nome do cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />

        <input
          placeholder="CEP para calcular frete"
          value={cepFrete}
          onChange={(e) => setCepFrete(e.target.value)}
        />
        <button onClick={consultarFrete}>Calcular Frete</button>

        {calculandoFrete && (
          <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#666' }}>
            Calculando frete...
          </p>
        )}

        {frete && !calculandoFrete && (
          <div className="frete-box">
            <p>
              <span role="img" aria-label="pacote">📦</span> Frete SEDEX: <strong>R$ {frete.valor}</strong><br />
              <span role="img" aria-label="relógio">⏱️</span> Prazo estimado: <strong>{frete.prazo} dias úteis</strong>
            </p>
            {frete.valor === "24.90" && (
              <span className="frete-aviso">(valor simulado para fins de teste)</span>
            )}
          </div>
        )}

        <br />
        <button
          onClick={handleCriarPedido}
          disabled={!cliente || carrinho.length === 0}
        >
          Criar Pedido
          {frete && (
            <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
              (Total: R$ {totalGeral.toFixed(2)})
            </span>
          )}
        </button>
      </section>

      <section>
        <h2>Pedidos</h2>
        <ul>
          {pedidos.map((p) => {
            const produto = produtos.find((prod) => prod.id === p.produto_id);
            return (
              <li key={p.id}>
                <strong>{p.cliente}</strong> comprou:
                {produto && (
                  <>
                    <br />
                    <img
                      src={produto.imagem_url}
                      alt={produto.nome}
                      width="60"
                      style={{
                        verticalAlign: 'middle',
                        objectFit: 'contain',
                      }}
                    />
                    <span style={{ marginLeft: '10px' }}>
                      {produto.nome} - R$ {produto.preco.toFixed(2)}
                    </span>
                  </>
                )}
                <button
                  style={{ marginLeft: '15px' }}
                  onClick={() => handleDeletar(p.id)}
                >
                  Excluir
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export default App;
