import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink-800/50 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-playfair text-lg font-bold text-gold-300 mb-3">In Him Daily</h3>
            <p className="text-sm text-white/50 leading-relaxed max-w-md">
              Christ-centred devotionals and books for every age — helping you see Jesus on every page of Scripture.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/devotionals" className="text-white/50 hover:text-gold-300">Devotionals</Link></li>
              <li><Link to="/books" className="text-white/50 hover:text-gold-300">Books</Link></li>
              <li><Link to="/blog" className="text-white/50 hover:text-gold-300">Blog</Link></li>
              <li><Link to="/communities" className="text-white/50 hover:text-gold-300">Communities</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-white/50 hover:text-gold-300">Contact</Link></li>
              <li><Link to="/prayer-partners" className="text-white/50 hover:text-gold-300">Prayer Partners</Link></li>
              <li><Link to="/donate" className="text-white/50 hover:text-gold-300">Donate</Link></li>
              <li><Link to="/free-sample" className="text-white/50 hover:text-gold-300">Free Sample</Link></li>
              <li><Link to="/privacy" className="text-white/50 hover:text-gold-300">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} In Him Daily. All rights reserved.</p>
          <p className="text-xs text-white/30 flex items-center gap-1.5">Made with <Heart size={12} className="text-gold-400" /> for His glory</p>
        </div>
      </div>
    </footer>
  );
}
