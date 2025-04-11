// frontend/src/components/OrderForm.js
import React, { useState } from "react";
import { createOrder } from "../api";

const OrderForm = () => {
  const [cliente, setCliente] = useState("");
  const [produtoId, setProdutoId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrder({
        cliente,
        produto_id: parseInt(produtoId),
      });
      alert("Pedido realizado com sucesso!");
      setCliente("");
      setProdutoId("");
    } catch (err) {
      alert("Erro ao realizar pedido!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Fazer Pedido</h2>
      <input
        type="text"
        placeholder="Nome do Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />
      <input
        type="number"
        placeholder="ID do Produto"
        value={produtoId}
        onChange={(e) => setProdutoId(e.target.value)}
      />
      <button type="submit">Comprar</button>
    </form>
  );
};

export default OrderForm;
