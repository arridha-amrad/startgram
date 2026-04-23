import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

type Props = {
  title: "Share Photos" | "Start Saving" | "Photos of you" | "Shared Reels"
}

const descriptions = {
  "Share Photos": "When you share photos, they will appear on your profile.",
  "Start Saving": "Save photos and videos to your collection.",
  "Shared Reels": "Save photos and videos to your collection.",
  "Photos of you": "When people tag you in photos, they'll appear here.",
}

export default function ProfileEmptyPosts({ title }: Props) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          {title === "Share Photos" && <PostIcon />}
          {title === "Shared Reels" && <PostIcon />}
          {title === "Start Saving" && <SavedIcon />}
          {title === "Photos of you" && <TagIcon />}
        </EmptyMedia>
        <EmptyTitle className="text-2xl font-extrabold">{title}</EmptyTitle>
        <EmptyDescription>{descriptions[title]}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function SavedIcon() {
  return (
    <svg
      aria-label="Save"
      fill="currentColor"
      height="62"
      role="img"
      viewBox="0 0 96 96"
      width="62"
    >
      <title>Save</title>
      <circle
        cx="48"
        cy="48"
        fill="none"
        r="47"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></circle>
      <path
        d="M66 68.685 49.006 51.657a1.42 1.42 0 0 0-2.012 0L30 68.685V27h36Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
    </svg>
  )
}

function PostIcon() {
  return (
    <svg
      aria-label="When you share photos, they will appear on your profile."
      fill="currentColor"
      height="62"
      role="img"
      viewBox="0 0 96 96"
      width="62"
    >
      <title>When you share photos, they will appear on your profile.</title>
      <circle
        cx="48"
        cy="48"
        fill="none"
        r="47"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="2"
      ></circle>
      <ellipse
        cx="48.002"
        cy="49.524"
        fill="none"
        rx="10.444"
        ry="10.476"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2.095"
      ></ellipse>
      <path
        d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
    </svg>
  )
}

function TagIcon() {
  return (
    <svg
      aria-label="Photos of you"
      fill="currentColor"
      height="62"
      role="img"
      viewBox="0 0 96 96"
      width="62"
    >
      <title>Photos of you</title>
      <circle
        cx="48"
        cy="48"
        fill="none"
        r="47"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></circle>
      <path
        d="M56.826 44.119a8.824 8.824 0 1 1-8.823-8.825 8.823 8.823 0 0 1 8.823 8.825Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="2"
      ></path>
      <path
        d="M63.69 67.999a9.038 9.038 0 0 0-9.25-8.998H41.56A9.038 9.038 0 0 0 32.31 68"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
      <path
        d="M48 20.215c-2.94 0-7.125 8.76-11.51 8.785h-4.705A8.785 8.785 0 0 0 23 37.784v22.428a8.785 8.785 0 0 0 8.785 8.785h32.43A8.785 8.785 0 0 0 73 60.212V37.784A8.785 8.785 0 0 0 64.215 29h-4.704c-4.385-.026-8.57-8.785-11.511-8.785Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="2"
      ></path>
    </svg>
  )
}
