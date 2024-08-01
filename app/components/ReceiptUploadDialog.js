import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebase";

export default function ReceiptUploadDialog({
  open,
  handleClose,
  updatePantry,
}) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: uploadedImage }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const tsvContent = data.result;
      const lines = tsvContent.trim().split("\n");
      const items = lines.slice(1).map((line) => {
        const [name, quantity] = line.split("\t");
        return { name, quantity: parseInt(quantity) || 1 };
      });

      if (items.length > 0) {
        setItems(items);
      } else {
        throw new Error("No items found in the receipt");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setError(`Error processing image: ${error.message}`);
    } finally {
      setLoading(false);
      setUploadedImage(null);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] =
      field === "quantity" ? parseInt(value) || 1 : value;
    setItems(newItems);
  };

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    try {
      for (const item of items) {
        const docRef = doc(collection(firestore, "pantry"), item.name);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const { count } = docSnap.data();
          await setDoc(docRef, { count: count + item.quantity });
        } else {
          await setDoc(docRef, { count: item.quantity });
        }
      }
      updatePantry();
      handleClose();
    } catch (error) {
      console.error("Error importing items:", error);
      setError("Error importing items. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Items by Receipt</DialogTitle>
      <DialogContent>
        {!items.length && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
            }}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => fileInputRef.current.click()}
              sx={{ mb: 2 }}
            >
              Upload Receipt Image
            </Button>
            {uploadedImage && (
              <Box sx={{ mt: 2, maxWidth: "100%" }}>
                <img
                  src={uploadedImage}
                  alt="Uploaded receipt"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>
            )}
          </Box>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {items.length > 0 && (
          <Stack spacing={2} sx={{ mt: 3 }}>
            {items.map((item, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  label="Name"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                  sx={{ flexGrow: 1, mr: 1 }}
                />
                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  sx={{ width: "100px", mr: 1 }}
                  InputProps={{ inputProps: { min: 1 } }}
                />
                <IconButton onClick={() => handleDeleteItem(index)}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {!items.length && uploadedImage && (
          <Button
            variant="contained"
            sx={{ backgroundColor: "#3f51b5" }}
            disabled={loading}
            onClick={processImage}
          >
            {loading ? "Processing..." : "Process Receipt"}
          </Button>
        )}
        {items.length > 0 && (
          <Button
            variant="contained"
            sx={{ backgroundColor: "#4caf50" }}
            onClick={handleImport}
          >
            Import Items
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
