"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import PantryHeader from "./components/PantryHeader";
import SearchBar from "./components/SearchBar";
import PantryItemList from "./components/PantryItemList";
import AddItemDialog from "./components/AddItemDialog";
import ReceiptUploadDialog from "./components/ReceiptUploadDialog";

export default function PantryManager() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    updatePantry();
  }, []);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  const filteredPantry = pantry.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <PantryHeader
            onAddItem={() => setOpen(true)}
            onUploadReceipt={() => setOpen2(true)}
          />
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <PantryItemList
            pantryItems={filteredPantry}
            updatePantry={updatePantry}
          />
        </Grid>
      </Container>
      <AddItemDialog
        open={open}
        handleClose={() => setOpen(false)}
        updatePantry={updatePantry}
      />
      <ReceiptUploadDialog
        open={open2}
        handleClose={() => setOpen2(false)}
        updatePantry={updatePantry}
      />
    </Box>
  );
}
