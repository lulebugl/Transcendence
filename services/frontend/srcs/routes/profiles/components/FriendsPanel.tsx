import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Check, Loader2, Users, X, Clock } from "lucide-react";
import { SectionHeader, TabNavigation, Button } from "@/components/ui";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import {
  useAcceptFriend,
  useFriendsData,
  useRemoveFriend,
} from "@/hooks/useFriends";
import { getOnlineStatus } from "@/hooks/useProfileData";
import { Friends, PendingFriendship } from "@/api/friends";
import { cn } from "@/lib/utils";

type ViewMode = "friends" | "requests";

export const FriendsPanel = ({ isOwnProfile }: { isOwnProfile: boolean }) => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("friends");

  const {
    friends,
    incomingRequests,
    sentRequests,
    totalPending,
    onlineCount,
    isLoading,
    refetchAll,
  } = useFriendsData();

  const { mutate: acceptFriend, isLoading: isAccepting } = useAcceptFriend({
    onSuccess: () => {
      toast.success("Friend request accepted");
      refetchAll();
    },
    onError: () => {
      refetchAll();
      toast.error("Failed to accept friend request");
    },
  });

  const { mutate: removeFriend, isLoading: isRemoving } = useRemoveFriend({
    onSuccess: () => {
      toast.success("Request cancelled");
      refetchAll();
    },
    onError: () => {
      refetchAll();
      toast.error("Failed to remove friend");
    },
  });

  if (!user || !isOwnProfile) return null;

  const isProcessing = isAccepting || isRemoving;
  const headerInfo =
    viewMode === "friends"
      ? `${onlineCount} Online`
      : `${totalPending} Pending`;

  return (
    <section className="space-y-4 h-full flex flex-col">
      <SectionHeader title="Social" rightType="info" info={headerInfo} />

      <div className="glass-panel rounded-xl flex-1 flex flex-col min-h-[420px] overflow-hidden">
        <TabNavigation
          tabs={["friends", "requests"]}
          activeTab={viewMode}
          onTabChange={(tab) => {
            refetchAll();
            setViewMode(tab as ViewMode);
          }}
          badges={{ friends: friends.length, requests: totalPending }}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {isLoading ? (
            <LoadingState />
          ) : viewMode === "friends" ? (
            <FriendsList friends={friends} />
          ) : (
            <RequestsPanel
              incomingRequests={incomingRequests}
              sentRequests={sentRequests}
              onAccept={acceptFriend}
              onDecline={removeFriend}
              isProcessing={isProcessing}
            />
          )}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// Friends List
// ============================================================================
const FriendsList = ({ friends }: { friends: Friends[] }) => {
  if (friends.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-5 h-5 opacity-50" />}
        message="No friends added yet"
      />
    );
  }

  return (
    <ul className="space-y-1">
      {friends.map((friend) => (
        <FriendListItem key={friend.id} friend={friend} />
      ))}
    </ul>
  );
};

const FriendListItem = ({ friend }: { friend: Friends }) => {
  const status = getOnlineStatus(friend.last_call);

  return (
    <li className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all animate-fade-in-up">
      <Link
        to={`/profile/${friend.username}`}
        className="flex items-center gap-3 flex-1 min-w-0"
        aria-label={`View ${friend.username}'s profile`}
      >
        <div className="relative">
          <UserAvatar
            username={friend.username}
            avatarUrl={friend.avatar_url ?? undefined}
            status={status}
            className="w-9 h-9 border border-white/5"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate text-foreground group-hover:text-primary transition-colors">
            {friend.username}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {status}
          </p>
        </div>
      </Link>
    </li>
  );
};

// ============================================================================
// Requests Panel
// ============================================================================
interface RequestsPanelProps {
  incomingRequests: PendingFriendship[];
  sentRequests: PendingFriendship[];
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
  isProcessing: boolean;
}

const RequestsPanel = ({
  incomingRequests,
  sentRequests,
  onAccept,
  onDecline,
  isProcessing,
}: RequestsPanelProps) => {
  if (incomingRequests.length === 0 && sentRequests.length === 0) {
    return (
      <EmptyState
        icon={<Check className="w-5 h-5 opacity-50" />}
        message="No pending requests"
      />
    );
  }

  return (
    <div className="space-y-4">
      {incomingRequests.length > 0 && (
        <RequestSection title="Incoming">
          {incomingRequests.map((request) => (
            <IncomingRequestItem
              key={request.id}
              request={request}
              onAccept={() => onAccept(request.requesterId)}
              onDecline={() => onDecline(request.requesterId)}
              isProcessing={isProcessing}
            />
          ))}
        </RequestSection>
      )}

      {sentRequests.length > 0 && (
        <RequestSection title="Sent" className="mt-4">
          {sentRequests.map((request) => (
            <SentRequestItem
              key={request.id}
              request={request}
              onCancel={() => onDecline(request.receiverId)}
              isProcessing={isProcessing}
            />
          ))}
        </RequestSection>
      )}
    </div>
  );
};

interface RequestSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const RequestSection = ({
  title,
  children,
  className,
}: RequestSectionProps) => (
  <div className={cn("space-y-1", className)}>
    <h3 className="px-2 text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold mb-2">
      {title}
    </h3>
    {children}
  </div>
);

interface IncomingRequestItemProps {
  request: PendingFriendship;
  onAccept: () => void;
  onDecline: () => void;
  isProcessing: boolean;
}

const IncomingRequestItem = ({
  request,
  onAccept,
  onDecline,
  isProcessing,
}: IncomingRequestItemProps) => {
  const status = getOnlineStatus(request.last_call);

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
      <UserAvatar
        username={request.username}
        avatarUrl={request.avatar_url ?? undefined}
        status={status}
        className="w-9 h-9"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{request.username}</p>
        <p className="text-[10px] text-muted-foreground">
          Sent you an invitation
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="default"
          size="sm"
          className="bg-transparent text-white hover:bg-transparent hover:scale-110"
          onClick={onAccept}
          disabled={isProcessing}
          aria-label="Accept friend request"
        >
          <Check className="w-4 h-4 text-white" />
          accept
        </Button>
        <Button
          variant="default"
          size="sm"
          className="bg-transparent text-destructive hover:bg-transparent hover:scale-110"
          onClick={onDecline}
          disabled={isProcessing}
          aria-label="Decline friend request"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

interface SentRequestItemProps {
  request: PendingFriendship;
  onCancel: () => void;
  isProcessing: boolean;
}

const SentRequestItem = ({
  request,
  onCancel,
  isProcessing,
}: SentRequestItemProps) => {
  const status = getOnlineStatus(request.last_call);

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all opacity-70 hover:opacity-100">
      <UserAvatar
        username={request.username}
        avatarUrl={request.avatar_url ?? undefined}
        status={status}
        className="w-8 h-8"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{request.username}</p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Pending</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs text-white hover:text-black hover:bg-foreground"
        onClick={onCancel}
        disabled={isProcessing}
        aria-label="Cancel friend request"
      >
        cancel
      </Button>
    </div>
  );
};

// ============================================================================
// Loading & Empty States
// ============================================================================

const LoadingState = () => (
  <div className="flex items-center justify-center h-40 text-muted-foreground">
    <Loader2 className="w-5 h-5 animate-spin" />
  </div>
);

interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
}

const EmptyState = ({ icon, message }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-3">
    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
      {icon}
    </div>
    <p className="text-xs">{message}</p>
  </div>
);
