import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>&copy; 2025 LG Radar. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <Link
              href="https://www.lgradar.com.au/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="https://www.lgradar.com.au/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}