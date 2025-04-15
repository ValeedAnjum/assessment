"use client";

import { useAuth } from "@/context/AuthContext";
// import { logOut } from "@/lib/auth";
// import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { ReactFlowLiveBlock } from "@/sections";
import { Box, CircularProgress, Container, CssBaseline } from "@mui/material";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  console.log(user);
  const router = useRouter();

  //     const handleLogout = async () => {
  //       try {
  //         await logOut();
  //         router.push("/login");
  //       } catch (error) {
  //         console.error("Logout error:", error);
  //       }
  //     };
  if (loading) {
    return (
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

  return <ReactFlowLiveBlock />;
}
