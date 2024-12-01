import { FC } from 'react';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useQuery } from 'react-query';
import RuleList from '../components/RuleList';
import RuleForm from '../components/RuleForm';

interface Currency {
  id: string;
  name: string;
  symbol: string;
}

interface Rule {
  id: string;
  baseCurrency: Currency;
  targetCurrency: Currency;
  percentage: number;
  isActive: boolean;
  type: string;
  email: string;
}

const fetchRules = async (email: string): Promise<Rule[]> => {
  const response = await fetch(`http://localhost:6969/rules?email=${email}`);
  if (!response.ok) throw new Error('Failed to fetch rules');
  return response.json();
};

const RulesPage: FC = () => {
  const email = localStorage.getItem('userEmail');

  const {
    data: rules = [],
    isLoading,
    error,
    refetch
  } = useQuery<Rule[], Error>(
    ['rules', email],
    () => fetchRules(email as string),
    {
      enabled: !!email,
      placeholderData: []
    }
  );

  if (!email) {
    return (
      <Box sx={{ mt: 4, px: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Please login first to manage your rules.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 4,
        px: 2,
        width: '100%',
        maxWidth: '500px',
        mx: 'auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Manage Your Rules
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error">
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </Alert>
      )}

      {!isLoading && !error && (
        <>
          <RuleList rules={rules} onRulesChange={refetch} />
          <RuleForm onRuleAdded={refetch} email={email} />
        </>
      )}
    </Box>
  );
};

export default RulesPage;
