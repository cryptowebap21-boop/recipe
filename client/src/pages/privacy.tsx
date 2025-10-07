import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HumanizeAI
              </span>
            </div>
          </Link>
          
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Privacy Policy Content */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                  Privacy Policy
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  HumanizeAI cares about your privacy.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="prose prose-invert max-w-none"
              >
                <div className="space-y-6 text-foreground/90 leading-relaxed">
                  <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment to Privacy</h2>
                    <p className="text-muted-foreground">
                      At HumanizeAI, we are committed to protecting your privacy and ensuring the security of your data. 
                      This Privacy Policy explains how we handle your information when you use our AI detection and text 
                      humanization services.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Data Processing</h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        We process your text <strong>only</strong> to provide Humanize and AI Detection results.
                      </li>
                      <li>
                        We don't permanently store user inputs or share them with third parties.
                      </li>
                      <li>
                        Your text is temporarily processed through our AI service (DeepSeek v3 via Router API) and 
                        immediately discarded after generating results.
                      </li>
                      <li>
                        Session results are stored temporarily in your browser's local storage for your convenience, 
                        but can be cleared at any time.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        All API communications are secured via HTTPS encryption.
                      </li>
                      <li>
                        We implement industry-standard security measures to protect your data during transmission.
                      </li>
                      <li>
                        No user accounts or personal information are required to use our service.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Services</h2>
                    <p className="text-muted-foreground">
                      We use DeepSeek v3 AI model through Router API to process your text. By using our service, 
                      you acknowledge that your text will be sent to this third-party AI service for processing. 
                      The AI service processes the text according to their own privacy policies and does not 
                      retain your data after processing.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
                    <p className="text-muted-foreground">
                      Since we don't permanently store your data, there's no personal information to access, 
                      modify, or delete. You have complete control over your data by clearing your browser's 
                      local storage at any time.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                    <p className="text-muted-foreground">
                      If you have any questions or concerns about our privacy practices, you can contact us at{" "}
                      <a 
                        href="mailto:support@humanizeai.io" 
                        className="text-primary hover:text-secondary transition-colors underline"
                      >
                        support@humanizeai.io
                      </a>
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
                    <p className="text-muted-foreground">
                      We may update this Privacy Policy from time to time. Any changes will be posted on this page 
                      with an updated revision date.
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                      <strong>Last Updated:</strong> January 2025
                    </p>
                  </section>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
