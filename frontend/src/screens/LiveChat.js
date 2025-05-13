import React from 'react';
// import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
export default function LiveChat() {
  return (
    <>
      {/* <Link to="">
        
      </Link> */}
      <a
        aria-label="Chat on WhatsApp"
        target="_blank"
        href="https://wa.me/+923440846068" rel="noreferrer"
      >
        <img
          src="/whatsappbutton.png"
          alt="WhatsApp"
          style={{ width: '175px', borderRadius: '50px' }}
        />
      </a>
    </>
  );
}
