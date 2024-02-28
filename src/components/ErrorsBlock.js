import { Paper, Typography } from "@mui/material";
import React from "react";

export default function ErrorsBlock() {
  return (
    <Paper
      style={{
        position: "absolute",
        bottom: "-30px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#ffd54f",
        padding: "8px",
        borderRadius: "8px",
      }}
    >
      <Typography variant="body2">
        Your data is invalid. Fix mistakes please
      </Typography>
    </Paper>
  );
}
