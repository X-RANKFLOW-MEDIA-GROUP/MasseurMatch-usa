"use client";

import { useParams } from "next/navigation";

export default function TherapistProfile() {
  const params = useParams();
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000', 
      color: '#fff', 
      padding: '2rem',
      fontFamily: 'system-ui'
    }}>
      <h1>✅ Componente TherapistProfile Funcionando!</h1>
      <p>ID do usuário: <strong>{params?.id}</strong></p>
      <p>A rota dinâmica está funcionando corretamente.</p>
    </div>
  );
}