import React from "react";
import { Grid, Fade } from "@mui/material";
import PantryItem from "./PantryItem";

export default function PantryItemList({ pantryItems, updatePantry }) {
  return pantryItems.map(({ name, count }, index) => (
    <Fade in={true} timeout={300 * (index + 1)} key={name}>
      <Grid item xs={12} sm={6} md={4}>
        <PantryItem name={name} count={count} updatePantry={updatePantry} />
      </Grid>
    </Fade>
  ));
}
