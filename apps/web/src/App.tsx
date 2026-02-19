import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2, Book, Settings, User } from "lucide-react";

const queryClient = new QueryClient();

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">my-app</h1>
          <p className="text-muted-foreground mb-8">
            A modern web application built with React, Vite, and Tailwind CSS.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/library"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Get Started
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-input bg-background rounded-lg hover:bg-accent"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Book className="w-8 h-8" />}
            title="Feature One"
            description="Description of the first major feature of your application."
          />
          <FeatureCard
            icon={<Settings className="w-8 h-8" />}
            title="Feature Two"
            description="Description of the second major feature of your application."
          />
          <FeatureCard
            icon={<User className="w-8 h-8" />}
            title="Feature Three"
            description="Description of the third major feature of your application."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 border rounded-lg bg-card">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function LibraryPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            my-app
          </Link>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
              Upload
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Library</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Empty state - replace with actual content */}
            <div className="aspect-[2/3] border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
              <p>No items yet</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
