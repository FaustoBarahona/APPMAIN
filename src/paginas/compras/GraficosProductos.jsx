import React, { useEffect, useState } from 'react';
import { listarCompras } from '../../components/apiUrls';
import { Bar } from 'react-chartjs-2';

const GraficosCompras = () => {
  const [productSalesData, setProductSalesData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Compras por Producto',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });
  const [numberOfTopProducts, setNumberOfTopProducts] = useState(5);

  const fetchSalesData = () => {
    
    fetch(listarCompras)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.datos && Array.isArray(data.datos)) {
          const products = {};

          data.datos.forEach((purchase) => {
            purchase.detallesCompra.forEach((detail) => {
              const productName = detail.producto.nombre;
              const quantity = detail.cantidad;

              if (products[productName]) {
                products[productName] += quantity;
              } else {
                products[productName] = quantity;
              }
            });
          });

          // Ordenar los productos por ventas en orden descendente
          const sortedProducts = Object.keys(products).sort((a, b) => products[b] - products[a]);

      
          const topProducts = sortedProducts.slice(0, numberOfTopProducts);

        
          const filteredLabels = [];
          const filteredData = [];
          topProducts.forEach((product) => {
            filteredLabels.push(product);
            filteredData.push(products[product]);
          });

          setProductSalesData({
            labels: filteredLabels,
            datasets: [
              {
                label: 'Compras por Producto',
                data: filteredData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error('La respuesta de la API no contiene datos válidos.');
        }
      })
      .catch((error) => {
        console.error('Error al cargar los datos de compras', error);
      });
  };

  useEffect(() => {
    fetchSalesData();
  }, [numberOfTopProducts]);

  return (
    <div>
      <h2>Productos más Comprados</h2>
      <div>
        <label>Mostrar top productos: </label>
        <select value={numberOfTopProducts} onChange={(e) => setNumberOfTopProducts(e.target.value)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div style={{ height: '400px', width: '600px' }}>
        <Bar data={productSalesData} />
      </div>
    </div>
  );
};

export default GraficosCompras;



