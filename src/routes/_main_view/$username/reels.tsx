import { createFileRoute } from "@tanstack/react-router"
import ProfileEmptyPosts from "@/components/profile-empty-posts"

export const Route = createFileRoute("/_main_view/$username/reels")({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProfileEmptyPosts title="Shared Reels" />
}
