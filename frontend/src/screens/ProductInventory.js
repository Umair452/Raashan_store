import React, { useState, useEffect, useContext } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Card from 'react-bootstrap/Card';
import { Store } from '../Store';
import Button from 'react-bootstrap/Button';

const InventoryComponent = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  // const sp = new URLSearchParams(search);
  // const page = sp.get('page') || 1;
  const [totalProducts, setTotalProducts] = useState(null);
  const [totalCountInStock, setTotalCountInStock] = useState(null);
  const [productsWithZeroCountInStock, setProductsWithZeroCountInStock] =
    useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`/api/products/admin/inventory `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setTotalProducts(response.data.countProducts);
        setTotalCountInStock(response.data.totalCountInStock);
        setProductsWithZeroCountInStock(response.data.outofstockproducts);
        setLowStockProducts(response.data.lowStockProducts);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  },);

  return (
    <div>
      {totalProducts !== null && totalCountInStock !== null ? (
        <div>
          {/* <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>{totalProducts}</Card.Title>
                  <Card.Text> Total Products </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row> */}
          <h1
            style={{
              textAlign: 'center',
              marginBottom: '15px',
              textDecoration: '',
              color: '#712E1E',
            }}
          >
            Out of Stock Products
          </h1>
          {productsWithZeroCountInStock.length > 0 && (
            // <div>
            //   <h2 style={{ marginTop: '6px' }}>Out of Stock Products</h2>
            //   <ul
            //     style={{
            //       backgroundColor: '#ffc93c',
            //       color: 'white',
            //       listStyleType: 'number',
            //       width: '200px',
            //       fontSize:'17px'
            //     }}
            //   >
            //     {productsWithZeroCountInStock.map((product) => (
            //       <li key={product._id} style={{ margin: '7px' }}>
            //         {product.name}
            //         {product.price}
            //         {product.category}
            //       </li>
            //     ))}
            //   </ul>
            //   <h2 style={{ marginTop: '6px' }}>Product less than 10:</h2>
            //   <ul style={{
            //       backgroundColor: '#ffc93c',
            //       color: 'white',
            //       listStyleType: 'number',
            //       width: '315px',
            //       fontSize:'17px'
            //     }}>
            //     {lowStockProducts.map((product) => (
            //       <li key={product._id}>
            //         {product.name} - CountInStock: {product.countInStock}
            //       </li>
            //     ))}
            //   </ul>
            // </div>
            <table className="table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {productsWithZeroCountInStock.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() =>
                          navigate(`/admin/productinventory/${product._id}`)
                        }
                      >
                        Edit
                      </Button>
                      &nbsp;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h1
            style={{
              textAlign: 'center',
              marginBottom: '15px',
              textDecoration: '',
              color: '#712E1E',
            }}
          >
            Product Stock less then 10
          </h1>
          <table className="table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>Count In Stock</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.countInStock}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() =>
                        navigate(`/admin/productinventory/${product._id}`)
                      }
                    >
                      Edit
                    </Button>
                    &nbsp;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default InventoryComponent;
