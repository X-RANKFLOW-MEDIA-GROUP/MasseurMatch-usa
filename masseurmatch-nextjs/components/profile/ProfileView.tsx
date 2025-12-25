"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Phone, MessageCircle, Heart, Share2, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface ProfileData {
  id: string;
  name: string;
  age?: number;
  photos: string[];
  city: string;
  state: string;
  rating?: number;
  reviewCount?: number;
  bio: string;
  services: string[];
  languages: string[];
  availability?: {
    days: string[];
    hours: string;
  };
  rates?: {
    incall?: string;
    outcall?: string;
  };
  certifications?: string[];
  experience?: string;
  specialties?: string[];
}

interface ProfileViewProps {
  profile: ProfileData;
  isOwner?: boolean;
  onContact?: () => void;
  onLike?: () => void;
  onShare?: () => void;
}

export function ProfileView({ profile, isOwner = false, onContact, onLike, onShare }: ProfileViewProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onLike) onLike();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <motion.div
          key={currentPhotoIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <img
            src={profile.photos[currentPhotoIndex]}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </motion.div>

        {/* Photo Navigation */}
        {profile.photos.length > 1 && (
          <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 px-4 z-10">
            {profile.photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index === currentPhotoIndex ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button
            size="icon"
            variant="outline"
            onClick={handleLike}
            className={`glass-effect ${isLiked ? "text-pink-500" : ""}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-pink-500" : ""}`} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={onShare}
            className="glass-effect"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Header */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {profile.name}
                  {profile.age && (
                    <span className="text-slate-300 font-normal ml-2">{profile.age}</span>
                  )}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.city}, {profile.state}</span>
                  </div>
                  {profile.rating && (
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{profile.rating}</span>
                      {profile.reviewCount && (
                        <span className="text-slate-400">({profile.reviewCount} reviews)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {!isOwner && (
                <div className="flex gap-2">
                  <Button
                    size="lg"
                    onClick={onContact}
                    className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Message
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Phone className="w-5 h-5" />
                    Call
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            {/* Bio */}
            <Card className="glass-effect border-slate-800">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-white mb-3">About Me</h3>
                <p className="text-slate-300 leading-relaxed">{profile.bio}</p>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Languages */}
              {profile.languages && profile.languages.length > 0 && (
                <Card className="glass-effect border-slate-800">
                  <CardContent className="pt-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-300">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Experience */}
              {profile.experience && (
                <Card className="glass-effect border-slate-800">
                  <CardContent className="pt-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Experience</h4>
                    <p className="text-slate-300">{profile.experience}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
              <Card className="glass-effect border-slate-800">
                <CardContent className="pt-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Certifications</h4>
                  <ul className="space-y-2">
                    {profile.certifications.map((cert, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card className="glass-effect border-slate-800">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Services Offered</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {profile.services.map((service) => (
                    <div key={service} className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span className="text-slate-300">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {profile.specialties && profile.specialties.length > 0 && (
              <Card className="glass-effect border-slate-800">
                <CardContent className="pt-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.map((specialty) => (
                      <Badge key={specialty} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {profile.availability && (
                <Card className="glass-effect border-slate-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <h4 className="text-lg font-semibold text-white">Hours</h4>
                    </div>
                    <p className="text-slate-300">{profile.availability.hours}</p>
                  </CardContent>
                </Card>
              )}

              {profile.rates && (
                <Card className="glass-effect border-slate-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                      <h4 className="text-lg font-semibold text-white">Rates</h4>
                    </div>
                    <div className="space-y-2 text-slate-300">
                      {profile.rates.incall && (
                        <div>
                          <span className="text-slate-400">Incall:</span> {profile.rates.incall}
                        </div>
                      )}
                      {profile.rates.outcall && (
                        <div>
                          <span className="text-slate-400">Outcall:</span> {profile.rates.outcall}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="glass-effect border-slate-800">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Reviews</h3>
                <p className="text-slate-400">Reviews will be displayed here once the feature is implemented.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
