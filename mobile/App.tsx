import React from 'react';
import { Text, View } from 'react-native';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './src/lib/apolloCient';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>LifeSync Mobile</Text>
      </View>
    </ApolloProvider>
  );
}