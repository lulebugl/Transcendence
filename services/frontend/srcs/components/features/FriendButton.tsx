import { Button } from "@/components/ui";
import {
  useFriendshipStatus,
  useAddFriend,
  useRemoveFriend,
  useAcceptFriend,
  useFriendsList,
  usePendingFriends,
} from "@/routes/profiles/hooks/useFriends";
import { UserPlus, UserMinus, UserCheck, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FriendshipButtonProps {
  playerId: number;
  playerName: string; // For toast messages
  className?: string;
}

export const FriendButton = ({
  playerId,
  playerName,
  className,
}: FriendshipButtonProps) => {
  const { status, isLoading: statusLoading, refetch } = useFriendshipStatus(playerId);

  const { mutate: addFriend, isLoading: isAdding } = useAddFriend({
    onSuccess: () => { refetch(); },
    onError: (error) => toast.error(error.message || "Failed to send request"),
  });

  const { mutate: removeFriend, isLoading: isRemoving } = useRemoveFriend({
    onSuccess: () => { refetch(); },
    onError: (error) => toast.error(error.message || "Failed to remove friend"),
  });

  const { mutate: acceptFriend, isLoading: isAccepting } = useAcceptFriend({
    onSuccess: () => { refetch(); },
    onError: (error) =>
      toast.error(error.message || "Failed to accept request"),
  });

  const isActionLoading = isAdding || isRemoving || isAccepting;

  if (statusLoading) {
    return (
      <Button variant="cyber" disabled className={className}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-xs uppercase tracking-widest">Loading...</span>
      </Button>
    );
  }

  if (status === "friend") {
    return (
      <Button
        variant="cyber"
		className={cn(className, "bg-black/50 text-white hover:bg-black/60 hover:shadow-none before:bg-transparent hover:before:bg-transparent")}
        onClick={() => removeFriend(playerId)}
        disabled={isActionLoading}
        aria-label={`Remove ${playerName} from friends`}
      >
        {isRemoving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <UserMinus className="w-4 h-4" />
        )}
        <span className="text-xs uppercase tracking-widest">Remove Friend</span>
      </Button>
    );
  }

  // They sent us a request → show accept button
  if (status === "invitation-received") {
    return (
      <div className="flex gap-2">
        <Button
          variant="cyber"
          className={className}
          onClick={() => acceptFriend(playerId)}
          disabled={isActionLoading}
          aria-label={`Accept friend request from ${playerName}`}
        >
          {isAccepting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserCheck className="w-4 h-4" />
          )}
          <span className="text-xs uppercase tracking-widest">Accept</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => removeFriend(playerId)}
          disabled={isActionLoading}
          aria-label={`Decline friend request from ${playerName}`}
        >
          <span className="text-xs uppercase tracking-widest">Decline</span>
        </Button>
      </div>
    );
  }

  if (status === "invitation-received") {
    return (
      <Button
        variant="cyber"
        className={className}
        // onClick={() => acceptFriend(playerId)}
        disabled={isActionLoading}
        aria-label={`Accept friend request from ${playerName}`}
      >
        <UserCheck className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest">Accept</span>
      </Button>
    );
  }

  if (status === "invitation-sent") {
    return (
      <Button
        variant="cyber"
        className={cn(className, "bg-muted text-muted-foreground brightness-125 font-medium")}
        disabled
        aria-label="Friend request pending"
      >
        <Clock className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest">Invitation Sent</span>
      </Button>
    );
  }

  // No relationship → show add button
  return (
    <Button
      variant="cyber"
      className={className}
      onClick={() => addFriend(playerId)}
      disabled={isActionLoading}
      aria-label={`Send friend request to ${playerName}`}
    >
      {isAdding ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <UserPlus className="w-4 h-4" />
      )}
      <span className="text-xs uppercase tracking-widest">Add Friend</span>
    </Button>
  );
}
