import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { SetContextLink } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// On a physical device, 'localhost' resolves to the device itself, not the dev machine.
// expoGoConfig.debuggerHost gives us the Metro bundler's LAN IP (e.g. "192.168.1.5:8081").
const devHost = Constants.expoGoConfig?.debuggerHost?.split(':')[0];
const API_URL = devHost
  ? `http://${devHost}:8000/graphql`
  : 'http://localhost:8000/graphql';

const httpLink = new HttpLink({
  uri: API_URL,
});

const authLink = new SetContextLink(async (prevContext, _operation) => {
    const token = await SecureStore.getItemAsync('token');
    const existingHeaders = (prevContext as Record<string, unknown>)['headers'] as Record<string, string> | undefined;
    return {
        headers: {
            ...existingHeaders,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});