// app/edit-profile/page.tsx
"use client";

import React from "react";
import EditProfile from "@/components/Edit-Profile";
import { ProfileProvider } from "@/context/ProfileContext";

// Importar o CSS da página de edição
import "@/styles/edit-profile.css";

export default function EditProfilePage() {
  return (
    <ProfileProvider>
      <EditProfile />
    </ProfileProvider>
  );
}
