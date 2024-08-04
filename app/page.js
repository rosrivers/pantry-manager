"use client";  // Add this line at the top

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import { firestore } from '../firebase';
import { TextField, Button, List, ListItem, ListItemText, IconButton, Container, Typography, Paper, AppBar, Toolbar, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ec407a',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
    h4: {
      fontWeight: 'bold',
      color: '#ec407a',
    },
    body1: {
      color: '#555555',
    },
  },
});

export default function Home() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fetchItems = async () => {
        const querySnapshot = await getDocs(collection(firestore, 'pantry'));
        setItems(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      };
      fetchItems();
    }
  }, []);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await updateDoc(doc(firestore, 'pantry', editingItem.id), { name });
    } else {
      const q = query(collection(firestore, 'pantry'), where('name', '==', name));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const existingItem = querySnapshot.docs[0];
        await updateDoc(doc(firestore, 'pantry', existingItem.id), { count: existingItem.data().count + 1 });
      } else {
        await addDoc(collection(firestore, 'pantry'), { name, count: 1 });
      }
    }
    setName('');
    setEditingItem(null);
    if (typeof window !== 'undefined') {
      const querySnapshot = await getDocs(collection(firestore, 'pantry'));
      setItems(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(firestore, 'pantry', id));
    setItems(items.filter(item => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setName(item.name);
  };

  const handleIncrease = async (item) => {
    await updateDoc(doc(firestore, 'pantry', item.id), { count: item.count + 1 });
    const querySnapshot = await getDocs(collection(firestore, 'pantry'));
    setItems(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  const handleDecrease = async (item) => {
    if (item.count > 1) {
      await updateDoc(doc(firestore, 'pantry', item.id), { count: item.count - 1 });
    } else {
      await deleteDoc(doc(firestore, 'pantry', item.id));
    }
    const querySnapshot = await getDocs(collection(firestore, 'pantry'));
    setItems(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="h6" style={{ fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif" }}>
            Pantry Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box mt={4}>
          <Paper elevation={3} style={{ padding: '2rem', borderRadius: '15px' }}>
            <Typography variant="h4" gutterBottom style={{ fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif" }}>
              Manage Pantry Items
            </Typography>
            <form onSubmit={handleAddOrUpdate} style={{ marginBottom: '2rem' }}>
              <TextField
                label="Item Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ style: { fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif" } }}
                inputProps={{ style: { fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif" } }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="secondary"
                sx={{ 
                  backgroundColor: '#ff69b4', 
                  '&:hover': {
                    backgroundColor: '#ff1493',
                  },
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif"
                }}
              >
                {editingItem ? 'Update' : 'Add'}
              </Button>
            </form>
            <Typography variant="body1" gutterBottom style={{ fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif" }}>
              Total Items: {items.reduce((total, item) => total + item.count, 0)}
            </Typography>
            <List>
              {items.map(item => (
                <ListItem key={item.id} divider>
                  <ListItemText 
                    primary={`${item.name} (${item.count})`} 
                    primaryTypographyProps={{ style: { fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif" } }} 
                  />
                  <IconButton edge="end" onClick={() => handleIncrease(item)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDecrease(item)}>
                    <RemoveIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
