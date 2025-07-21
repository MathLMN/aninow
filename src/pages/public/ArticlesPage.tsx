
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ArticlesPage = () => {
  // Articles de démonstration (plus tard vous pourrez les récupérer depuis la base de données)
  const articles = [
    {
      id: 1,
      title: "L'importance de la vaccination chez les chiens",
      excerpt: "Découvrez pourquoi la vaccination est essentielle pour protéger votre chien contre les maladies infectieuses.",
      author: "Dr. Martin",
      publishedAt: "2024-01-15",
      category: "Prévention",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Signes d'alerte chez le chat : quand consulter ?",
      excerpt: "Apprenez à reconnaître les symptômes qui nécessitent une consultation vétérinaire urgente chez votre chat.",
      author: "Dr. Dubois",
      publishedAt: "2024-01-10",
      category: "Urgences",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Alimentation équilibrée pour les animaux seniors",
      excerpt: "Conseils nutritionnels pour adapter l'alimentation de vos compagnons âgés selon leurs besoins spécifiques.",
      author: "Dr. Leclerc",
      publishedAt: "2024-01-05",
      category: "Nutrition",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      <Header />
      
      <main className="pt-16 md:pt-20">
        {/* En-tête de la page */}
        <section className="bg-white/80 py-8 sm:py-12">
          <div className="container mx-auto px-3 sm:px-6">
            <div className="flex items-center mb-6">
              <Link to="/">
                <Button variant="ghost" className="text-vet-navy hover:bg-vet-beige/20 mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
            
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-2xl sm:text-4xl font-bold text-vet-navy mb-4">
                Articles sur la santé animale
              </h1>
              <p className="text-vet-brown text-sm sm:text-lg">
                Découvrez nos conseils d'experts pour prendre soin de vos compagnons à quatre pattes
              </p>
            </div>
          </div>
        </section>

        {/* Liste des articles */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-3 sm:px-6">
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {articles.map((article) => (
                  <Card key={article.id} className="bg-white/90 hover:shadow-lg transition-shadow duration-200 border-vet-blue/20 overflow-hidden">
                    <div className="aspect-video bg-vet-sage/10 flex items-center justify-center">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-vet-sage/10 text-vet-sage">
                          {article.category}
                        </Badge>
                        <div className="flex items-center text-xs text-vet-brown">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      
                      <CardTitle className="text-lg text-vet-navy line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-vet-brown text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-vet-brown">
                          <User className="h-3 w-3 mr-1" />
                          {article.author}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-vet-sage border-vet-sage hover:bg-vet-sage hover:text-white"
                        >
                          Lire la suite
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white/90 rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-vet-navy mb-2">
                    Bientôt disponible
                  </h3>
                  <p className="text-vet-brown">
                    Nos articles sur la santé animale seront bientôt publiés. 
                    Revenez nous voir prochainement !
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ArticlesPage;
