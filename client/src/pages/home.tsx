import { useState } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import HowItWorksSection from "@/components/how-it-works-section";
import AIDetector from "@/components/ai-detector";
import Humanizer from "@/components/humanizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              HumanizeAI
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#app" className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
              Get Started
            </a>
          </nav>
          
          <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </header>

      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      
      {/* Main App Section */}
      <section id="app" className="py-20 bg-gradient-to-b from-transparent to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Tabs defaultValue="detector" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-card/50 backdrop-blur-sm">
                  <TabsTrigger value="detector" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                    🔍 AI Detector
                  </TabsTrigger>
                  <TabsTrigger value="humanizer" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                    ✨ Humanizer
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="detector">
                  <AIDetector />
                </TabsContent>
                
                <TabsContent value="humanizer">
                  <Humanizer />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © 2025 HumanizeAI – Making Texts Sound Real.
              </p>
              <a 
                href="/privacy" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                data-testid="link-privacy-policy"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
