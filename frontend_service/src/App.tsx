import { FC } from 'react';
import { CssBaseline, Container, Typography } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RulesPage from './pages/RulesPage';
import EmailForm from './components/EmailForm';
import './App.css';

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CssBaseline />
        <Container maxWidth="xs" sx={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: 3 }}>
          <Typography variant="h3" gutterBottom textAlign="center" sx={{ color: '#34495e' }}>
            Currency Rule Management
          </Typography>
          <Routes>
            <Route path="/" element={<EmailForm />} />
            <Route path="/rules" element={<RulesPage />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
