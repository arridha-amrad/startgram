import { ChevronDown } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Switch } from "@/components/ui/switch"

export default function AdvanceSettings() {
  return (
    <Collapsible className="pr-2">
      <CollapsibleTrigger className="group flex w-full items-center justify-between py-2 text-sm">
        <span className="font-light transition-all group-data-[state=open]:font-medium">
          Advance Settings
        </span>
        <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-6 pt-4 pb-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="hide-likes"
              className="text-sm leading-snug font-light"
            >
              Hide like and view counts on this post
            </label>
            <Switch id="hide-likes" />
          </div>
          <p className="text-xs leading-normal text-muted-foreground">
            Only you will see the total number of likes and views on this post.
            You can change this later by going to the ··· menu at the top of the
            post. To hide like counts on other people&apos;s posts, go to your
            account settings.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="turn-off-commenting"
              className="text-sm leading-snug font-light"
            >
              Turn off commenting
            </label>
            <Switch id="turn-off-commenting" />
          </div>
          <p className="text-xs leading-normal text-muted-foreground">
            You can change this later by going to the ··· menu at the top of
            your post.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="share-threads"
              className="text-sm leading-snug font-light"
            >
              Automatically share to Threads
            </label>
            <Switch id="share-threads" />
          </div>
          <p className="text-xs leading-normal text-muted-foreground">
            Always share your posts to Threads. You can change your audience on
            Threads settings.{" "}
            <span className="cursor-pointer text-blue-500">Learn more</span>
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
