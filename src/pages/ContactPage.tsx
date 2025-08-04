
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-vet-navy mb-4">Contactez-nous</h1>
            <p className="text-xl text-vet-brown">Nous sommes là pour vous aider</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="border-vet-blue/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-vet-navy">Envoyez-nous un message</CardTitle>
                <CardDescription>Remplissez le formulaire et nous vous répondrons rapidement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" placeholder="Votre nom" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="votre@email.com" />
                </div>
                <div>
                  <Label htmlFor="subject">Sujet</Label>
                  <Input id="subject" placeholder="Objet de votre message" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Votre message..." className="min-h-32" />
                </div>
                <Button className="w-full bg-vet-sage hover:bg-vet-sage/90">Envoyer le message</Button>
              </CardContent>
            </Card>
            
            <div className="space-y-8">
              <Card className="border-vet-blue/30 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-8 w-8 text-vet-sage" />
                    <div>
                      <h3 className="font-semibold text-vet-navy">Email</h3>
                      <p className="text-vet-brown">contact@vetconnect.fr</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-vet-blue/30 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Phone className="h-8 w-8 text-vet-sage" />
                    <div>
                      <h3 className="font-semibold text-vet-navy">Téléphone</h3>
                      <p className="text-vet-brown">01 23 45 67 89</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-vet-blue/30 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-8 w-8 text-vet-sage" />
                    <div>
                      <h3 className="font-semibold text-vet-navy">Adresse</h3>
                      <p className="text-vet-brown">123 Rue de la Paix<br />75001 Paris, France</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
