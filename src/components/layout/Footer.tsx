import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-sidebar-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3">
              Stay Updated with New Arrivals
            </h3>
            <p className="text-sidebar-foreground/70 mb-6">
              Subscribe to our newsletter and get 10% off your first order
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={async (e) => {
                e.preventDefault();
                const emailInput = (e.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement;
                const email = emailInput.value;

                try {
                  const response = await fetch('http://localhost:5000/api/newsletter/subscribe', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                  });

                  const data = await response.json();

                  if (response.ok) {
                    // Success feedback
                    const btn = (e.target as HTMLFormElement).querySelector('button');
                    if (btn) {
                      const originalText = btn.innerText;
                      btn.innerText = 'Subscribed!';
                      btn.classList.add('bg-green-600', 'text-white');
                      setTimeout(() => {
                        btn.innerText = originalText;
                        btn.classList.remove('bg-green-600', 'text-white');
                        emailInput.value = '';
                      }, 3000);
                    }
                    if (data.message) alert(data.message); // Simple alert for now or replace with toast if available in context
                  } else {
                    alert(data.message || 'Subscription failed');
                  }
                } catch (error) {
                  console.error('Error subscribing:', error);
                  alert('Something went wrong. Please try again.');
                }
              }}
            >
              <Input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50"
              />
              <Button type="submit" variant="gold" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-sidebar-primary" />
              <span className="font-serif text-2xl font-bold">
                Book<span className="text-sidebar-primary">Haven</span>
              </span>
            </Link>
            <p className="text-sidebar-foreground/70 mb-6 leading-relaxed">
              Your one-stop destination for all kinds of books. Discover millions of titles from bestsellers to rare finds.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">Contact</Link></li>
              <li><Link to="/faqs" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">Return Policy</Link></li>
              <li><Link to="/privacy" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-3">
              {['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Self-Help'].map((category) => (
                <li key={category}>
                  <Link
                    to={`/books?category=${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-sidebar-primary shrink-0 mt-0.5" />
                <span className="text-sidebar-foreground/70">
                  123 Book Street, Library District,<br />
                  New Delhi, India - 110001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-sidebar-primary shrink-0" />
                <span className="text-sidebar-foreground/70">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-sidebar-primary shrink-0" />
                <span className="text-sidebar-foreground/70">support@bookhaven.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sidebar-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-sidebar-foreground/60">
            <p>© 2024 BookHaven. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="#" className="hover:text-sidebar-primary transition-colors">Terms</Link>
              <Link to="#" className="hover:text-sidebar-primary transition-colors">Privacy</Link>
              <Link to="#" className="hover:text-sidebar-primary transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
