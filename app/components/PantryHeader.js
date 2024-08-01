import React from "react";
import { Grid, Typography, Button } from "@mui/material";

export default function PantryHeader({ onAddItem, onUploadReceipt }) {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h3" component="h1" gutterBottom>
          Pantry Manager
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={onAddItem}
          sx={{ backgroundColor: "#3f51b5" }}
        >
          Add New Item
        </Button>
        {/* <Button
          variant="contained"
          onClick={onUploadReceipt}
          sx={{ backgroundColor: "#3f51b5", marginLeft: 2 }}
        >
          Input Grocery Receipt
        </Button> */}
      </Grid>
    </>
  );
}
