import { Header } from '@/components/Header';
import { ChatInterface } from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-background theme-transition">
      <Header />
      
      <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full flex flex-col">
        <ChatInterface />
      </main>
    </div>
  );
};

export default Index;
