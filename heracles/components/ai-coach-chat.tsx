"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const AICoachChat = () => {
  const [weeklyContext, setWeeklyContext] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  const handleSaveContext = () => {
    // TODO: Implement saving weekly context to the database
    console.log("Saving weekly context:", weeklyContext);
  };

  const handleSendMessage = () => {
    // TODO: Implement sending chat message to the AI coach
    console.log("Sending message to AI coach:", chatMessage);
    setChatMessage("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Coach Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Weekly Context</h3>
            <Textarea
              value={weeklyContext}
              onChange={(e) => setWeeklyContext(e.target.value)}
              placeholder="Add context for your weekly plan..."
              rows={3}
            />
            <Button onClick={handleSaveContext} className="mt-2">Save Context</Button>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Chat with AI Coach</h3>
            <Textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message to the AI coach..."
              rows={3}
            />
            <Button onClick={handleSendMessage} className="mt-2">Send Message</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AICoachChat;