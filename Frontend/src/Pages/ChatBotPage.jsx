// ...existing code...
import { IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import MicNoneIcon from '@mui/icons-material/MicNone';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function ChatBot() {
  const initialUserPrompt = "Hello! I am your virtual guide for medicinal plants... Ask me about a plant...";
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([
    { role: "user", parts: [{ text: initialUserPrompt }] },
  ]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    // initialize if history is null/undefined or empty
    if (!history || history.length === 0) {
      setHistory([{ role: "user", parts: [{ text: initialUserPrompt }] }]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!message.trim()) return;
    setLoad(true);
    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server responded ${res.status}: ${text}`);
      }
      const data = await res.json();
      const serverResponse = data?.response ?? 'No response from server.';
      setResponse(serverResponse);

      if (Array.isArray(data?.history) && data.history.length) {
        setHistory(data.history);
      } else {
        setHistory(prev => [...(prev || []), { role: 'assistant', parts: [{ text: serverResponse }] }]);
      }

      console.log('chat response', serverResponse);
      console.log('chat history', data?.history);
      setMessage('');
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred.");
    }
    setLoad(false);
  };

  return (
    <Stack padding={'40px'} backgroundColor='#defff0'>
      <Stack width={'30rem'} gap={3}>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Box sx={{ backgroundColor: '#d3ccb4', borderRadius: 2, p: 2, width: '17rem' }}>
            {history.map((item, index) => (
              <Typography key={index} component="div">
                <b>{item.role}:</b> {item.parts[0].text}
              </Typography>
            ))}
          </Box>
        </Box>
        <Box>
          {response && (
            <Box sx={{ backgroundColor: '#b4d3c4', borderRadius: 2, p: 2, width: '17rem' }}>
              <Typography component="div"><b>The Virtual Healing Garden:</b> {response}</Typography>
            </Box>
          )}
        </Box>
      </Stack>
      <Stack mt={4}>
        <form onSubmit={handleSubmit}>
          <TextField
            color='success'
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <MicNoneIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <IconButton onClick={handleSubmit} disabled={load || !message.trim()}>
            {load ? (
              <CircularProgress color="success" size={24} />
            ) : (
              <ArrowCircleUpIcon color={message ? 'success' : 'disabled'} fontSize='large' />
            )}
          </IconButton>
        </form>
      </Stack>
    </Stack>
  );
}

export default ChatBot;
// ...existing code...