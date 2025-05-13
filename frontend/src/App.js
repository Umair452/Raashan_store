import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import MapScreen from './screens/MapScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import DeliveryBoy from './screens/DeliveryBoy';
import ProductInventory from './screens/ProductInventory';
import OrderTracking from './screens/OrderTracking';
import ProductInventoryUpdateScreen from './screens/ProductInventoryUpdateScreen';
import SalesScreen from './screens/SalesScreen';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AllProducts from './screens/AllProducts';
import LiveChat from './screens/LiveChat';
function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
            ? 'site-container d-flex flex-column full-box'
            : 'site-container d-flex flex-column'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar style={{ backgroundColor: '#E59A59' }} expand="lg">
            <Container>
              {userInfo && userInfo.isDeliveryBoy ? (
                ''
              ) : (
                <Button
                  style={{
                    backgroundColor: '#712E1E',
                    color: 'white',
                    border: 'none',
                  }}
                  onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                >
                  <i className="fas fa-bars"></i>
                </Button>
              )}

              {userInfo && userInfo.isDeliveryBoy ? (
                <Link
                  to="/DeliveryBoy"
                  style={{ color: 'white', textDecoration: 'none' }}
                >
                  Delivery Boy
                </Link>
              ) : (
                <>
                  <LinkContainer to="/">
                    <Navbar.Brand>
                      <span style={{ color: '#712E1E', marginLeft: '5%' }}>
                        Rashan Store
                      </span>
                    </Navbar.Brand>
                  </LinkContainer>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <SearchBox />
                </>
              )}
              {/* {userInfo && !userInfo.isAdmin && !userInfo.isDeliveryBoy ? (
                <LinkContainer to="/ordertrack">
                  <Navbar.Brand>Order Tracking</Navbar.Brand>
                </LinkContainer>
              ) : (
                ''
              )} */}
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto  w-100  justify-content-end">
                  {userInfo && userInfo.isDeliveryBoy ? (
                    ''
                  ) : (
                    <>
                      <NavDropdown title="Categories" id="admin-nav-dropdown">
                        {categories.map((category) => (
                          <LinkContainer
                            style={{}}
                            to={{
                              pathname: '/search',
                              search: `category=${category}`,
                            }}
                            onClick={() => setSidebarIsOpen(false)}
                          >
                            <Nav.Link>{category}</Nav.Link>
                          </LinkContainer>
                        ))}
                      </NavDropdown>

                      <Link
                        to="/ALLPRODCUTS"
                        className="nav-link"
                        style={{ color: 'white' }}
                      >
                        Products
                      </Link>
                      <Link
                        to="/cart"
                        className="nav-link"
                        style={{ color: 'white' }}
                      >
                        Cart
                        {cart.cartItems.length > 0 && (
                          <Badge pill bg="danger">
                            {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                          </Badge>
                        )}
                      </Link>
                    </>
                  )}

                  {userInfo ? (
                    <NavDropdown
                      title={
                        <span style={{ color: 'white' }}>{userInfo.name}</span>
                      }
                      id="basic-nav-dropdown"
                    >
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      {userInfo && userInfo.isDeliveryBoy ? (
                        ''
                      ) : (
                        <LinkContainer to="/orderhistory">
                          <NavDropdown.Item>Order History</NavDropdown.Item>
                        </LinkContainer>
                      )}

                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/inventory">
                        <NavDropdown.Item>Product Inventory</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/sales">
                        <NavDropdown.Item>Sales</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          style={{ backgroundColor: '#E59A59' }}
          variant="dark"
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong style={{ color: '#712E1E', fontSize: '20px' }}>
                Categories
              </strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  style={{ color: 'white' }}
                  to={{ pathname: '/search', search: `category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <div></div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/forget-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordScreen />}
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ordertrack"
                element={
                  <ProtectedRoute>
                    <OrderTracking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/inventory"
                element={
                  <AdminRoute>
                    <ProductInventory />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/sales"
                element={
                  <AdminRoute>
                    <SalesScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route path="/DeliveryBoy" element={<DeliveryBoy />}></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/productinventory/:id"
                element={
                  <AdminRoute>
                    <ProductInventoryUpdateScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route path="/" element={<HomeScreen />} />
              <Route path="/ALLPRODCUTS" element={<AllProducts />} />
            </Routes>
          </Container>
        </main>
        <footer style={{ backgroundColor: '#E59A59' }}>
          <Container>
            <Row>
              <Col md={4}>
                <h5 style={{ color: '#712E1E' }}>About Us</h5>
                <p style={{ color: 'white' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aenean vehicula massa nec metus finibus, quis laoreet magna
                  sollicitudin.
                </p>
              </Col>
              <Col md={4}>
                <h5 style={{ color: '#712E1E' }}>Quick Links</h5>
                <ul className="list-unstyled">
                  <li>
                    <Link
                      to="/"
                      style={{ color: 'white', textDecoration: 'none' }}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      style={{ color: 'white', textDecoration: 'none' }}
                      to="/ALLPRODCUTS"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      style={{ color: 'white', textDecoration: 'none' }}
                      to="/contact"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </Col>
              <Col md={4}>
                <h5 style={{ color: '#712E1E' }}>Contact Info</h5>
                <p style={{ color: 'white' }}>123 Main Street, City</p>
                <p style={{ color: 'white' }}>Email: info@example.com</p>
                <p style={{ color: 'white' }}>Phone: +123 456 789</p>
              </Col>
            </Row>
            <hr className="bg-light" />
            <Row style={{ backgroundColor: '#712E1E' }}>
              <Col className="text-center">
                <p style={{ color: 'white' }}>
                  &copy; 2024 Your Ecommerce Store. All rights reserved.
                </p>
              </Col>
            </Row>
          </Container>
        </footer>
        <div style={{ position: 'fixed', bottom: 0, left: 0, margin: '10px' }}>
          <LiveChat />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
