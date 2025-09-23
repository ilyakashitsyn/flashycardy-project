const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Create a deck",
      description: "Create a new flashcard deck or use AI for generation"
    },
    {
      number: "2", 
      title: "Add cards",
      description: "Add questions and answers or let AI create them for you"
    },
    {
      number: "3",
      title: "Study",
      description: "Start studying with smart spaced repetition"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How does it work?
          </h2>
          <p className="text-xl text-muted-foreground">
            Simple process in three steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-primary group-hover:shadow-glow transform group-hover:-translate-y-1 transition-all duration-300">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;