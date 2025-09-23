import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Zap, BarChart3, Smartphone } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "AI Generation",
      description:
        "Create flashcards using artificial intelligence for fast learning",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Analytics",
      description: "Track progress and optimize your learning process",
    },
    {
      icon: <Smartphone className="w-8 h-8 text-primary" />,
      title: "Mobility",
      description: "Study anywhere and anytime on all devices",
    },
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why choose FlashyCardy?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Modern tools for effective learning
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card shadow-card hover:shadow-primary transition-all duration-300 transform hover:-translate-y-2 border-border/50"
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
