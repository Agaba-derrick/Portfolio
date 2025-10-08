"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Mail, MailOpen, Clock, User, AtSign } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface MessagesResponse {
  messages: ContactMessage[];
  total: number;
  unread: number;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contact");
      const data: MessagesResponse = await response.json();

      if (response.ok) {
        setMessages(data.messages);
        setUnreadCount(data.unread);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleMessageClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
              <p className="text-gray-600 mt-2">
                Manage and respond to messages from your portfolio
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {unreadCount} unread
              </Badge>
              <Button onClick={fetchMessages} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Messages ({messages.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No messages yet</div>
                  ) : (
                    <div className="space-y-1">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          onClick={() => handleMessageClick(message)}
                          className={`p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                            selectedMessage?.id === message.id ? "bg-blue-50 border-blue-200" : ""
                          } ${!message.read ? "bg-blue-25 border-l-4 border-l-blue-500" : ""}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {message.read ? (
                                  <MailOpen className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <Mail className="w-4 h-4 text-blue-500" />
                                )}
                                <span
                                  className={`font-medium truncate ${
                                    !message.read ? "text-gray-900" : "text-gray-700"
                                  }`}
                                >
                                  {message.name}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate">{message.email}</p>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {message.message}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {selectedMessage.name}
                        {!selectedMessage.read && (
                          <Badge variant="default" className="ml-2">
                            New
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <AtSign className="w-4 h-4" />
                        {selectedMessage.email}
                      </CardDescription>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(selectedMessage.timestamp)}
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <h4 className="text-lg font-semibold mb-4">Message:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={() =>
                        window.open(
                          `mailto:${selectedMessage.email}?subject=Re: Your message from portfolio`,
                        )
                      }
                      className="flex-1"
                    >
                      Reply via Email
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedMessage.email);
                        alert("Email copied to clipboard!");
                      }}
                    >
                      Copy Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-[600px]">
                  <div className="text-center text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No message selected</h3>
                    <p>Select a message from the list to view its details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
