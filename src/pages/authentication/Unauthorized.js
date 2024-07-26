import React from 'react';
import { Button } from '@mui/material';

export default function Unauthorized() {
  return (
    <div className="text-center">
      <h1>401 Unauthorized</h1>
      <p>You are not authorized to access this page.</p>
      <p>
        Please go to the following link:
        <a href="http://localhost:5173/dashboard">
          <Button>New Page</Button>
        </a>
      </p>
    </div>
  );
}
