
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-vet-navy mb-4">Tarifs</h1>
            <p className="text-xl text-vet-brown">Des solutions adaptées à vos besoins</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-vet-blue/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-vet-navy">Basique</CardTitle>
                <CardDescription>Pour les petites cliniques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-vet-sage mb-4">49€/mois</div>
                <ul className="space-y-2">
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Prise de rendez-vous</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Gestion de planning</li>
                </ul>
                <Button className="w-full mt-6 bg-vet-sage hover:bg-vet-sage/90">Choisir</Button>
              </CardContent>
            </Card>
            
            <Card className="border-vet-blue/30 shadow-lg border-2 border-vet-sage">
              <CardHeader>
                <CardTitle className="text-2xl text-vet-navy">Premium</CardTitle>
                <CardDescription>Le plus populaire</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-vet-sage mb-4">99€/mois</div>
                <ul className="space-y-2">
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Tout du basique</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Analyses IA avancées</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Support prioritaire</li>
                </ul>
                <Button className="w-full mt-6 bg-vet-sage hover:bg-vet-sage/90">Choisir</Button>
              </CardContent>
            </Card>
            
            <Card className="border-vet-blue/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-vet-navy">Entreprise</CardTitle>
                <CardDescription>Pour les grandes structures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-vet-sage mb-4">199€/mois</div>
                <ul className="space-y-2">
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Tout du premium</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />API personnalisée</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Formation dédiée</li>
                </ul>
                <Button className="w-full mt-6 bg-vet-sage hover:bg-vet-sage/90">Nous contacter</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
