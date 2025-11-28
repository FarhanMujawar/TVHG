import * as React from 'react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { Box, IconButton, Link, Typography } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import plant1 from '../Assets/plantImg/plant1.png';
import plant2 from '../Assets/plantImg/plant2.png';
import plant3 from '../Assets/plantImg/plant3.png';
import plant4 from '../Assets/plantImg/plant4.png';
import plant5 from '../Assets/plantImg/plant5.png';
import plant6 from '../Assets/plantImg/plant6.png';
import plant7 from '../Assets/plantImg/plant7.png';
import { useNavigate } from 'react-router-dom';

const plantData = [
  {
    img: plant1,
    description: <>Aloe Vera is a succulent plant known for its gel-filled leaves. It has been used for centuries in traditional medicine to treat burns, wounds, and skin conditions. This low-maintenance plant thrives in warm climates and requires minimal watering.</>,
    isBookmarked: true,
  },
  {
    img: plant2,
    description: <>Lavender is an aromatic flowering plant prized for its calming properties. It's commonly used in aromatherapy to reduce stress and promote relaxation. The plant produces beautiful purple flowers and attracts pollinators to your garden.</>,
    isBookmarked: false,
  },
  {
    img: plant3,
    description: <>Cactus is a hardy succulent plant adapted to arid environments. Known for its thick, waxy skin, the cactus can store water for extended periods. Many species produce vibrant flowers and require very little care, making them perfect for beginners.</>,
    isBookmarked: true,
  },
  {
    img: plant4,
    description: <>Mint is a refreshing herb with a cooling effect and distinctive aroma. It's commonly used in teas, cooking, and traditional medicine to aid digestion and freshen breath. Mint grows vigorously and spreads quickly, making it easy to cultivate.</>,
    isBookmarked: false,
  },
  {
    img: plant5,
    description: <>Basil is an aromatic culinary herb essential in Mediterranean cuisine. Rich in vitamins and antioxidants, basil is believed to have anti-inflammatory and antibacterial properties. It's perfect for adding fresh flavor to dishes and can be grown indoors year-round.</>,
    isBookmarked: true,
  },
  {
    img: plant6,
    description: <>Rosemary is an evergreen herb with needle-like leaves and a robust, piney aroma. It's used in cooking, aromatherapy, and traditional medicine to enhance memory and improve circulation. This resilient plant thrives in well-drained soil and sunny locations.</>,
    isBookmarked: false,
  },
  {
    img: plant7,
    description: <>Thyme is a small, hardy herb with tiny leaves and delicate flowers. It's valued in culinary traditions for its earthy flavor and in traditional medicine for its antimicrobial properties. Thyme is drought-tolerant and attracts beneficial insects to your garden.</>,
    isBookmarked: true,
  },
];

export default function Variants() {
  
  const description = (path) => {
    navigate('/plant-info'); // Navigate to the path when a button is clicked
  }; 
  const navigate = useNavigate(); // Initialize the navigate hook
  const [bookmarks, setBookmarks] = useState(plantData.map(item => item.isBookmarked));

  const toggleBookmark = (index) => {
    setBookmarks(prev => prev.map((bookmark, i) => (i === index ? !bookmark : bookmark)));
  };

  return (
    <Stack display="flex" alignItems="center" direction="column" justifyContent="center" spacing={6} padding={'3rem 0rem'} style={{backgroundColor:'#defff0'}}>
      <Typography variant="h3" color="success" fontWeight="bold">
        My Garden Plant
      </Typography>
      {plantData.map((item, index) => (
        <Box key={index} display="flex" gap="30px">
          <Paper sx={{ height: '160px', width: '200px', padding: '20px', position: 'relative' }}>
            <IconButton
              style={{ color: 'black', position: 'absolute', top: '10px', right: '10px' }}
              onClick={() => toggleBookmark(index)}
            >
              {bookmarks[index] ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
            <img src={item.img} alt="Plant" style={{ width: '100%', height: '100%', objectFit: 'cover'}} />
          </Paper>
          <Paper sx={{ height: '160px', width: '600px', padding: '20px' }}>
            <Typography>{item.description}</Typography>
            <Link onClick={() => description()}>read more</Link>
          </Paper>
        </Box>
      ))}
    </Stack>
  );
}
