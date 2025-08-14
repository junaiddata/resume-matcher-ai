'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { UserCircle, CheckCircle, Zap, Target, Clock, Star, ArrowRight } from 'lucide-react';

export default function Landing() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || '';

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      title: "Lightning Fast",
      description: "Get instant AI-powered match scores in seconds"
    },
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      title: "Accurate Matching",
      description: "Advanced algorithms ensure precise resume-job alignment"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "Save Time",
      description: "Reduce hiring time by 80% with automated screening"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Director",
      company: "TechCorp",
      content: "This tool has revolutionized our hiring process. We've cut screening time by 75%!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Recruiting Manager",
      company: "StartupXYZ",
      content: "The AI accuracy is impressive. It catches details we might have missed.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            AI Resume Matcher
          </h1>

          <nav className="flex items-center gap-6">
            <Link href="/plans" className="text-gray-600 hover:text-blue-600 transition">
              Pricing
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition">
              Features
            </Link>
            
            {!session ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => signIn()}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 transition"
                >
                  Login
                </button>
                <Link href="/signup">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
                    Sign Up Free
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/plans">
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition transform hover:scale-105">
                    ✨ Upgrade
                  </button>
                </Link>
                <Link href="/profile">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
                    <UserCircle className="w-5 h-5" />
                    <span className="text-sm">{userEmail}</span>
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-600 hover:text-gray-800 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
            <Star className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800 font-medium">Trusted by 10,000+ recruiters</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Smart Resume Screening
            <br />Powered by AI
          </h2>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Upload resumes and job descriptions to instantly get AI-powered match scores. 
            Find the perfect candidates in seconds, not hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={session ? "/matcher" : "/signup"}>
              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg transform hover:scale-105 flex items-center gap-2 group">
                Start Matching Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </Link>
            <Link href="/plans">
              <button className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition">
                View Pricing
              </button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required • Free plan available
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose AI Resume Matcher?</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h4 className="text-xl font-semibold mb-2">Upload Resumes</h4>
              <p className="text-gray-600">Drag and drop multiple resumes or upload them in bulk</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h4 className="text-xl font-semibold mb-2">Add Job Description</h4>
              <p className="text-gray-600">Paste the job requirements you're looking to fill</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h4 className="text-xl font-semibold mb-2">Get Instant Scores</h4>
              <p className="text-gray-600">Receive AI-powered match scores and rankings instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">What Our Users Say</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 rounded-xl bg-gray-50">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring Process?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of recruiters who are hiring smarter, not harder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={session ? "/matcher" : "/signup"}>
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition shadow-lg">
                Get Started Free
              </button>
            </Link>
            <Link href="/plans">
              <button className="px-8 py-4 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition border border-blue-500">
                See Premium Plans
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 AI Resume Matcher. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}