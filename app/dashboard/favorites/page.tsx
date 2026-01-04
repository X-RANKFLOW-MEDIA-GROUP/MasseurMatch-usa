"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Star, X } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

type Favorite = {
  id: string;
  therapist: {
    user_id: string;
    slug: string;
    display_name: string;
    headline: string;
    city: string;
    state: string;
    rating: number;
    profile_photo: string;
  };
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("favorites")
        .select(`
          id,
          therapist:therapist_id (
            user_id,
            slug,
            display_name,
            headline,
            city,
            state,
            rating,
            profile_photo
          )
        `)
        .eq("user_id", user.id);

      setFavorites((data as unknown as Favorite[]) || []);
      setLoading(false);
    }
    fetchFavorites();
  }, []);

  const removeFavorite = async (favoriteId: string) => {
    await supabase.from("favorites").delete().eq("id", favoriteId);
    setFavorites(favorites.filter(f => f.id !== favoriteId));
  };

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold text-white mb-2">Favorites</h1>
      <p className="text-slate-400 mb-8">Your saved massage therapists</p>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 rounded-2xl border border-white/10 bg-white/5"
        >
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-xl font-semibold text-white mb-2">No favorites yet</h2>
          <p className="text-slate-400 mb-6">Browse therapists and save your favorites</p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-white hover:bg-neutral-200 transition-colors"
          >
            Explore Therapists
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav, index) => (
            <motion.div
              key={fav.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
            >
              <button
                onClick={() => removeFavorite(fav.id)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X className="h-4 w-4" />
              </button>

              <Link href={`/therapist/${fav.therapist.slug}`}>
                <div className="relative h-48">
                  {fav.therapist.profile_photo ? (
                    <Image
                      src={fav.therapist.profile_photo}
                      alt={fav.therapist.display_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/30 to-neutral-100/30 flex items-center justify-center">
                      <span className="text-4xl">💆</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">{fav.therapist.display_name}</h3>
                  <p className="text-sm text-slate-400 line-clamp-1 mb-2">{fav.therapist.headline}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="h-3 w-3" />
                      {fav.therapist.city}, {fav.therapist.state}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="h-3 w-3 fill-current" />
                      {fav.therapist.rating?.toFixed(1) || "New"}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
