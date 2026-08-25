import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Books = lazy(() => import('./pages/Books'));
const Communities = lazy(() => import('./pages/Communities'));
const Contact = lazy(() => import('./pages/Contact'));
const Donate = lazy(() => import('./pages/Donate'));
const Devotionals = lazy(() => import('./pages/Devotionals'));
const FreeSample = lazy(() => import('./pages/FreeSample'));
const PrayerPartners = lazy(() => import('./pages/PrayerPartners'));
const PrayerGuidelines = lazy(() => import('./pages/PrayerGuidelines'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/books" element={<Books />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/devotionals" element={<Devotionals />} />
          <Route path="/free-sample" element={<FreeSample />} />
          <Route path="/prayer-partners" element={<PrayerPartners />} />
          <Route path="/prayer-guidelines" element={<PrayerGuidelines />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}
