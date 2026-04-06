import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './src/lib/apolloCient';
import RootNavigator from './src/navigation';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <RootNavigator />
    </ApolloProvider>
  );
}