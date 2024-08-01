import React from "react";
import { Grid, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <Grid item xs={12}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );
}
