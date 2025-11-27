import * as React from 'react';
import {
  Avatar,
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Drawer,
  useMediaQuery,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // 👈 added

export default function RightSideDrawer() {
  const [state, setState] = React.useState({
    right: false,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate(); // 👈 added

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ right: open });
  };

  const handlePrimaryMenuClick = (text) => {
    switch (text) {
      case 'Chat Bot':
        navigate('/chat-page'); // 👈 use your ChatBot page
        break;
      case 'Bookmarks':
        navigate('/my-garden'); // example: go to My Garden
        break;
      case 'Webiner':
        // TODO: hook to webinar page later
        break;
      case 'Buy Plants':
        // TODO: hook to marketplace page later
        break;
      default:
        break;
    }
  };

  const handleSecondaryMenuClick = (text) => {
    switch (text) {
      case 'Sign out':
        // TODO: add sign-out logic here
        break;
      case 'Collection':
        // TODO: route to collection page
        break;
      case 'Expart Support':
        // TODO: maybe open support/chat page
        break;
      default:
        break;
    }
  };

  const profile = () => (
    <Box textAlign="center" p={2}>
      <Avatar
        alt="Profile Picture"
        src="https://via.placeholder.com/150"
        sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
      />
      <Typography variant="h5" fontWeight="bold">
        Farhan Mujawar
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <b>Student </b>
        <br />
        JSPM&apos;s Rajarshi Shahu College of Engineering
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body1" fontWeight="bold">
        Contact Info:
        <br />
        +91**********
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Email: farhan@example.com
      </Typography>
    </Box>
  );

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {profile()}
      <Divider />

      {/* Primary menu */}
      <List>
        {['Webiner', 'Bookmarks', 'Chat Bot', 'Buy Plants'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handlePrimaryMenuClick(text)}>
              <ListItemIcon>
                {text === 'Chat Bot' ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Secondary menu */}
      <List>
        {['Collection', 'Expart Support', 'Sign out'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleSecondaryMenuClick(text)}>
              <ListItemIcon>
                {text === 'Sign out' ? (
                  <InboxIcon />
                ) : (
                  <Button>
                    <MailIcon />
                  </Button>
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton color="primary" aria-label="profile" onClick={toggleDrawer(true)}>
        <AccountCircleIcon fontSize="large" sx={{ color: isMobile ? 'black' : 'white' }} />
      </IconButton>
      <Drawer anchor="right" open={state.right} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
}
