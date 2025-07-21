
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

const ArticlesSection = () => {
  // Articles en vedette pour la page d'accueil
  const featuredArticles = [
    {
      id: 1,
      title: "L'importance de la vaccination chez les chiens",
      excerpt: "Découvrez pourquoi la vaccination est essentielle pour protéger votre chien...",
      author: "Dr. Martin",
      publishedAt: "2024-01-15",
      category: "Prévention"
    },
    {
      id: 2,
      title: "Signes d'alerte chez le chat : quand consulter ?",
      excerpt: "Apprenez à reconnaître les symptômes qui nécessitent une consultation...",
      author: "Dr. Dubois", 
      publishedAt: "2024-01-10",
      category: "Urgences"
    }
  ];

  return (
    <section className="bg-white/90 py-8 sm:py-16">
      <div className="container mx-auto px-3 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-3xl font-bold text-vet-navy mb-3 sm:mb-4">
            Conseils de santé animale
          </h2>
          <p className="text-vet-brown text-sm sm:text-lg max-w-2xl mx-auto">
            Découvrez nos articles rédigés par des vétérinaires experts pour le bien-être de vos compagnons
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Articles en vedette */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {featuredArticles.map((article) => (
              <Card key={article.id} className="bg-white hover:shadow-lg transition-shadow duration-200 border-vet-blue/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-vet-sage/10 p-3 rounded-lg flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-vet-sage" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-block bg-vet-sage/10 text-vet-sage text-xs px-2 py-1 rounded">
                          {article.category}
                        </span>
                        <div className="flex items-center text-xs text-vet-brown">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-vet-navy mb-2 text-sm sm:text-base line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-vet-brown text-xs sm:text-sm mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center text-xs text-vet-brown">
                        <User className="h-3 w-3 mr-1" />
                        {article.author}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Bouton pour voir tous les articles */}
          <div className="text-center">
            <Link to="/articles">
              <Button 
                size="lg"
                className="bg-vet-sage hover:bg-vet-sage/90 text-white px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Voir tous les articles
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
