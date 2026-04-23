import {
  Bookmark,
  BookmarkIcon,
  Heart,
  MessageCircle,
  Send,
  Smile,
} from "lucide-react"
import FeedPostOptions from "./feed-post-options"
import { HeartFilledIcon, HeartIcon } from "./icons/heart-icon"
import { CommentIcon } from "./icons/comment-icon"
import { SendIcon } from "./icons/send-icon"
import { RepostIcon } from "./icons/repost-icon"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function PostItem() {
  return (
    <Card className="mx-auto max-w-full border-none shadow-none md:max-w-117.5 md:border">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="cursor-pointer text-sm font-semibold hover:underline">
              shadcn_design
            </span>
            <span className="text-xs leading-none text-muted-foreground">
              Original Audio
            </span>
          </div>
        </div>
        <FeedPostOptions />
      </CardHeader>

      {/* Post Image */}
      <CardContent className="overflow-hidden p-0">
        <div className="relative aspect-square bg-muted">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
            alt="Feed post"
            className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
          />
        </div>
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
            <span className="mr-2 font-bold">shadcn_design</span>
            Building beautiful interfaces has never been easier. The new update
            is live! 🚀
          </p>
          <p className="cursor-pointer py-1 text-sm text-muted-foreground">
            View all 42 comments
          </p>
          <p className="text-[10px] tracking-tighter text-muted-foreground uppercase">
            2 hours ago
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
  )
}
