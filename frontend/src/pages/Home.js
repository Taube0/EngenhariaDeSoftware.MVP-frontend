import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import OrderForm from "../components/OrderForm";
import OrderList from "../components/OrderList";
import { getOrders } from "../api";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Loja de Celulares</h1>
      <ProductList />
      <OrderForm
        refreshOrders={fetchOrders}
        editingOrder={editingOrder}
        cancelEdit={() => setEditingOrder(null)}
      />
      <OrderList
        orders={orders}
        onEdit={(order) => setEditingOrder(order)}
        refreshOrders={fetchOrders}
      />
    </div>
  );
};

export default Home;
