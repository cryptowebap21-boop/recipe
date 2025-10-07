import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Paste Your Text",
    description: "Copy and paste any text you want to analyze or humanize. Supports up to 5000+ words."
  },
  {
    number: 2,
    title: "Choose Your Tool",
    description: "Select either AI Detector to check authenticity or Humanizer to enhance naturalness."
  },
  {
    number: 3,
    title: "Get Instant Results",
    description: "Receive detailed analysis or rewritten text in seconds, with visual feedback and download options."
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How It <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and powerful. Get results in seconds.
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div 
              key={step.number}
              className="relative mb-12 last:mb-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary to-transparent"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
