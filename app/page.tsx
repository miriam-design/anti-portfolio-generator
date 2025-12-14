import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Hammer, Briefcase, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-24 lg:py-32 xl:py-48 bg-background border-b border-border">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-serif">
                  Stop sending generic CVs. <br />
                  <span className="text-accent underline decoration-4 decoration-accent/50 underline-offset-4">
                    Build your Professional DNA.
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-medium">
                  The traditional portfolio is dead. Define who you are by how you think, how you fail, and how you solve impossible problems.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/generate">
                  <Button className="h-14 px-8 text-lg bg-foreground text-background hover:bg-foreground/90 rounded-none border-2 border-transparent hover:border-accent transition-all font-bold tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                    Forge Your Anti-Portfolio
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The Manifesto Section */}
        <section className="w-full py-24 bg-muted/20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-serif">
                The Anti-Manifesto
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                Why the old way is broken and the new way is essential.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-card border-2 border-border rounded-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <Briefcase className="w-10 h-10 mb-4 text-accent" />
                  <CardTitle className="text-xl font-bold font-serif">Job Titles vs. Uniqueness</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Senior Developer" tells us nothing. Your unique combination of philosophy, failures, and methodology tells us everything. Kill the label.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-2 border-border rounded-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <Hammer className="w-10 h-10 mb-4 text-accent" />
                  <CardTitle className="text-xl font-bold font-serif">Success vs. Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A polished final product hides the struggle. The "Anti-Portfolio" celebrates the messy iterations, the pivots, and the hard lessons learned.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-2 border-border rounded-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <Zap className="w-10 h-10 mb-4 text-accent" />
                  <CardTitle className="text-xl font-bold font-serif">Output vs. Methodology</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Don't just show what you built. Show <em>how</em> you think. Your methodology is your most valuable asset, not just the code you shipped.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 w-full border-t border-border">
        <div className="container px-4 md:px-6 mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-sm text-muted-foreground">
          <p>© 2024 Anti-Portfolio. No rights reserved. Copy this.</p>
          <nav className="flex gap-4 sm:gap-6">
            <span className="font-serif italic text-accent">Est. 2024</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}
