import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import WeeklyWorkoutPlan from "@/components/weekly-workout-plan";
import AICoachChat from "@/components/ai-coach-chat";

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Heracles</h1>
      </header>
      <main className="flex flex-col gap-8">
        <WeeklyWorkoutPlan />
        <AICoachChat />
      </main>
    </div>
  );
}
