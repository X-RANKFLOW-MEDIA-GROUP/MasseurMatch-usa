"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

interface DashboardProps {
  onViewProfile: () => void;
  onLogout: () => void;
  profile: any | null;
  loadingProfile: boolean;
  profileError: string | null;
}

export function Dashboard({
  onViewProfile,
  onLogout,
  profile,
  loadingProfile,
  profileError,
}: DashboardProps) {
  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">{profileError}</p>
            <Button onClick={onLogout} variant="outline">
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Dashboard - {profile?.display_name || "Terapeuta"}
        </h1>
        <div className="flex gap-3">
          <Button onClick={onViewProfile} variant="outline">
            Ver Perfil Público
          </Button>
          <Button onClick={onLogout} variant="destructive">
            Sair
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Nome Completo</p>
              <p className="font-medium">{profile?.full_name || "N/A"}</p>

              <p className="text-sm text-slate-400 mt-4">Localização</p>
              <p className="font-medium">{profile?.location || "N/A"}</p>

              <p className="text-sm text-slate-400 mt-4">Status</p>
              <p className="font-medium capitalize">{profile?.status || "pending"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Plano Atual</p>
              <p className="font-medium text-lg">{profile?.plan_name || "Free"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profile?.services && profile.services.length > 0 ? (
                <ul className="list-disc list-inside">
                  {profile.services.map((service: string, idx: number) => (
                    <li key={idx} className="text-sm">{service}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">Nenhum serviço cadastrado</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Idiomas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profile?.languages && profile.languages.length > 0 ? (
                <ul className="list-disc list-inside">
                  {profile.languages.map((lang: string, idx: number) => (
                    <li key={idx} className="text-sm">{lang}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">Nenhum idioma cadastrado</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
