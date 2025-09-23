import { Button } from "./ui/button";

const CtaSection = () => {
  return (
    <section className="py-24 bg-gradient-accent relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-glow/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Ready to start learning?
        </h2>

        <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already improving their knowledge with
          FlashyCardy
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
            Create Account
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
          >
            View Pricing
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
