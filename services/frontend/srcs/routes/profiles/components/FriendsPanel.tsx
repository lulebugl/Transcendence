import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Check, Loader2, Users, X, Clock } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import {
  useAcceptFriend,
  useFriendsList,
  usePendingFriends,
  useRemoveFriend,
} from "../hooks/useFriends";
import { getOnlineStatus } from "../hooks/useProfileData";
import { Friends, PendingFriendship } from "@/api/friends";
import { cn } from "@/lib/utils";

type ViewMode = "friends" | "requests";

// need a major refactor 
// need a major refactor 
// need a major refactor 
// need a major refactor 
export const FriendsPanel = ({ isOwnProfile }: { isOwnProfile: boolean }) => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("friends");
  
  const {
    data: friends,
    isLoading: isFriendsLoading,
    refetch: refetchFriends,
  } = useFriendsList();

  const {
    data: pendingRequests,
    isLoading: isPendingLoading,
    refetch: refetchPending,
  } = usePendingFriends();

  console.log("pendingRequests", pendingRequests);
  const { mutate: acceptFriend, isLoading: isAccepting } = useAcceptFriend({
    onSuccess: () => {
      toast.success("Friend request accepted");
      refetchPending();
      refetchFriends();
    },
    onError: (error) =>
      toast.error(error.message || "Failed to accept friend request"),
  });

  const { mutate: removeFriend, isLoading: isRemoving } = useRemoveFriend({
    onSuccess: () => {
      toast.success("List updated");
      refetchPending();
      refetchFriends();
    },
    onError: (error) => toast.error(error.message || "Failed to update list"),
  });

  const isLoading = isFriendsLoading || isPendingLoading;

  // Filter Requests
  const incomingRequests = useMemo(
    () =>
      (pendingRequests ?? []).filter(
        (request) => user && request.receiverId === user.id
      ),
    [pendingRequests, user]
  );

  const sentRequests = useMemo(
    () =>
      (pendingRequests ?? []).filter(
        (request) => user && request.requesterId === user.id
      ),
    [pendingRequests, user]
  );

  const totalPending = incomingRequests.length + sentRequests.length;

  // Sort friends: online first
  const sortedFriends = useMemo(() => {
    if (!friends) return [];
    return [...friends].sort((a, b) => {
      const aOnline = getOnlineStatus(a.last_call) === "online";
      const bOnline = getOnlineStatus(b.last_call) === "online";
      if (aOnline && !bOnline) return -1;
      if (!aOnline && bOnline) return 1;
      return 0;
    });
  }, [friends]);

  const onlineCount = useMemo(
    () =>
      sortedFriends.filter((f) => getOnlineStatus(f.last_call) === "online")
        .length,
    [sortedFriends]
  );

  if (!user || !isOwnProfile) return null;

  return (
    <section className="space-y-4 h-full flex flex-col">
      <SectionHeader
        title="Social"
        rightType="info"
        info={
          viewMode === "friends"
            ? `${onlineCount} Online`
            : `${totalPending} Pending`
        }
      />

      <div className="glass-panel rounded-xl flex-1 flex flex-col min-h-[420px] overflow-hidden">
        {/* Panel Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-white/2">
          <TabButton
            active={viewMode === "friends"}
            onClick={() => setViewMode("friends")}
          >
            Friends
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/5 text-[9px] text-muted-foreground">
              {friends?.length || 0}
            </span>
          </TabButton>
          <TabButton
            active={viewMode === "requests"}
            onClick={() => setViewMode("requests")}
          >
            Requests
            {totalPending > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[9px]">
                {totalPending}
              </span>
            )}
          </TabButton>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            <>
              {viewMode === "friends" ? (
                <FriendsList list={sortedFriends} />
              ) : (
                <RequestsList
                  incoming={incomingRequests}
                  sent={sentRequests}
                  userId={user.id}
                  onAccept={(id) => acceptFriend(id)}
                  onDecline={(id) => removeFriend(id)}
                  isProcessing={isAccepting || isRemoving}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// --- Sub Components ---

const TabButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 flex items-center justify-center py-2 text-xs font-medium tracking-wide rounded-lg transition-all",
      active
        ? "bg-white/10 text-white shadow-inner"
        : "text-muted-foreground hover:bg-white/5 hover:text-white/80"
    )}
  >
    {children}
  </button>
);

const FriendsList = ({ list }: { list: Friends[] }) => {
  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-3">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
          <Users className="w-5 h-5 opacity-50" />
        </div>
        <p className="text-xs">No friends added yet</p>
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {list.map((friend, i) => (
        <li
          key={friend.id}
          className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all animate-fade-in-up"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <Link
            to={`/profile/${friend.username}`}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <div className="relative">
              <UserAvatar
                username={friend.username}
                avatarUrl={friend.avatar_url ?? undefined}
                className="w-9 h-9 border border-white/5"
              />
              <span
                className={cn(
                  "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background",
                  getOnlineStatus(friend.last_call) === "online"
                    ? "bg-emerald-500"
                    : "bg-gray-500"
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground group-hover:text-primary transition-colors">
                {friend.username}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {getOnlineStatus(friend.last_call) === "online"
                  ? "Online"
                  : "Offline"}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const RequestsList = ({
  incoming,
  sent,
  userId,
  onAccept,
  onDecline,
  isProcessing,
}: {
  incoming: PendingFriendship[];
  sent: PendingFriendship[];
  userId: number;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
  isProcessing: boolean;
}) => {
  if (incoming.length === 0 && sent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-3">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
          <Check className="w-5 h-5 opacity-50" />
        </div>
        <p className="text-xs">No pending requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {incoming.length > 0 && (
        <div className="space-y-1">
          <h3 className="px-2 text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold mb-2">
            Incoming
          </h3>
          {incoming.map((req, i) => (
            <div
              key={req.requesterId}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            >
              <UserAvatar
                username={`User #${req.requesterId}`}
                className="w-9 h-9"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  User #{req.requesterId}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Wants to be friends
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                  onClick={() => onAccept(req.requesterId)}
                  disabled={isProcessing}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                  onClick={() => onDecline(req.requesterId)}
                  disabled={isProcessing}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {sent.length > 0 && (
        <div className="space-y-1">
          <h3 className="px-2 text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold mb-2 mt-4">
            Sent
          </h3>
          {sent.map((req, i) => (
            <div
              key={req.receiverId}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all opacity-70 hover:opacity-100"
            >
              <UserAvatar
                username={`User #${req.receiverId}`}
                className="w-8 h-8"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  User #{req.receiverId}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Pending</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[10px] uppercase text-white tracking-wider hover:text-red-400"
                onClick={() => onDecline(req.receiverId)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
