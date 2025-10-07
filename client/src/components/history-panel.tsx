import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Trash2, RefreshCw, Clock, FileText } from "lucide-react";
import { historyStorage, type HistoryItem } from "@/lib/history";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface HistoryPanelProps {
  onSelectItem: (item: HistoryItem) => void;
}

export default function HistoryPanel({ onSelectItem }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'detector' | 'humanizer'>('all');
  const { toast } = useToast();

  const loadHistory = () => {
    setHistory(historyStorage.getAll());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    historyStorage.delete(id);
    loadHistory();
    toast({
      title: "Deleted",
      description: "History item removed.",
    });
  };

  const handleClearAll = () => {
    historyStorage.clear();
    loadHistory();
    toast({
      title: "Cleared",
      description: "All history has been removed.",
    });
  };

  const filteredHistory = activeTab === 'all' 
    ? history 
    : history.filter(item => item.type === activeTab);

  const getResultSummary = (item: HistoryItem) => {
    if (item.type === 'detector') {
      return `${item.output.ai_probability}% AI - ${item.output.confidence}`;
    } else {
      return `${item.output.meta.rewrittenWordCount} words`;
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50" data-testid="card-history-panel">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">History</h3>
            <span className="text-sm text-muted-foreground" data-testid="text-history-count">
              ({filteredHistory.length})
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadHistory}
              data-testid="button-refresh-history"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={history.length === 0}
              data-testid="button-clear-history"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="all" data-testid="tab-history-all">All</TabsTrigger>
            <TabsTrigger value="detector" data-testid="tab-history-detector">Detector</TabsTrigger>
            <TabsTrigger value="humanizer" data-testid="tab-history-humanizer">Humanizer</TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="h-96">
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredHistory.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground" data-testid="text-no-history">
                    No history yet
                  </p>
                </motion.div>
              ) : (
                filteredHistory.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                  >
                    <Card
                      className="bg-background/50 border-border/50 hover:bg-background/70 transition-colors cursor-pointer group"
                      onClick={() => onSelectItem(item)}
                      data-testid={`card-history-item-${item.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                item.type === 'detector' 
                                  ? 'bg-primary/20 text-primary' 
                                  : 'bg-secondary/20 text-secondary'
                              }`}>
                                {item.type === 'detector' ? '🔍 Detector' : '✨ Humanizer'}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span data-testid={`text-history-time-${item.id}`}>
                                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-foreground/80 truncate mb-1" data-testid={`text-history-preview-${item.id}`}>
                              {item.preview}
                            </p>
                            
                            <p className="text-xs text-muted-foreground" data-testid={`text-history-summary-${item.id}`}>
                              {getResultSummary(item)}
                            </p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleDelete(item.id, e)}
                            data-testid={`button-delete-history-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
