import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebase";

export default function AddItemDialog({ open, handleClose, updatePantry }) {
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [error, setError] = useState("");

  const handleAddItem = async () => {
    if (itemName.trim() === "") {
      setError("Item name cannot be empty");
      return;
    }
    if (itemQuantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }

    const docRef = doc(collection(firestore, "pantry"), itemName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + itemQuantity });
    } else {
      await setDoc(docRef, { count: itemQuantity });
    }

    updatePantry();
    setItemName("");
    setItemQuantity(1);
    setError("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Item Name"
          type="text"
          fullWidth
          variant="outlined"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <TextField
          margin="dense"
          id="quantity"
          label="Quantity"
          type="number"
          fullWidth
          variant="outlined"
          value={itemQuantity}
          onChange={(e) =>
            setItemQuantity(Math.max(1, parseInt(e.target.value) || 1))
          }
          InputProps={{ inputProps: { min: 1 } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleAddItem}
          variant="contained"
          sx={{ backgroundColor: "#3f51b5" }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
