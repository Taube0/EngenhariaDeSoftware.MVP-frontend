// frontend/src/components/ProductList.js
import React, { useEffect, useState } from "react";
import { getProducts } from "../api";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Celulares Disponíveis</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.nome} - R$ {product.preco.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
