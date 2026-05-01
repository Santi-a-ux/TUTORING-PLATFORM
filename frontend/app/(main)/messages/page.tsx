"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, AlertCircle, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

interface Message {
  id: string;
  conversation_id?: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  is_read: boolean;
}

interface MyUserProfile {
  user_id: string;
}

function MessagesPageContent() {
  const searchParams = useSearchParams();
  const initialReceiverId = searchParams.get("userId") || "";
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [receiverId, setReceiverId] = useState(initialReceiverId);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [meId, setMeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const isUuid = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.trim());

  const loadConversationMessages = async (convId: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${convId}`);
      if (!response.ok) {
        return;
      }

      const history = (await response.json()) as Array<{
        id: string;
        sender_id: string;
        content: string;
        created_at: string;
        is_read: boolean;
      }>;

      setMessages(
        history.map((msg) => ({
          id: String(msg.id),
          conversation_id: convId,
          sender_id: String(msg.sender_id),
          receiver_id: receiverId,
          content: msg.content,
          timestamp: msg.created_at,
          is_read: msg.is_read,
        }))
      );
    } catch (err) {
      console.error("Error cargando historial:", err);
    }
  };

  const ensureConversation = async (participantId: string) => {
    try {
      const response = await fetch("/api/chat/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant_id: participantId }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear/obtener la conversación");
      }

      const data = (await response.json()) as { id: string };
      if (data.id) {
        setConversationId(data.id);
        await loadConversationMessages(data.id);
      }
    } catch (err) {
      console.error("Error asegurando conversación:", err);
      setConversationId(null);
    }
  };

  // Obtener nuestro propio ID
  useEffect(() => {
    fetch("/api/session")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("No authenticated session");
        }

        return response.json() as Promise<MyUserProfile>;
      })
      .then((user) => {
        setMeId(user.user_id);
      })
      .catch((err) => {
        console.error("Error obteniendo mi usuario:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const userIdFromUrl = searchParams.get("userId") || "";
    if (userIdFromUrl && userIdFromUrl !== receiverId) {
      setReceiverId(userIdFromUrl);
    }
  }, [searchParams, receiverId]);

  useEffect(() => {
    if (!receiverId || !isUuid(receiverId)) {
      setConversationId(null);
      setMessages([]);
      return;
    }

    void ensureConversation(receiverId);
  }, [receiverId]);

  // Inicializar WebSockets
  useEffect(() => {
    if (!meId) return;

    // Obtener token para WebSocket desde la API (server route)
    const fetchTokenAndConnect = async () => {
      try {
        const tokenRes = await fetch("/api/auth/ws-token");
        if (!tokenRes.ok) {
          throw new Error("Failed to fetch WS token");
        }
        const { token } = await tokenRes.json();

        // Conectar WebSocket con el token
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/chat/ws";
        const ws = new WebSocket(`${wsUrl}/${meId}?token=${token}`);

        ws.onopen = () => {
          console.log("WebSocket connected");
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            // Si el backend nos mandó un mensaje
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                conversation_id: data.conversation_id || conversationId || undefined,
                sender_id: String(data.sender_id || ""),
                receiver_id: receiverId,
                content: data.content || "",
                timestamp: new Date().toISOString(),
                is_read: false,
              },
            ]);
            // Bajar el scroll
            setTimeout(() => {
              if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }, 100);
          } catch (err) {
            console.error("Error parseando mensaje WS:", err);
          }
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
          setIsConnected(false);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setIsConnected(false);
        };

        setSocket(ws);
      } catch (err) {
        console.error("Error conectando WebSocket:", err);
        setIsConnected(false);
      }
    };

    fetchTokenAndConnect();

    return () => {
      if (socket) socket.close();
    };
  }, [meId, receiverId, conversationId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!socket || !isConnected || !meId) {
      toast.error("No estás conectado al servidor de chat.");
      return;
    }
    
    if (!receiverId.trim() || !isUuid(receiverId)) {
      toast.error("Selecciona un destinatario válido.");
      return;
    }

    if (!conversationId) {
      toast.error("No se pudo abrir la conversación. Intenta de nuevo.");
      return;
    }

    if (!newMessage.trim()) {
      return;
    }

    const payload = {
      conversation_id: conversationId,
      receiver_id: receiverId,
      content: newMessage,
    };

    // Enviar a través de websockets
    socket.send(JSON.stringify(payload));
    
    // Optimistic Update
    const optimisticMessage: Message = {
      id: Math.random().toString(),
      conversation_id: conversationId,
      sender_id: meId || "me",
      receiver_id: receiverId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      is_read: false,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 100);
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar de Chat - Lista de chats (ejemplo estatico) */}
      <Card className="w-full md:w-80 h-full flex flex-col shrink-0">
        <CardHeader className="py-4 border-b">
          <CardTitle className="text-lg">Chat</CardTitle>
          <CardDescription>
            {isConnected ? <span className="text-green-500 font-medium">● Conectado</span> : <span className="text-red-500">● Desconectado</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto">
          <div className="p-3 text-sm space-y-2">
            <Label htmlFor="receiver">ID Destinatario (Manual)</Label>
            <Input 
              id="receiver" 
              placeholder="UUID del usuario..." 
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-2">
              *Puedes pegar el ID desde perfil o mapa. Al enviar, los mensajes se guardan en la conversación.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ventana de Mensajes */}
      <Card className="flex-1 flex flex-col h-full overflow-hidden">
        <CardHeader className="py-4 border-b shrink-0 flex flex-row items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${receiverId || "empty"}`} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{receiverId ? `Conversación con ${receiverId.substring(0,8)}...` : "Selecciona un chat"}</CardTitle>
            <CardDescription>
              {conversationId ? "Conversación lista para enviar" : "Ingresa un destinatario para abrir la conversación"}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0 relative bg-muted/30">
          <ScrollArea className="h-full w-full p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground pt-32">
                <MessageSquare className="w-12 h-12 mb-3 text-muted-foreground/50" />
                <p>No hay mensajes todavía.</p>
                <p className="text-sm">Escribe abajo para iniciar la conversación.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 py-2">
                {messages.map((msg, idx) => {
                  const isMe = msg.sender_id === meId;
                  return (
                    <div key={`${msg.id}-${idx}`} className={`flex flex-col max-w-[75%] ${isMe ? "self-end" : "self-start"}`}>
                      <div className={`p-3 rounded-2xl ${isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card text-card-foreground border rounded-bl-sm"}`}>
                        {msg.content}
                      </div>
                      <span className={`text-[10px] text-muted-foreground mt-1 ${isMe ? "text-right" : "text-left"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>

        <div className="p-4 border-t bg-background shrink-0 pl-16 md:pl-4 transition-all relative">
          <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
            {!isConnected && <AlertCircle className="text-destructive w-5 h-5 absolute left-6 md:-left-3 shrink-0" />}
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={receiverId ? "Escribe un mensaje..." : "Ingresa el ID del destinatario primero..."}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!isConnected || !newMessage.trim() || !receiverId.trim() || !conversationId}>
              <Send className="w-4 h-4" />
              <span className="sr-only">Enviar mensaje</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <MessagesPageContent />
    </Suspense>
  );
}