// import React, { useContext, useEffect, useState } from 'react';
// import { Helmet } from 'react-helmet-async';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import { useNavigate } from 'react-router-dom';
// import { Store } from '../Store';
// import CheckoutSteps from '../components/CheckoutSteps';

// export default function ShippingAddressScreen() {
//   const navigate = useNavigate();
//   const { state, dispatch: ctxDispatch } = useContext(Store);
//   const {
//     fullBox,
//     userInfo,
//     cart: { shippingAddress },
//   } = state;
//   const [fullName, setFullName] = useState(shippingAddress.fullName || '');
//   const [address, setAddress] = useState(shippingAddress.address || '');
//   const [city, setCity] = useState(shippingAddress.city || '');
//   const [postalCode, setPostalCode] = useState(
//     shippingAddress.postalCode || ''
//   );
//   useEffect(() => {
//     if (!userInfo) {
//       navigate('/signin?redirect=/shipping');
//     }
//   }, [userInfo, navigate]);
//   const [country, setCountry] = useState(shippingAddress.country || '');
//   const submitHandler = (e) => {
//     e.preventDefault();
//     ctxDispatch({
//       type: 'SAVE_SHIPPING_ADDRESS',
//       payload: {
//         fullName,
//         address,
//         city,
//         postalCode,
//         country,
//         location: shippingAddress.location,
//       },
//     });
//     localStorage.setItem(
//       'shippingAddress',
//       JSON.stringify({
//         fullName,
//         address,
//         city,
//         postalCode,
//         country,
//         location: shippingAddress.location,
//       })
//     );
//     navigate('/payment');
//   };

//   useEffect(() => {
//     ctxDispatch({ type: 'SET_FULLBOX_OFF' });
//   }, [ctxDispatch, fullBox]);

//   return (
//     <div>
//       <Helmet>
//         <title>Shipping Address</title>
//       </Helmet>

//       <CheckoutSteps step1 step2></CheckoutSteps>
//       <div className="container small-container">
//         <h1 className="my-3">Shipping Address</h1>
//         <Form onSubmit={submitHandler}>
//           <Form.Group className="mb-3" controlId="fullName">
//             <Form.Label>Full Name</Form.Label>
//             <Form.Control
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               required
//             />
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="address">
//             <Form.Label>Address</Form.Label>
//             <Form.Control
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               required
//             />
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="city">
//             <Form.Label>City</Form.Label>
//             <Form.Control
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               required
//             />
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="postalCode">
//             <Form.Label>Postal Code</Form.Label>
//             <Form.Control
//               value={postalCode}
//               onChange={(e) => setPostalCode(e.target.value)}
//               required
//             />
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="country">
//             <Form.Label>Country</Form.Label>
//             <Form.Control
//               value={country}
//               onChange={(e) => setCountry(e.target.value)}
//               required
//             />
//           </Form.Group>
          

//           <div className="mb-3">
//             <Button variant="primary" type="submit">
//               Continue
//             </Button>
//           </div>
//         </Form>
//       </div>
//     </div>
//   );
// }

import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    fullBox,
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [shippingDate, setShippingDate] = useState(new Date()); // New state variable for shipping date
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
        shippingDate, // Include shipping date in payload
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
        shippingDate, // Include shipping date in localStorage
      })
    );
    navigate('/payment');
  };

  useEffect(() => {
    ctxDispatch({ type: 'SET_FULLBOX_OFF' });
  }, [ctxDispatch, fullBox]);

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3" style={{color:'#712E1E'}}>Shipping Address</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="shippingDate">
            <Form.Label>Shipping Date</Form.Label>
            <Form.Control
              type="date"
              value={shippingDate}
              onChange={(e) => setShippingDate(e.target.value)}
              required
            />
          </Form.Group>

          <div className="mb-3">
            <Button  style={{
                          backgroundColor: '#712E1E',
                          color: 'white',
                          border: 'none',
                        }} variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

