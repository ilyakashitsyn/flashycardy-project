import { Button } from "./ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-foreground">FlashyCardy</h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How it Works
          </a>
          <a
            href="#pricing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Sign In
          </Button>
          <Button variant="hero">Sign Up</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
