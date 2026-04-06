import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './src/lib/apolloCient';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <RootNavigator />
        </AuthProvider>
    </ApolloProvider>
  );
}