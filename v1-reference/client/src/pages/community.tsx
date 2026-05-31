import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  ThumbsUp,
  Plus,
  ArrowLeft,
  Clock,
  Users,
  Pin,
  Trash2,
  Send,
  Heart,
  Moon,
  Wind,
  Activity,
  Stethoscope,
  Brain,
  Scale,
  Smile,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SelectCommunityPost, SelectCommunityReply } from "@shared/schema";

const CATEGORIES = [
  { id: "general", label: "General Discussion", icon: MessageSquare, description: "Open conversation about sleep health" },
  { id: "cpap", label: "CPAP & Devices", icon: Wind, description: "Tips, troubleshooting, and experiences with CPAP and oral appliances" },
  { id: "insomnia", label: "Insomnia Support", icon: Moon, description: "Strategies and support for insomnia challenges" },
  { id: "weight", label: "Weight & Sleep", icon: Scale, description: "Discussion about weight management and sleep apnea" },
  { id: "anatomy", label: "Airway & Anatomy", icon: Activity, description: "Questions about nasal, palate, and airway concerns" },
  { id: "treatment", label: "Treatment Journeys", icon: Stethoscope, description: "Share your treatment experiences and milestones" },
  { id: "mental-health", label: "Mental Health & Sleep", icon: Brain, description: "The connection between sleep and mental wellness" },
  { id: "wins", label: "Wins & Encouragement", icon: Smile, description: "Celebrate progress and encourage others" },
];

function timeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function CategoryList({
  selectedCategory,
  onSelect,
}: {
  selectedCategory: string | null;
  onSelect: (cat: string | null) => void;
}) {
  return (
    <div className="space-y-2">
      <Button
        variant={selectedCategory === null ? "default" : "ghost"}
        className="w-full justify-start gap-2"
        onClick={() => onSelect(null)}
        data-testid="button-category-all"
      >
        <Users className="w-4 h-4" />
        All Discussions
      </Button>
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => onSelect(cat.id)}
            data-testid={`button-category-${cat.id}`}
          >
            <Icon className="w-4 h-4" />
            {cat.label}
          </Button>
        );
      })}
    </div>
  );
}

function NewPostDialog({
  onPostCreated,
  defaultCategory,
}: {
  onPostCreated: () => void;
  defaultCategory?: string;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(defaultCategory || "general");
  const { user } = useAuth();
  const { toast } = useToast();

  const createPost = useMutation({
    mutationFn: async () => {
      const userName =
        user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.firstName || user?.email || "Anonymous";
      return apiRequest("POST", "/api/community/posts", {
        title,
        body,
        category,
        userName,
        userAvatar: user?.profileImageUrl || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      setTitle("");
      setBody("");
      setOpen(false);
      onPostCreated();
      toast({ title: "Post created", description: "Your post has been shared with the community." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create post. Please try again.", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid="button-new-post">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Start a Discussion</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="select-post-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-testid="input-post-title"
          />
          <Textarea
            placeholder="Share your thoughts, experiences, or questions..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            data-testid="input-post-body"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-post">
              Cancel
            </Button>
            <Button
              onClick={() => createPost.mutate()}
              disabled={!title.trim() || !body.trim() || createPost.isPending}
              data-testid="button-submit-post"
            >
              {createPost.isPending ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PostCard({
  post,
  userLikes,
  isAuthenticated,
  currentUserId,
  isAdmin,
  onClick,
}: {
  post: SelectCommunityPost;
  userLikes: string[];
  isAuthenticated: boolean;
  currentUserId?: string;
  isAdmin: boolean;
  onClick: () => void;
}) {
  const { toast } = useToast();
  const isLiked = userLikes.includes(post.id);
  const categoryInfo = CATEGORIES.find((c) => c.id === post.category);

  const toggleLike = useMutation({
    mutationFn: () => apiRequest("POST", "/api/community/like", { postId: post.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community/likes"] });
    },
  });

  const deletePost = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/community/posts/${post.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      toast({ title: "Post deleted" });
    },
  });

  return (
    <Card className="hover-elevate cursor-pointer" data-testid={`card-post-${post.id}`}>
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0 mt-0.5">
            <AvatarImage src={post.userAvatar || undefined} />
            <AvatarFallback>{getInitials(post.userName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0" onClick={onClick}>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {post.pinned && (
                <Pin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              )}
              <h3 className="font-semibold text-foreground truncate" data-testid={`text-post-title-${post.id}`}>
                {post.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-sm text-muted-foreground" data-testid={`text-post-author-${post.id}`}>
                {post.userName}
              </span>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-sm text-muted-foreground" data-testid={`text-post-time-${post.id}`}>
                {post.createdAt ? timeAgo(post.createdAt) : ""}
              </span>
              {categoryInfo && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <Badge variant="secondary" className="text-xs">
                    {categoryInfo.label}
                  </Badge>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-post-preview-${post.id}`}>
              {post.body}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 ml-13">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 ${isLiked ? "text-primary" : "text-muted-foreground"}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!isAuthenticated) {
                toast({ title: "Log in to like posts", description: "You need to be logged in to like posts." });
                return;
              }
              toggleLike.mutate();
            }}
            data-testid={`button-like-post-${post.id}`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-primary" : ""}`} />
            <span>{post.likesCount || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={onClick}
            data-testid={`button-replies-${post.id}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.repliesCount || 0}</span>
          </Button>
          {(currentUserId === post.userId || isAdmin) && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Are you sure you want to delete this post?")) {
                  deletePost.mutate();
                }
              }}
              data-testid={`button-delete-post-${post.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PostDetail({
  postId,
  onBack,
}: {
  postId: string;
  onBack: () => void;
}) {
  const [replyBody, setReplyBody] = useState("");
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: adminCheck } = useQuery<{ isAdmin: boolean } | null>({
    queryKey: ["/api/admin/check"],
    queryFn: async () => {
      const res = await fetch("/api/admin/check", { credentials: "include" });
      if (res.status === 401 || res.status === 403) return null;
      return res.json();
    },
    enabled: isAuthenticated,
    retry: false,
  });

  const { data, isLoading } = useQuery<{ post: SelectCommunityPost; replies: SelectCommunityReply[] }>({
    queryKey: ["/api/community/posts", postId],
  });

  const { data: userLikes } = useQuery<{ postIds: string[]; replyIds: string[] }>({
    queryKey: ["/api/community/likes"],
    enabled: isAuthenticated,
  });

  const toggleLike = useMutation({
    mutationFn: (payload: { postId?: string; replyId?: string }) =>
      apiRequest("POST", "/api/community/like", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["/api/community/likes"] });
    },
  });

  const createReply = useMutation({
    mutationFn: () => {
      const userName =
        user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.firstName || user?.email || "Anonymous";
      return apiRequest("POST", `/api/community/posts/${postId}/replies`, {
        body: replyBody,
        userName,
        userAvatar: user?.profileImageUrl || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      setReplyBody("");
      toast({ title: "Reply posted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to post reply.", variant: "destructive" });
    },
  });

  const deleteReply = useMutation({
    mutationFn: (replyId: string) => apiRequest("DELETE", `/api/community/replies/${replyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      toast({ title: "Reply deleted" });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-32 bg-muted rounded animate-pulse" />
        <div className="h-24 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!data) return null;

  const { post, replies } = data;
  const categoryInfo = CATEGORIES.find((c) => c.id === post.category);
  const isPostLiked = userLikes?.postIds?.includes(post.id) ?? false;

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="gap-2 -ml-2"
        onClick={onBack}
        data-testid="button-back-to-posts"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Discussions
      </Button>

      <Card data-testid="card-post-detail">
        <CardContent className="py-6">
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={post.userAvatar || undefined} />
              <AvatarFallback>{getInitials(post.userName)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-foreground mb-1" data-testid="text-post-detail-title">
                {post.title}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground" data-testid="text-post-detail-author">
                  {post.userName}
                </span>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.createdAt ? timeAgo(post.createdAt) : ""}
                </span>
                {categoryInfo && (
                  <>
                    <span className="text-muted-foreground/50">·</span>
                    <Badge variant="secondary">{categoryInfo.label}</Badge>
                  </>
                )}
              </div>
            </div>
          </div>
          <p className="text-foreground whitespace-pre-wrap leading-relaxed" data-testid="text-post-detail-body">
            {post.body}
          </p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 ${isPostLiked ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => {
                if (!isAuthenticated) {
                  toast({ title: "Log in to like posts" });
                  return;
                }
                toggleLike.mutate({ postId: post.id });
              }}
              data-testid="button-like-post-detail"
            >
              <ThumbsUp className={`w-4 h-4 ${isPostLiked ? "fill-primary" : ""}`} />
              <span>{post.likesCount || 0} Likes</span>
            </Button>
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground" data-testid="text-replies-heading">
          Replies ({replies.length})
        </h2>

        {replies.map((reply) => {
          const isReplyLiked = userLikes?.replyIds?.includes(reply.id) ?? false;
          const canDelete = user?.id === reply.userId || adminCheck?.isAdmin;
          return (
            <Card key={reply.id} data-testid={`card-reply-${reply.id}`}>
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarImage src={reply.userAvatar || undefined} />
                    <AvatarFallback>{getInitials(reply.userName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {reply.userName}
                      </span>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="text-xs text-muted-foreground">
                        {reply.createdAt ? timeAgo(reply.createdAt) : ""}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {reply.body}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-1 h-7 text-xs ${isReplyLiked ? "text-primary" : "text-muted-foreground"}`}
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast({ title: "Log in to like replies" });
                            return;
                          }
                          toggleLike.mutate({ replyId: reply.id });
                        }}
                        data-testid={`button-like-reply-${reply.id}`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isReplyLiked ? "fill-primary" : ""}`} />
                        <span>{reply.likesCount || 0}</span>
                      </Button>
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 h-7 text-xs text-muted-foreground"
                          onClick={() => {
                            if (confirm("Delete this reply?")) {
                              deleteReply.mutate(reply.id);
                            }
                          }}
                          data-testid={`button-delete-reply-${reply.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {replies.length === 0 && (
          <div className="text-center py-8 text-muted-foreground" data-testid="text-no-replies">
            No replies yet. Be the first to respond!
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <Card data-testid="card-reply-form">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={user?.profileImageUrl || undefined} />
                <AvatarFallback>
                  {user?.firstName ? getInitials(`${user.firstName} ${user.lastName || ""}`) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  rows={3}
                  data-testid="input-reply-body"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="gap-1.5"
                    disabled={!replyBody.trim() || createReply.isPending}
                    onClick={() => createReply.mutate()}
                    data-testid="button-submit-reply"
                  >
                    <Send className="w-4 h-4" />
                    {createReply.isPending ? "Posting..." : "Reply"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/30" data-testid="card-login-prompt-reply">
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground mb-3">Log in to join the conversation</p>
            <a href="/api/login">
              <Button data-testid="button-login-to-reply">Log In to Reply</Button>
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const { data: adminCheck } = useQuery<{ isAdmin: boolean } | null>({
    queryKey: ["/api/admin/check"],
    queryFn: async () => {
      const res = await fetch("/api/admin/check", { credentials: "include" });
      if (res.status === 401 || res.status === 403) return null;
      return res.json();
    },
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: posts, isLoading: postsLoading } = useQuery<SelectCommunityPost[]>({
    queryKey: ["/api/community/posts", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory
        ? `/api/community/posts?category=${selectedCategory}`
        : "/api/community/posts";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  const { data: userLikes } = useQuery<{ postIds: string[]; replyIds: string[] }>({
    queryKey: ["/api/community/likes"],
    enabled: isAuthenticated,
  });

  const activeCategoryInfo = selectedCategory
    ? CATEGORIES.find((c) => c.id === selectedCategory)
    : null;

  return (
    <Layout>
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="text-community-title">
                Community
              </h1>
              <p className="text-lg text-muted-foreground" data-testid="text-community-subtitle">
                Connect with others on their sleep health journey. Share experiences, ask questions, and support each other.
              </p>
            </div>

            <Card className="mb-6 bg-muted/30" data-testid="card-community-guidelines">
              <CardContent className="py-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Community Guidelines:</strong>{" "}
                  Be respectful and supportive. This is a space for sharing experiences and encouragement.
                  Remember that community posts are not medical advice — always consult your healthcare provider for personalized guidance.
                </p>
              </CardContent>
            </Card>

            {selectedPostId ? (
              <PostDetail
                postId={selectedPostId}
                onBack={() => setSelectedPostId(null)}
              />
            ) : (
              <div className="flex gap-6">
                <aside className="hidden lg:block w-64 flex-shrink-0">
                  <div className="sticky top-20">
                    <h2 className="text-sm font-semibold text-foreground mb-3 px-2">
                      Categories
                    </h2>
                    <CategoryList
                      selectedCategory={selectedCategory}
                      onSelect={(cat) => setSelectedCategory(cat)}
                    />
                  </div>
                </aside>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="lg:hidden"
                        onClick={() => setShowMobileCategories(!showMobileCategories)}
                        data-testid="button-toggle-categories"
                      >
                        Categories
                      </Button>
                      {activeCategoryInfo && (
                        <Badge variant="secondary" className="gap-1">
                          {activeCategoryInfo.label}
                          <button
                            className="ml-1 text-muted-foreground hover:text-foreground"
                            onClick={() => setSelectedCategory(null)}
                          >
                            ×
                          </button>
                        </Badge>
                      )}
                    </div>
                    {isAuthenticated ? (
                      <NewPostDialog
                        defaultCategory={selectedCategory || undefined}
                        onPostCreated={() => {}}
                      />
                    ) : (
                      <a href="/api/login">
                        <Button className="gap-2" data-testid="button-login-to-post">
                          Log In to Post
                        </Button>
                      </a>
                    )}
                  </div>

                  {showMobileCategories && (
                    <Card className="mb-4 lg:hidden">
                      <CardContent className="py-3">
                        <CategoryList
                          selectedCategory={selectedCategory}
                          onSelect={(cat) => {
                            setSelectedCategory(cat);
                            setShowMobileCategories(false);
                          }}
                        />
                      </CardContent>
                    </Card>
                  )}

                  {postsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-28 bg-muted rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : posts && posts.length > 0 ? (
                    <div className="space-y-3" data-testid="list-community-posts">
                      {posts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          userLikes={userLikes?.postIds || []}
                          isAuthenticated={isAuthenticated}
                          currentUserId={user?.id}
                          isAdmin={adminCheck?.isAdmin || false}
                          onClick={() => setSelectedPostId(post.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="bg-muted/30">
                      <CardContent className="py-12 text-center">
                        <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="text-no-posts-title">
                          {selectedCategory ? "No discussions in this category yet" : "No discussions yet"}
                        </h3>
                        <p className="text-muted-foreground mb-4" data-testid="text-no-posts-description">
                          Be the first to start a conversation!
                        </p>
                        {isAuthenticated ? (
                          <NewPostDialog
                            defaultCategory={selectedCategory || undefined}
                            onPostCreated={() => {}}
                          />
                        ) : (
                          <a href="/api/login">
                            <Button data-testid="button-login-empty-state">Log In to Start</Button>
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
