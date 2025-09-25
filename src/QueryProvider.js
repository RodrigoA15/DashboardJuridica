import { useState } from 'react';
import PropTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const QueryProvider = ({ children }) => {
  // Create a client
  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

QueryProvider.propTypes = {
  children: PropTypes.node
};
