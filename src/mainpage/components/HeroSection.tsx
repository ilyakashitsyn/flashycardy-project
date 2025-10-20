import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center justify-center overflow-hidden">
      {/* Organic Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/25 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-background/20 backdrop-blur-sm rounded-full text-sm text-foreground border border-border/30">
            🎉 New way to learn
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight">
          FlashyCardy
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your personal flashcard platform
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <SignUpButton mode="modal">
            <Button variant="default" size="lg" className="text-lg px-8 py-6">
              Start Free
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-background/20 backdrop-blur-sm border-background/40 hover:bg-background/30"
            >
              Sign In
            </Button>
          </SignInButton>
        </div>

        <p className="text-sm text-muted-foreground">
          No credit card required • Start right now
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
