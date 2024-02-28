"use client";
import { signIn } from "next-auth/react";
import { Button, Stack } from "@mui/material";

export default function Login() {
  return (
    <Stack direction="row" justifyContent="center">

    <Button
      variant="secondary"
      size="large"
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="login"
      style={{ background: 'grey', color: 'white' }}
    >
      Login with google
    </Button>
    </Stack>
  );
}
