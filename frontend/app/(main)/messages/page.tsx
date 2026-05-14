"use client";

import { Suspense, useEffect, useMemo, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconShare, IconMessages, IconComment } from "@/components/icons/TmIcons";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";

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

interface ConversationSummary {
  id: string;
  participant_ids: string[];
  other_participant_id?: string | null;
  last_message?: string | null;
  last_message_at?: string | null;
  updated_at?: string;
}

interface UserProfileSummary {
  display_name?: string;
  avatar_url?: string;
}

interface ConversationItem extends ConversationSummary {
  partnerName: string;
  partnerAvatar?: string;
}

function MessagesPageContent() {
  const searchParams = useSearchParams();
  const initialReceiverId = searchParams.get("userId") || "";
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [receiverId, setReceiverId] = useState(initialReceiverId);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [meId, setMeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [receiverProfile, setReceiverProfile] = useState<UserProfileSummary | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const receiverIdRef = useRef(initialReceiverId);
  const conversationIdRef = useRef<string | null>(null);

  useEffect(() => {
    receiverIdRef.current = receiverId;
  }, [receiverId]);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  const isUuid = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.trim());

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/chat/conversations");
      if (!response.ok) {
        throw new Error("No se pudieron cargar las conversaciones");
      }

      const list = (await response.json()) as ConversationSummary[];
      const enriched = await Promise.all(
        list.map(async (conversation) => {
          const partnerId = conversation.other_participant_id || conversation.participant_ids.find((participantId) => participantId !== meId) || "";
          const profile = partnerId
            ? await fetchApi<UserProfileSummary>(`/users/profiles/${partnerId}`).catch(() => null)
            : null;

          return {
            ...conversation,
            partnerName: profile?.display_name || `Chat ${partnerId ? partnerId.slice(0, 8) : ""}`,
            partnerAvatar: profile?.avatar_url,
          };
        })
      );

      setConversations(enriched);
    } catch {
      setConversations([]);
    }
  };

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
          receiver_id: receiverIdRef.current,
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

  const openConversation = async (participantId: string) => {
    if (!participantId || !isUuid(participantId)) {
      return;
    }

    setReceiverId(participantId);
    setReceiverProfile(null);
    await ensureConversation(participantId);
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
    if (!receiverId || !isUuid(receiverId)) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void ensureConversation(receiverId);
  }, [receiverId]);

  useEffect(() => {
    if (!meId) {
      return;
    }

    void loadConversations();
  }, [meId]);

  useEffect(() => {
    if (!receiverId || !isUuid(receiverId)) {
      setReceiverProfile(null);
      return;
    }

    let active = true;

    fetchApi<UserProfileSummary>(`/users/profiles/${receiverId}`)
      .then((profile) => {
        if (active) {
          setReceiverProfile(profile);
        }
      })
      .catch(() => {
        if (active) {
          setReceiverProfile(null);
        }
      });

    return () => {
      active = false;
    };
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
                conversation_id: data.conversation_id || conversationIdRef.current || undefined,
                sender_id: String(data.sender_id || ""),
                receiver_id: receiverIdRef.current,
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

        wsRef.current = ws;
        setSocket(ws);
      } catch (err) {
        console.error("Error conectando WebSocket:", err);
        setIsConnected(false);
      }
    };

    fetchTokenAndConnect();

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [meId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!socket || !isConnected || !meId) {
      toast.error("No estás conectado al servidor de chat.");
      return;
    }
    
    if (!receiverIdRef.current.trim() || !isUuid(receiverIdRef.current)) {
      toast.error("Selecciona un destinatario válido.");
      return;
    }

    if (!conversationIdRef.current) {
      toast.error("No se pudo abrir la conversación. Intenta de nuevo.");
      return;
    }

    if (!newMessage.trim()) {
      return;
    }

    const payload = {
      conversation_id: conversationIdRef.current,
      receiver_id: receiverIdRef.current,
      content: newMessage,
    };

    // Enviar a través de websockets
    socket.send(JSON.stringify(payload));
    
    // Optimistic Update
    const optimisticMessage: Message = {
      id: Math.random().toString(),
      conversation_id: conversationIdRef.current,
      sender_id: meId || "me",
      receiver_id: receiverIdRef.current,
      content: newMessage,
      timestamp: new Date().toISOString(),
      is_read: false,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    void loadConversations();

    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 100);
  };

  const activeConversation = useMemo(() => {
    return conversations.find((conversation) => conversation.other_participant_id === receiverId) || null;
  }, [conversations, receiverId]);

  const resolvedReceiverName = receiverProfile?.display_name || activeConversation?.partnerName || (receiverId ? `Chat ${receiverId.substring(0, 8)}...` : "Selecciona un chat");
  const resolvedReceiverAvatar = receiverProfile?.avatar_url || activeConversation?.partnerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${receiverId || "empty"}`;

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar de Chat - conversaciones persistidas */}
      <Card className="h-full w-full shrink-0 flex flex-col rounded-2xl border border-white/8 bg-white/5 md:w-80">
        <CardHeader className="border-b border-white/5 bg-transparent py-4">
          <CardTitle className="text-lg text-white">Chat</CardTitle>
          <CardDescription>
            {isConnected ? <span className="text-green-500 font-medium">● Conectado</span> : <span className="text-red-500">● Desconectado</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto">
          <div className="p-3 text-sm space-y-3">
            <div className="space-y-2">
              <Label htmlFor="receiver">ID Destinatario (Manual)</Label>
              <Input 
                id="receiver" 
                placeholder="UUID del usuario..." 
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
              />
              <p className="text-xs text-white/40">
                Los mensajes y conversaciones quedan guardados para cada cuenta.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                <IconComment className="h-3.5 w-3.5" />
                Conversaciones
              </div>
              <div className="space-y-2">
                {conversations.length === 0 ? (
                  <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-white/40">
                    Aquí aparecerán tus chats guardados.
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => void openConversation(conversation.other_participant_id || conversation.participant_ids.find((participantId) => participantId !== meId) || "")}
                      className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors ${conversation.other_participant_id === receiverId ? "border-primary/30 bg-primary/15" : "border-white/5 bg-white/5 hover:bg-white/8"}`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.partnerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.other_participant_id || conversation.id}`} />
                        <AvatarFallback>{conversation.partnerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-white">{conversation.partnerName}</div>
                        <div className="truncate text-xs text-white/40">{conversation.last_message || "Sin mensajes todavía"}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo list of recent conversations */}
      <div className="md:hidden" />

      {/* Ventana de Mensajes */}
      <Card className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/5">
        <CardHeader className="flex shrink-0 flex-row items-center gap-3 border-b border-white/5 bg-transparent py-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={resolvedReceiverAvatar} />
            <AvatarFallback>{resolvedReceiverName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base text-white">{receiverId ? `Conversación con ${resolvedReceiverName}` : "Selecciona un chat"}</CardTitle>
              {receiverId && <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />}
            </div>
            <CardDescription>
              {conversationId ? "Conversación lista para enviar" : "Ingresa un destinatario para abrir la conversación"}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="relative flex-1 overflow-hidden bg-transparent p-0">
          <ScrollArea className="h-full w-full p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center pt-32 text-white/40">
                <IconMessages className="mb-3 h-12 w-12 text-white/20" />
                <p>No hay mensajes todavía.</p>
                <p className="text-sm">Escribe abajo para iniciar la conversación.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 py-2">
                {messages.map((msg, idx) => {
                  const isMe = msg.sender_id === meId;
                  return (
                    <div key={`${msg.id}-${idx}`} className={`flex flex-col max-w-[75%] ${isMe ? "self-end" : "self-start"}`}>
                      <div className={`rounded-2xl p-3 ${isMe ? "ml-auto rounded-br-sm bg-primary text-white" : "rounded-bl-sm border border-white/5 bg-white/8 text-white/80"}`}>
                        <div className={isMe ? "text-white" : "text-white/80"}>{msg.content}</div>
                      </div>
                      <span className={`mt-1 text-[10px] text-white/40 ${isMe ? "text-right" : "text-left"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>

        <div className="relative shrink-0 border-t border-white/5 p-4 pl-16 transition-all md:pl-4">
          <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
            {!isConnected && <AlertCircle className="text-destructive w-5 h-5 absolute left-6 md:-left-3 shrink-0" />}
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={receiverId ? "Escribe un mensaje..." : "Ingresa el ID del destinatario primero..."}
              className="flex-1 border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-primary/40"
            />
            <Button type="submit" size="icon" disabled={!isConnected || !newMessage.trim() || !receiverId.trim() || !conversationId}>
              <IconShare className="w-4 h-4" />
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
