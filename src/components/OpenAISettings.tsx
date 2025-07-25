import { useState, useEffect } from 'react';
import { Settings, Key, ExternalLink } from 'lucide-react';
import { openaiService } from '@/lib/openai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const OpenAISettings = () => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setApiKey(openaiService.getApiKey());
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      openaiService.setApiKey(apiKey);
      setOpen(false);
    } catch (error) {
      console.error('Error saving API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDummyKey = openaiService.isDummyKey();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={isDummyKey ? 'border-orange-500 text-orange-600 hover:bg-orange-50' : ''}
        >
          <Settings size={16} className="mr-2" />
          {isDummyKey ? 'Setup API' : 'Settings'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key size={20} />
            OpenAI Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your OpenAI API key to enable real AI conversations with GPT-4o-mini.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>

          {isDummyKey && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Demo Mode:</strong> Currently using a dummy API key. 
                Add your real OpenAI API key to enable intelligent responses.
              </p>
            </div>
          )}

          <div className="p-3 bg-secondary rounded-lg">
            <h4 className="text-sm font-medium mb-2">How to get your API key:</h4>
            <ol className="text-xs text-muted-foreground space-y-1">
              <li>1. Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">platform.openai.com/api-keys <ExternalLink size={12} /></a></li>
              <li>2. Sign in or create an account</li>
              <li>3. Click "Create new secret key"</li>
              <li>4. Copy and paste it here</li>
            </ol>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};