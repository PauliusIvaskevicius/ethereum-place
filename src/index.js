import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MoralisProvider } from "react-moralis";
import { ChakraProvider } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
	  <MoralisProvider appId={"ArLI8jOrClEdoi7ycTJpyv9xNjgFyQhHRtDra3B9"} serverUrl={"https://vl2wdhfhszuk.usemoralis.com:2053/server"}>	
	  	<ChakraProvider>
				<App />
			</ChakraProvider>
	  </MoralisProvider> 
  </React.StrictMode>
);