import { memo } from "react";

const Footer = memo(() => {
  return (
    <footer className="py-12 bg-background border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Copyright FlashyCardy by Ilya Kashitsyn
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
