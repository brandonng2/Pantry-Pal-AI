import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

export default function ReceiptUploadDialog({
  open,
  handleClose,
  updatePantry,
}) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
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
        console.error("Response status:", response.status);
        console.error("Response text:", errorText);
        throw new Error(
          `Failed to process image: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResponse(data.result);

      const items = JSON.parse(data.result);

      //   for (const item of items) {
      //     await addItem(item.name, item.quantity);
      //   }

      updatePantry();
    } finally {
      setLoading(false);
    }
    setUploadedImage(null);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Item by Receipt</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#3f51b5" }}
          disabled={!uploadedImage || loading}
          onClick={processImage}
        >
          {loading ? "Processing..." : "Process Receipt"}
        </Button>
      </DialogActions>
      {response && (
        <Box sx={{ mt: 2, maxWidth: "100%", overflowX: "auto" }}>
          <pre>{JSON.stringify(JSON.parse(response), null, 2)}</pre>
        </Box>
      )}
    </Dialog>
  );
}
