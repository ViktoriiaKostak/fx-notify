import { FC, useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EmailForm: FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem('userEmail', email);
      navigate('/rules');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        textAlign: 'center',
        mt: 4,
        padding: '16px',
        maxWidth: '500px',
        mx: 'auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Enter Your Email
      </Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button
        variant="contained"
        type="submit"
        fullWidth
        sx={{
          mt: 2,
          bgcolor: 'primary.main',
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        Start
      </Button>
    </Box>

  );
};

export default EmailForm;
