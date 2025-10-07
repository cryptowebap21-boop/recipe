import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Upload, Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { HumanizerRequest, HumanizerResponse } from "@shared/schema";

export default function Humanizer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<HumanizerResponse | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const { toast } = useToast();

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  const humanizeMutation = useMutation({
    mutationFn: async (data: HumanizerRequest) => {
      const response = await apiRequest("POST", "/api/humanize", data);
      return await response.json() as HumanizerResponse;
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      toast({
        title: "Humanization Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleHumanize = () => {
    if (!text.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please enter some text to humanize.",
        variant: "destructive",
      });
      return;
    }
    humanizeMutation.mutate({ text: text.trim() });
  };

  const handleCopy = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(result.rewrittenText);
      toast({
        title: "Copied!",
        description: "Humanized text copied to clipboard.",
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
    
    const blob = new Blob([result.rewrittenText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'humanized-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Humanized text saved as text file.",
    });
  };

  // Simple diff highlighting function
  const createDiffView = (original: string, humanized: string) => {
    const originalWords = original.split(' ');
    const humanizedWords = humanized.split(' ');
    const result = [];
    
    let i = 0, j = 0;
    while (i < originalWords.length || j < humanizedWords.length) {
      if (i >= originalWords.length) {
        // Only humanized words left
        result.push(<span key={`add-${j}`} className="bg-green-500/20 text-green-400 px-1 rounded">{humanizedWords[j]} </span>);
        j++;
      } else if (j >= humanizedWords.length) {
        // Only original words left
        result.push(<span key={`del-${i}`} className="bg-red-500/20 text-red-400 line-through px-1 rounded">{originalWords[i]} </span>);
        i++;
      } else if (originalWords[i] === humanizedWords[j]) {
        // Same word
        result.push(<span key={`same-${i}-${j}`}>{originalWords[i]} </span>);
        i++;
        j++;
      } else {
        // Different words - show both
        result.push(
          <span key={`change-${i}-${j}`}>
            <span className="bg-red-500/20 text-red-400 line-through px-1 rounded mr-1">{originalWords[i]}</span>
            <span className="bg-green-500/20 text-green-400 px-1 rounded">{humanizedWords[j]} </span>
          </span>
        );
        i++;
        j++;
      }
    }
    
    return result;
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold">Enter Text to Humanize</label>
            <span className="text-sm text-muted-foreground" data-testid="text-word-count">
              {wordCount} words
            </span>
          </div>
          
          <Textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-64 bg-background/50 border-border/50 focus:border-primary/50 resize-none" 
            placeholder="Paste your text here to make it sound more natural and human-like..."
            data-testid="input-text-humanize"
          />
          
          <div className="flex items-center justify-between mt-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            
            <Button 
              onClick={handleHumanize}
              disabled={humanizeMutation.isPending || !text.trim()}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              data-testid="button-humanize"
            >
              {humanizeMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Humanize Text
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Loading State */}
      <AnimatePresence>
        {humanizeMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-12 text-center">
                <div className="inline-block">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-16 h-16 text-secondary" />
                  </motion.div>
                </div>
                <p className="text-lg text-muted-foreground mt-4">Humanizing your text...</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Results Section - Side by Side Comparison */}
      <AnimatePresence>
        {result && !humanizeMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Humanized Results</h3>
                  
                  <Button 
                    onClick={() => setShowDiff(!showDiff)}
                    variant="outline" 
                    size="sm"
                    className="bg-card/50 hover:bg-card/70"
                    data-testid="button-toggle-diff"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showDiff ? "Hide" : "Show"} Differences
                  </Button>
                </div>
                
                {!showDiff ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Original Text */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold text-muted-foreground">Original</label>
                        <span className="text-xs text-muted-foreground" data-testid="text-original-word-count">
                          {result.meta.originalWordCount} words
                        </span>
                      </div>
                      <div className="bg-background/50 border border-border/50 rounded-xl p-4 h-96 overflow-y-auto">
                        <p className="text-foreground/80 whitespace-pre-wrap" data-testid="text-original">
                          {result.originalText}
                        </p>
                      </div>
                    </div>
                    
                    {/* Humanized Text */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold text-secondary">Humanized</label>
                        <span className="text-xs text-muted-foreground" data-testid="text-humanized-word-count">
                          {result.meta.rewrittenWordCount} words
                        </span>
                      </div>
                      <div className="bg-background/50 border border-secondary/50 rounded-xl p-4 h-96 overflow-y-auto">
                        <p className="text-foreground whitespace-pre-wrap" data-testid="text-humanized">
                          {result.rewrittenText}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Diff Highlighting View */
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="text-sm font-semibold mb-3 block">Changes Highlighted</label>
                    <div className="bg-background/50 border border-border/50 rounded-xl p-4 max-h-96 overflow-y-auto">
                      <div className="leading-relaxed" data-testid="text-diff-view">
                        {createDiffView(result.originalText, result.rewrittenText)}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Action Buttons */}
                <motion.div 
                  className="flex gap-4 mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Button 
                    onClick={handleCopy}
                    variant="outline" 
                    className="flex-1 bg-card/50 hover:bg-card/70"
                    data-testid="button-copy-result"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Result
                  </Button>
                  <Button 
                    onClick={handleDownload}
                    variant="outline" 
                    className="flex-1 bg-card/50 hover:bg-card/70"
                    data-testid="button-download-txt"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download TXT
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
