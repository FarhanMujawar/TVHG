import { IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import MicNoneIcon from '@mui/icons-material/MicNone';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function ChatBot() {
  const initialUserPrompt = "Hello! I am your virtual guide for medicinal plants... Ask me about a plant...";
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(initialUserPrompt);
  const [history, setHistory] = useState([
    { role: "user", parts: [{ text: initialUserPrompt }] },
  ]);
  const [load, setLoad] = useState(false);

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
        const errorData = await res.json();
        throw new Error(errorData.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      const serverResponse = data?.response ?? 'No response from server.';
      
      // Update response to show only latest answer
      setResponse(serverResponse);

      // Update history for backend context
      if (Array.isArray(data?.history) && data.history.length > 0) {
        setHistory(data.history);
      } else {
        setHistory(prev => [
          ...(prev || []),
          { role: 'assistant', parts: [{ text: serverResponse }] }
        ]);
      }

      console.log('chat response:', serverResponse);
      console.log('chat history:', data?.history);
      setMessage('');
    } catch (error) {
      console.error("Error:", error);
      setResponse(`Error: ${error.message}`);
    }
    setLoad(false);
  };

  return (
    <Stack padding={'40px'} backgroundColor='#defff0' minHeight={'100vh'} justifyContent={'center'} alignItems={'center'}>
      <Stack width={'100%'} maxWidth={'600px'} gap={3}>
        {/* Only show latest MedBot response */}
        <Box sx={{ backgroundColor: '#b4d3c4', borderRadius: 2, p: 3, minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography component="div" sx={{ fontSize: '1.1rem', lineHeight: 1.6, textAlign: 'center' }}>
            <b>The Virtual Healing Garden:</b> {response}
          </Typography>
        </Box>

        {/* Input form */}
        <Stack mt={4}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <TextField
              color='success'
              placeholder="Ask about medicinal plants..."
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
              fullWidth
            />

            <IconButton onClick={handleSubmit} disabled={load || !message.trim()} type="submit">
              {load ? (
                <CircularProgress color="success" size={24} />
              ) : (
                <ArrowCircleUpIcon color={message ? 'success' : 'disabled'} fontSize='large' />
              )}
            </IconButton>
          </form>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default ChatBot;