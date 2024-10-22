// pages/test.tsx
"use client";  // Add this line at the top of your file

import { FC } from 'react';

const TestPage: FC = () => {
  const handleClick = () => {
    alert('Button Clicked!');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>This is a Test Page</h1>
      <p>
        This page is created to test the Next.js setup. Click the button below:
      </p>
      <button onClick={handleClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Click Me!
      </button>
    </div>
  );
};

export default TestPage;
