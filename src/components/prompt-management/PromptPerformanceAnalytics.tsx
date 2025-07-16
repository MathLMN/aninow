
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface PromptPerformanceAnalyticsProps {
  performanceLogs: any[];
  templates: any[];
  isLoading: boolean;
}

export const PromptPerformanceAnalytics = ({
  performanceLogs,
  templates,
  isLoading
}: PromptPerformanceAnalyticsProps) => {
  
  const getTemplateStats = () => {
    const stats = new Map();
    
    performanceLogs.forEach(log => {
      const templateId = log.template_id;
      const templateName = log.prompt_templates?.name || 'Template supprimé';
      
      if (!stats.has(templateId)) {
        stats.set(templateId, {
          name: templateName,
          usage_count: 0,
          avg_quality: 0,
          avg_processing_time: 0,
          total_cost: 0,
          quality_scores: [],
          processing_times: []
        });
      }
      
      const stat = stats.get(templateId);
      stat.usage_count += 1;
      stat.quality_scores.push(log.response_quality_score || 0);
      stat.processing_times.push(log.processing_time_ms || 0);
      stat.total_cost += log.cost_cents || 0;
    });
    
    // Calculer les moyennes
    stats.forEach(stat => {
      stat.avg_quality = stat.quality_scores.reduce((a, b) => a + b, 0) / stat.quality_scores.length;
      stat.avg_processing_time = stat.processing_times.reduce((a, b) => a + b, 0) / stat.processing_times.length;
    });
    
    return Array.from(stats.values()).sort((a, b) => b.usage_count - a.usage_count);
  };

  const getUsageOverTime = () => {
    const usage = new Map();
    
    performanceLogs.forEach(log => {
      const date = new Date(log.created_at).toLocaleDateString('fr-FR');
      usage.set(date, (usage.get(date) || 0) + 1);
    });
    
    return Array.from(usage.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // 7 derniers jours
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-vet-brown">Chargement des données...</div>
      </div>
    );
  }

  if (performanceLogs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-vet-brown mb-4">Aucune donnée de performance disponible</p>
        <p className="text-sm text-vet-brown/70">
          Les données apparaîtront une fois que l'IA aura analysé des demandes de consultation
        </p>
      </div>
    );
  }

  const templateStats = getTemplateStats();
  const usageOverTime = getUsageOverTime();
  const totalUsage = performanceLogs.length;
  const avgQuality = performanceLogs.reduce((sum, log) => sum + (log.response_quality_score || 0), 0) / totalUsage;
  const avgProcessingTime = performanceLogs.reduce((sum, log) => sum + (log.processing_time_ms || 0), 0) / totalUsage;
  const totalCost = performanceLogs.reduce((sum, log) => sum + (log.cost_cents || 0), 0);

  return (
    <div className="space-y-6">
      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-vet-navy">Analyses totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-blue">{totalUsage}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-vet-navy">Qualité moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-sage">
              {(avgQuality * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-vet-navy">Temps moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-brown">
              {Math.round(avgProcessingTime)}ms
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-vet-navy">Coût total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-navy">
              {(totalCost / 100).toFixed(2)}€
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Utilisation par template */}
      <Card>
        <CardHeader>
          <CardTitle className="text-vet-navy">Performance par Template</CardTitle>
          <CardDescription>
            Comparaison des performances des différents templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templateStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-vet-beige/20 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-vet-navy">{stat.name}</h4>
                  <div className="flex gap-4 mt-2 text-sm text-vet-brown">
                    <span>Utilisations: {stat.usage_count}</span>
                    <span>Qualité: {(stat.avg_quality * 100).toFixed(1)}%</span>
                    <span>Temps: {Math.round(stat.avg_processing_time)}ms</span>
                    <span>Coût: {(stat.total_cost / 100).toFixed(2)}€</span>
                  </div>
                </div>
                <Badge 
                  variant={stat.avg_quality > 0.8 ? "default" : stat.avg_quality > 0.6 ? "secondary" : "destructive"}
                >
                  {stat.avg_quality > 0.8 ? "Excellent" : stat.avg_quality > 0.6 ? "Bon" : "À améliorer"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-vet-navy">Utilisation par Template</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={templateStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usage_count" fill="#8FBC8F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-vet-navy">Évolution de l'utilisation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2E86AB" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
