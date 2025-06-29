
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Heart, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const VetLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de connexion - à remplacer par la vraie authentification
    if (email && password) {
      navigate('/vet/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Heart className="h-10 w-10 text-vet-sage" />
            <span className="text-2xl font-bold text-vet-navy">VetBooking</span>
          </Link>
          <p className="text-vet-brown mt-2">Espace Vétérinaire</p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-vet-navy">Connexion</CardTitle>
            <CardDescription className="text-vet-brown">
              Accédez à votre dashboard de gestion des rendez-vous
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-vet-navy">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-vet-navy">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-vet-sage hover:bg-vet-sage/90 text-white"
              >
                Se connecter
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button variant="link" className="text-vet-brown hover:text-vet-sage">
                Mot de passe oublié ?
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Retour */}
        <div className="text-center mt-6">
          <Link to="/">
            <Button variant="ghost" className="text-vet-brown hover:text-vet-navy">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VetLogin;
