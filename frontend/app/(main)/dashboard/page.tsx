"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { IconHeart, IconComment, IconShare, IconMap, IconSearch } from "@/components/icons/TmIcons";
import { toast } from "sonner";

import { fetchApi } from "@/lib/api";
import { FEATURED_TOPICS, SAMPLE_POSTS } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchFeedPosts(limit = 20, offset = 0): Promise<PostsResponse> {
  const response = await fetch(`/api/feed/posts?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error("No se pudo cargar el feed");
  }
  return response.json();
}

async function createFeedPost(content: string) {
  const response = await fetch("/api/feed/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "No se pudo publicar");
  }

  return response.json();
}

interface Post {
  id: string;
  author_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  author_name?: string;
  author_avatar?: string;
}

interface PostsResponse {
  posts: Post[];
  total: number;
}

interface Tutor {
  id: string;
  user_id: string;
  display_name?: string;
  full_name?: string;
  specialties?: string[];
  hourly_rate?: number;
  avatar_url?: string;
  is_available?: boolean;
}

const starterPosts: Post[] = SAMPLE_POSTS;

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: postsData, isLoading: postsLoading } = useQuery<PostsResponse>({
    queryKey: ["feed-posts"],
    queryFn: async () => {
      try {
        return await fetchFeedPosts(20, 0);
      } catch {
        return { posts: [], total: 0 };
      }
    },
  });

  const { data: tutorsData } = useQuery<{ tutors: Tutor[] }>({
    queryKey: ["tutors-sidebar"],
    queryFn: async () => {
      try {
        const res = await fetchApi<Tutor[] | { tutors?: Tutor[] }>("/api/tutors/?limit=5");
        const tutors = Array.isArray(res) ? res : res.tutors ?? [];

        // Enrich tutors with display_name and avatar from users service to avoid generic fallbacks
        const enriched = await Promise.all(
          tutors.map(async (t) => {
            try {
              const profile = await fetchApi<{ display_name?: string; avatar_url?: string }>(`/api/users/profiles/${t.user_id}`);
              return {
                ...t,
                display_name: profile?.display_name || t.display_name,
                avatar_url: profile?.avatar_url || t.avatar_url,
              } as Tutor;
            } catch {
              return t;
            }
          })
        );

        return { tutors: enriched };
      } catch {
        return { tutors: [] };
      }
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (content: string) => createFeedPost(content),
    onSuccess: () => {
      setNewPost("");
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      toast.success("Post publicado");
    },
    onError: () => toast.error("Error al publicar"),
  });

  const handlePost = () => {
    if (!newPost.trim()) {
      return;
    }

    createPostMutation.mutate(newPost.trim());
  };

  const posts = postsData?.posts ?? [];
  const tutors = tutorsData?.tutors ?? [];
  const visiblePosts = posts.length > 0 ? posts : starterPosts;
  const isFallbackFeed = posts.length === 0;

  return (
    <div className="mx-auto flex max-w-7xl gap-6">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/30 via-primary/10 to-violet-900/20 p-8 text-white backdrop-blur-sm">
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-white">Inicio</h1>
              <p className="text-white/70">Publicaciones recientes de estudiantes y tutores.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {FEATURED_TOPICS.map((topic, index) => (
                <Link
                  key={topic}
                  href={`/explore?topic=${encodeURIComponent(topic)}`}
                  className={`rounded-full border px-3 py-1 text-sm transition-all ${index === 0 ? "border-primary/40 bg-primary/30 text-white" : "border-white/10 bg-white/10 text-white/80 hover:border-primary/30 hover:bg-primary/20 hover:text-white"}`}
                >
                  {topic}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm max-w-2xl">
              <IconSearch className="h-4 w-4 shrink-0 text-white/50" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Busca tutores por materia o nombre..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
              />
              <Link
                href={`/explore${searchQuery ? `?topic=${encodeURIComponent(searchQuery)}` : ""}`}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                aria-label="Buscar tutor"
              >
                Buscar
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/5 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback>Tú</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(event) => setNewPost(event.target.value)}
                placeholder="¿Qué quieres compartir hoy? Comparte tips, busca tutor, o comparte tu progreso..."
                className="min-h-20 w-full resize-none border-0 bg-transparent text-sm text-white outline-none placeholder:text-white/30 focus:ring-0"
                maxLength={500}
              />
              <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2">
                <span className="text-xs text-white/40">{newPost.length}/500</span>
                <Button
                  size="sm"
                  onClick={handlePost}
                  disabled={!newPost.trim() || createPostMutation.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {createPostMutation.isPending ? "Publicando..." : "Publicar"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {postsLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-xl border border-white/8 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))
        ) : (
          <div className="space-y-3">
            {isFallbackFeed && (
              <div className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/50 shadow-sm">
                Mostrando publicaciones de ejemplo hasta que haya actividad real en el feed.
              </div>
            )}
            {visiblePosts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>

      <aside className="hidden w-80 shrink-0 space-y-4 xl:flex xl:flex-col">
        <div className="rounded-xl border border-white/8 bg-white/5 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/80">Tutores destacados</h3>
            <Link href="/explore" className="text-xs text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {tutors.slice(0, 5).map((tutor) => (
              <div key={tutor.user_id} className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={tutor.avatar_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.user_id}`}
                    />
                    <AvatarFallback>
                      {(tutor.display_name ?? tutor.full_name ?? "T").substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {tutor.is_available && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white/80">
                    {tutor.display_name ?? tutor.full_name ?? "Tutor"}
                  </p>
                  <p className="truncate text-xs text-white/40">
                    {tutor.specialties?.slice(0, 2).join(", ") ?? "General"}
                  </p>
                </div>
                <Link
                  href={`/messages?userId=${tutor.user_id}`}
                  className="inline-flex h-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Contactar
                </Link>
              </div>
            ))}
          </div>
        </div>

        <Link href="/explore">
          <div className="cursor-pointer rounded-xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <IconMap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Explorar en el mapa</p>
                <p className="text-xs text-white/40">Tutores cerca de ti</p>
              </div>
            </div>
          </div>
        </Link>
      </aside>
    </div>
  );
}

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <article className="rounded-xl border border-white/8 bg-white/5 p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage
            src={post.author_avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author_id}`}
          />
          <AvatarFallback>{(post.author_name ?? "U").substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-white/80">{post.author_name ?? "Usuario"}</span>
            <span className="shrink-0 text-xs text-white/40">· {formatDate(post.created_at)}</span>
          </div>

          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-white/70">{post.content}</p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt="Post image"
              className="mt-3 max-h-80 w-full rounded-lg border border-white/8 object-cover"
            />
          )}

          <div className="mt-3 flex items-center gap-4 text-muted-foreground">
            <button
              onClick={() => {
                setLiked((previous) => {
                  setLikeCount((count) => count + (previous ? -1 : 1));
                  return !previous;
                });
              }}
              className={`flex items-center gap-1.5 text-xs transition-colors hover:text-red-500 ${liked ? "text-red-500" : ""}`}
            >
              <IconHeart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              {likeCount}
            </button>
            <button
              onClick={() => toast.info("Comentarios próximamente")}
              className="flex items-center gap-1.5 text-xs transition-colors hover:text-primary"
            >
              <IconComment className="h-4 w-4" />
              Comentar
            </button>
            <button
              onClick={() => toast.info("Compartir próximamente")}
              className="ml-auto flex items-center gap-1.5 text-xs transition-colors hover:text-primary"
            >
              <IconShare className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
