import { Wand2, Layout, Palette, Users, Zap } from 'lucide-react';
import Button from '../components/Button';

interface LandingPageProps {
  onAuth: (type: 'login' | 'signup') => void;
}

const features = [
  {
    icon: <Wand2 className="h-6 w-6" />,
    title: 'AI-Powered Design',
    description: 'Create stunning banners with AI-generated design suggestions and smart layouts.'
  },
  {
    icon: <Layout className="h-6 w-6" />,
    title: 'Multi-Format Export',
    description: 'Export your designs in PNG, Video, SVG, and HTML formats.'
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Team Collaboration',
    description: 'Work together with your team in shared workspaces with role-based access.'
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: 'Custom Branding',
    description: 'Upload and manage your brand assets with AI-powered recommendations.'
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Automation & API',
    description: 'Automate banner creation with our powerful API integration.'
  }
];

export default function LandingPage({ onAuth }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="fixed w-full bg-white/80 backdrop-blur-sm border-b z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wand2 className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">AI-Digital-Banner</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => onAuth('login')}>
              Log in
            </Button>
            <Button size="sm" onClick={() => onAuth('signup')}>
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Create stunning digital banners<br />powered by AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Design professional advertisements in minutes with our AI-powered platform.
            Perfect for marketers, designers, and businesses of all sizes.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => onAuth('signup')}>
              Start Creating for Free
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to create amazing banners
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-lg border bg-white hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to transform your digital advertising?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using AI-Digital-Banner to create stunning advertisements.
          </p>
          <Button variant="secondary" size="lg" onClick={() => onAuth('signup')}>
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wand2 className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">AI-Digital-Banner</span>
            </div>
            <p className="text-gray-600">© 2025 AI-Digital-Banner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}