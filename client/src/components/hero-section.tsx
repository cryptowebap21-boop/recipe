import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-block px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ✨ Powered by DeepSeek v3
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Detect AI, Perfect Your
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
              Human Touch
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Advanced AI detection and text humanization in one powerful platform. Analyze content authenticity and enhance natural writing instantly.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <a 
              href="#app" 
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl w-full sm:w-auto"
              data-testid="button-start-analyzing"
            >
              Start Analyzing
            </a>
            <a 
              href="#how-it-works" 
              className="px-8 py-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl text-foreground font-semibold text-lg hover:bg-card/70 transition-colors w-full sm:w-auto"
              data-testid="button-learn-more"
            >
              Learn More
            </a>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                99.2%
              </div>
              <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                5M+
              </div>
              <div className="text-sm text-muted-foreground mt-1">Words Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-sm text-muted-foreground mt-1">Users</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
