import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { doc, setDoc, deleteDoc, getDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebase";

export default function PantryItem({ name, count, updatePantry }) {
  const addItem = async () => {
    const docRef = doc(collection(firestore, "pantry"), name);
    await setDoc(docRef, { count: count + 1 });
    updatePantry();
  };

  const removeItem = async () => {
    const docRef = doc(collection(firestore, "pantry"), name);
    if (count === 1) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, { count: count - 1 });
    }
    updatePantry();
  };

  const deleteItem = async () => {
    const docRef = doc(collection(firestore, "pantry"), name);
    await deleteDoc(docRef);
    updatePantry();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Quantity: {count}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Box>
          <IconButton onClick={addItem}>
            <Add />
          </IconButton>
          <IconButton onClick={removeItem}>
            <Remove />
          </IconButton>
        </Box>
        <IconButton onClick={deleteItem} color="error">
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
}
