import React from 'react';

const Page = () => {
  const handleRedirect = () => {
    window.location.href = 'https://buy.stripe.com/test_bIY6py8a2aAG7uw3cc'; // Replace with your desired URL
  };

  return (
    <div>
      <button onClick={handleRedirect} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Go to URL
      </button>
    </div> 
  );
};

export default Page;