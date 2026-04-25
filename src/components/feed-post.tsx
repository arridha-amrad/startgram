import {
  Bookmark,
  BookmarkIcon,
  Heart,
  MessageCircle,
  Send,
  Smile,
  User,
} from "lucide-react";
import FeedPostOptions from "./feed-post-options";
import { HeartFilledIcon, HeartIcon } from "./icons/heart-icon";
import { CommentIcon } from "./icons/comment-icon";
import { SendIcon } from "./icons/send-icon";
import { RepostIcon } from "./icons/repost-icon";
import { AvatarGroup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TFeedPost } from "#/server-fn/fetch-feed-posts";
import Avatar from "./avatar";
import { formatDistanceToNowStrict } from "date-fns";
import EmblaProvider from "./embla-provider";
import { cn } from "#/lib/utils";
import { memo, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const AvatarHeader = memo(({ images }: { images: string[] }) => {
  return (
    <AvatarGroup>
      {images.map((url) => (
        <Avatar key={url} src={url} />
      ))}
    </AvatarGroup>
  );
});

AvatarHeader.displayName = "AvatarHeader";

export default function FeedPost({ feedPost }: { feedPost: TFeedPost }) {
  const [openTag, setOpenTag] = useState(false);

  const { allAvatars, authorUsername, collaboratorUsernames, location, mediaUrls } = useMemo(() => {
    const ownerAvatar = feedPost.user?.image ?? "/default.jpg";
    const collaboratorAvatars = feedPost.collaborators.map(
      (c) => c.user?.image ?? "/default.jpg",
    );

    return {
      allAvatars: [...collaboratorAvatars, ownerAvatar],
      authorUsername: feedPost.user?.username,
      collaboratorUsernames: feedPost.collaborators.map((c) => c.user?.username),
      location: feedPost.location,
      mediaUrls: feedPost.media.map((m) => m.url),
    };
  }, [feedPost]);

  const timeAgo = useMemo(() => {
    return formatDistanceToNowStrict(new Date(feedPost.createdAt), {
      addSuffix: true,
    });
  }, [feedPost.createdAt]);

  return (
    <Card className="mx-auto max-w-full border-none shadow-none md:max-w-117.5 md:border">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <AvatarHeader images={allAvatars} />
          <div className="flex flex-col gap-1">
            <div>
              <span className="cursor-pointer text-sm font-semibold hover:underline">
                {authorUsername}
              </span>
              {collaboratorUsernames.length > 0 && <span> and </span>}
              {collaboratorUsernames.length > 1 ? (
                <span className="cursor-pointer text-sm font-semibold">
                  {collaboratorUsernames.length} others
                </span>
              ) : (
                <span className="cursor-pointer text-sm font-semibold">
                  {collaboratorUsernames[0]}
                </span>
              )}
            </div>
            <span className="text-xs leading-none text-muted-foreground">
              {location}
            </span>
          </div>
        </div>
        <FeedPostOptions />
      </CardHeader>

      {/* Post Image */}
      <CardContent className="overflow-hidden p-0">
        <EmblaProvider
          aspectRatio={feedPost.aspectRatio}
          url={mediaUrls}
        >
          <div className="-ml-4 flex touch-pan-y touch-pinch-zoom">
            {feedPost.media.map((media) => (
              <div
                className={cn(
                  "w-full overflow-hidden",
                  `aspect-[${feedPost.aspectRatio}]`,
                )}
                style={{
                  aspectRatio: feedPost.aspectRatio,
                  transform: "translate3d(0, 0, 0)",
                  flex: "0 0 100%",
                  minWidth: 0,
                  paddingLeft: "1rem",
                }}
                ref={null}
                key={media.id}
              >
                <img
                  src={media.url}
                  alt="post content"
                  className="h-full w-full object-cover"
                />
                <AnimatePresence>
                  {openTag &&
                    media.taggedUsers.map((t) => (
                      <Tags
                        key={t.id}
                        coordinate={{ x: t.coordinateX, y: t.coordinateY }}
                        taggedUser={{ username: t.user?.username ?? "" }}
                      />
                    ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-4">
            <Button
              onClick={() => setOpenTag((val) => !val)}
              className="rounded-full"
              variant="secondary"
              size="icon-xs"
            >
              <User />
            </Button>
          </div>
        </EmblaProvider>
      </CardContent>

      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2">
              <HeartFilledIcon className="fill-rose-500 hover:scale-110" />
              <span className="text-sm font-medium">1.3k</span>
            </button>
            <button className="flex items-center gap-2">
              <CommentIcon />
              <span className="text-sm font-medium">124</span>
            </button>
            <button className="flex items-center gap-2">
              <RepostIcon />
              <span className="text-sm font-medium">50</span>
            </button>
            <button className="flex items-center gap-2">
              <BookmarkIcon />
              <span className="text-sm font-medium">32</span>
            </button>
          </div>
          <button className="flex items-center gap-2">
            <SendIcon />
          </button>
        </div>

        {/* Caption & Comments */}
        <div className="space-y-1.5">
          <p className="text-sm">
            <span className="mr-2 font-bold">{authorUsername}</span>
            <span>{feedPost.caption}</span>
          </p>
          <p className="text-[10px] font-medium text-muted-foreground uppercase">
            {timeAgo}
          </p>
        </div>
      </CardContent>

      {/* Footer - Comment Input */}
      <CardFooter className="gap-4">
        <Smile className="h-6 w-6 cursor-pointer text-muted-foreground" />
        <Input
          placeholder="Add a comment..."
          className="border-none bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
        />
        <Button size={"sm"}>Post</Button>
      </CardFooter>
    </Card>
  );
}

const Tags = memo(({
  coordinate,
  taggedUser,
}: {
  coordinate: { x: number; y: number };
  taggedUser: { username: string };
}) => {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0, y: 5 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.6, opacity: 0, y: 5 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className={cn(
        "pointer-events-none absolute z-50 flex flex-col select-none",
      )}
      style={{
        top: `${coordinate.y}%`,
        left: `${coordinate.x}%`,
        originY: 0,
      }}
    >
      <div
        className={cn(
          "tag-box pointer-events-auto relative top-[7px] flex flex-col rounded-lg bg-background shadow-2xl backdrop-blur-md transition-transform duration-200 ease-out",
          coordinate.x < 15
            ? "tag-box-left translate-x-[-15%] items-start"
            : coordinate.x > 85
              ? "tag-box-right translate-x-[-85%] items-end"
              : "tag-box-center -translate-x-1/2 items-center",
        )}
      >
        <div className="w-max max-w-32 py-2 px-2 text-xs text-foreground">
          <span className="line-clamp-1">{taggedUser.username}</span>
        </div>
      </div>
    </motion.div>
  );
});

Tags.displayName = "Tags";
