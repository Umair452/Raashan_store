import { useEffect, useReducer } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
// import LiveChat from './LiveChat';
// // import data from '../data';
// import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const ImageSlider = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          style={{ height: '800px' }}
          className="d-block w-100"
          src="https://images.unsplash.com/photo-1607664608695-45aaa6d621fc?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>
            <p style={{ color: '#712E1E' }}>
              <span style={{ backgroundColor: '#E59A59', opacity: '80%' }}>
                For Shoping Go to Product Page
              </span>
            </p>
          </h3>
          <Link to="/ALLPRODCUTS">
            {' '}
            <Button
              style={{
                backgroundColor: '#712E1E',
                color: 'white',
                border: 'none',
              }}
              type="button"
            >
              Products
            </Button>
          </Link>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          style={{ height: '800px' }}
          className="d-block w-100"
          src="https://plus.unsplash.com/premium_photo-1669205340693-755739ea443d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>
            <p style={{ color: '#712E1E' }}>
              <span style={{ backgroundColor: '#E59A59', opacity: '80%' }}>
                For Shoping Go to Product Page
              </span>
            </p>
          </h3>
          <Link to="/ALLPRODCUTS">
            {' '}
            <Button
              style={{
                backgroundColor: '#712E1E',
                color: 'white',
                border: 'none',
              }}
              type="button"
            >
              Products
            </Button>
          </Link>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          style={{ height: '800px' }}
          className="d-block w-100"
          src="
          https://plus.unsplash.com/premium_photo-1669205342640-aef28ff08cd8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>
            <p style={{ color: '#712E1E' }}>
              <span style={{ backgroundColor: '#E59A59', opacity: '80%' }}>
                For Shoping Go to Product Page
              </span>
            </p>
          </h3>
          <Link to="/ALLPRODCUTS">
            {' '}
            <Button
              style={{
                backgroundColor: '#712E1E',
                color: 'white',
                border: 'none',
              }}
              type="button"
            >
              Products
            </Button>
          </Link>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};
function HomeScreen() {
  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 100,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  // };
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });
  // const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>Rashan Store</title>
      </Helmet>
      <ImageSlider />

      <h1
        style={{
          textDecoration: 'none',
          color: '#712E1E',
        }}
      >
        Featured Products
      </h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
