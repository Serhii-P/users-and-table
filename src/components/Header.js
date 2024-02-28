"use client";
import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import ErrorsBlock from "./ErrorsBlock";
import { useSession } from "next-auth/react";

export default function Header() {
  const session = useSession();
  const status = session?.status;

  const persistedErrors = useSelector((state) => state.table.errors);

  const isSaving = useSelector((state) => state.status.isSaving);

  let hasErrors = false;

  Object.keys(persistedErrors).forEach((entryKey) => {
    const entry = persistedErrors[entryKey];

    Object.keys(entry).forEach((field) => {
      if (entry[field] === true) {
        hasErrors = true;
        return;
      }
    });

    if (hasErrors) {
      return;
    }
  });

  return (
    <header style={{ position: "relative" }}>
      {status === "authenticated" && hasErrors && <ErrorsBlock />}
      {isSaving ? (
        <Box sx={{ py: 3 }} align="right" fontWeight="fontWeightMedium">
          Saving...
        </Box>
      ) : (
        <Box sx={{ py: 3 }} align="center" fontWeight="fontWeightMedium">
          User Management App
        </Box>
      )}
    </header>
  );
}
