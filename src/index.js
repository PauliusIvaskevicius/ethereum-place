import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MoralisProvider } from "react-moralis";
import { ChakraProvider } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
	  <MoralisProvider appId= {process.env.MORALIS_APP_ID} serverUrl={process.env.MORALIS_SERVER_URL}>	
	  	<ChakraProvider>
				<App />
			</ChakraProvider>
	  </MoralisProvider> 
  </React.StrictMode>
);