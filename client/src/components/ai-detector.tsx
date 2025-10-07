import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Copy, Download, Upload, Loader2, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { historyStorage } from "@/lib/history";
import type { AIDetectorRequest, AIDetectorResponse } from "@shared/schema";
import HistoryPanel from "./history-panel";

export default function AIDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AIDetectorResponse | null>(null);
  const [reasoningOpen, setReasoningOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  const analyzeMutation = useMutation({
    mutationFn: async (data: AIDetectorRequest) => {
      const response = await apiRequest("POST", "/api/check", data);
      return await response.json() as AIDetectorResponse;
    },
    onSuccess: (data) => {
      setResult(data);
      // Save to history
      historyStorage.add({
        type: 'detector',
        input: text,
        output: data
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!text.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }
    analyzeMutation.mutate({ text: text.trim() });
  };

  const handleCopy = async () => {
    if (!result) return;
    
    const resultText = `AI Probability: ${result.ai_probability}%\nConfidence: ${result.confidence}\nReasoning: ${result.reasoning}`;
    
    try {
      await navigator.clipboard.writeText(resultText);
      toast({
        title: "Copied!",
        description: "Analysis results copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    const resultText = `AI Detection Analysis Report
    
Text: ${text}

Results:
- AI Probability: ${result.ai_probability}%
- Confidence Level: ${result.confidence}
- Reasoning: ${result.reasoning}

Generated on: ${new Date().toLocaleString()}
`;
    
    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-detection-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Analysis report saved as text file.",
    });
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "Very confident":
        return "text-green-500";
      case "Maybe":
        return "text-yellow-500";
      case "Not confident":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const handleLoadFromHistory = (item: any) => {
    setText(item.input);
    setResult(item.output);
    setShowHistory(false);
    toast({
      title: "Loaded from History",
      description: "Previous analysis loaded successfully.",
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className={showHistory ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
      {/* Input Section */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold">Enter Text to Analyze</label>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-toggle-history"
              >
                <History className="w-4 h-4 mr-2" />
                {showHistory ? 'Hide' : 'Show'} History
              </Button>
              <span className="text-sm text-muted-foreground" data-testid="text-word-count">
                {wordCount} words
              </span>
            </div>
          </div>
          
          <Textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-64 bg-background/50 border-border/50 focus:border-primary/50 resize-none" 
            placeholder="Paste your text here to check if it was written by AI..."
            data-testid="input-text-analyze"
          />
          
          <div className="flex items-center justify-between mt-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            
            <Button 
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending || !text.trim()}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              data-testid="button-analyze"
            >
              {analyzeMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Analyze Text
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Loading State */}
      <AnimatePresence>
        {analyzeMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-12 text-center">
                <div className="inline-block">
                  <Loader2 className="w-16 h-16 text-primary animate-spin" />
                </div>
                <p className="text-lg text-muted-foreground mt-4">Analyzing your text...</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Results Section */}
      <AnimatePresence>
        {result && !analyzeMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Analysis Results</h3>
                
                {/* Probability Display */}
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-4">
                    {/* Circular Progress */}
                    <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="85" 
                        fill="none" 
                        stroke="hsl(var(--muted))" 
                        strokeWidth="12"
                      />
                      <motion.circle 
                        cx="100" 
                        cy="100" 
                        r="85" 
                        fill="none" 
                        stroke="url(#gradient)" 
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray="534"
                        strokeDashoffset={534 - (534 * result.ai_probability / 100)}
                        initial={{ strokeDashoffset: 534 }}
                        animate={{ strokeDashoffset: 534 - (534 * result.ai_probability / 100) }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--secondary))" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Percentage Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <motion.div 
                          className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.8 }}
                          data-testid="text-ai-probability"
                        >
                          {result.ai_probability}%
                        </motion.div>
                        <div className="text-sm text-muted-foreground mt-1">AI Probability</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Confidence Badge */}
                <div className="flex justify-center mb-6">
                  <motion.div 
                    className="inline-flex items-center px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.2 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`} data-testid="text-confidence">
                      {result.confidence}
                    </span>
                  </motion.div>
                </div>
                
                {/* Reasoning Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.4 }}
                >
                  <Collapsible open={reasoningOpen} onOpenChange={setReasoningOpen}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full bg-muted/20 hover:bg-muted/30 p-6 justify-between text-left"
                        data-testid="button-toggle-reasoning"
                      >
                        <span className="font-semibold">View Detailed Reasoning</span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${reasoningOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="px-6 pb-4">
                      <p className="text-muted-foreground mt-4" data-testid="text-reasoning">
                        {result.reasoning}
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
                
                {/* Action Buttons */}
                <motion.div 
                  className="flex gap-4 mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.6 }}
                >
                  <Button 
                    onClick={handleCopy}
                    variant="outline" 
                    className="flex-1 bg-card/50 hover:bg-card/70"
                    data-testid="button-copy-results"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Results
                  </Button>
                  <Button 
                    onClick={handleDownload}
                    variant="outline" 
                    className="flex-1 bg-card/50 hover:bg-card/70"
                    data-testid="button-download-results"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      
      {/* History Panel */}
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-1"
        >
          <HistoryPanel onSelectItem={handleLoadFromHistory} />
        </motion.div>
      )}
    </div>
  );
}
