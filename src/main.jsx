import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider, Container, Heading} from "@chakra-ui/react"
import axios from 'axios'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus:false,
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
    <QueryClientProvider client={queryClient} >
      <App />
    </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
