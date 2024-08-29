import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { BrainCircuit, Lightbulb, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-primary/20 via-primary/10 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Learn Smarter with AI-Powered Flashcards
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Flashy uses cutting-edge AI to generate personalized
                  flashcards, making your learning experience more efficient and
                  effective than ever before.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/register">
                  <Button>Get Started for Free</Button>
                </Link>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Why Choose Flashy?
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <BrainCircuit className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">
                  AI-Generated Flashcards
                </h3>
                <p className="text-muted-foreground">
                  Our AI creates tailored flashcards from your prompt.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Lightbulb className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">
                  Smart Learning Algorithms
                </h3>
                <p className="text-muted-foreground">
                  Adaptive algorithms optimize your study schedule for better
                  retention.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Zap className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Rapid Progress</h3>
                <p className="text-muted-foreground">
                  Learn faster and more efficiently with our proven methods.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              How It Works
            </h2>
            <div className="grid gap-10 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Your Material</h3>
                <p className="text-muted-foreground">
                  Simply enter a prompt for what you want to study.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">
                  AI Generates Flashcards
                </h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your prompt and creates optimized flashcards.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Start Learning</h3>
                <p className="text-muted-foreground">
                  Begin your study session with personalized, AI-powered
                  flashcards.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Supercharge Your Learning?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  Join thousands of students who are already learning smarter
                  with Flashy.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button type="submit">Get Started</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 Flashy. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <p className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </p>
          <p className="text-xs hover:underline underline-offset-4">Privacy</p>
        </nav>
      </footer>
    </div>
  );
}
