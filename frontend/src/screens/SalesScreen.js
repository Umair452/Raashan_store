import React, { useContext, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Store } from '../Store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
export default function SalesScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [startDate, setStartDate] = useState(new Date());
  const [error, setError] = useState('');
  const [totalSales, setTotalSales] = useState(null);
  const [totalOrder, setTotalOrder] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const month = startDate.getMonth() + 1;
    const year = startDate.getFullYear();

    try {
      const response = await axios.post(
        '/api/orders/sales',
        {
          month,
          year,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      const { totalSales, totalOrders, totalProfit } = response.data;

      // Check if totalSales is 0
      if (totalSales === 0) {
        setError('No sales data found for the specified period');
      } else {
        setError('');
        setTotalSales(totalSales);
        setTotalOrder(totalOrders);
        setTotalProfit(totalProfit);
      }
    } catch (error) {
      setError(error.response ? error.response.data.error : 'Network Error');
      setTotalSales(null); // Reset totalSales to null in case of error
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Select Month and Year:
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {error ? (
        <h3>{error}</h3>
      ) : (
        totalSales !== null && (
          <div style={{ marginTop: '10px' }}>
            <Row>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>{totalSales} Pkr</Card.Title>
                    <Card.Text> Sales</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>{totalOrder}</Card.Title>
                    <Card.Text>Orders</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>{totalProfit}</Card.Title>
                    <Card.Text>Profit</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )
      )}
    </div>
  );
}
