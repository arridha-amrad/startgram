import { createFileRoute } from "@tanstack/react-router"
import ProfileEmptyPosts from "@/components/profile-empty-posts"

export const Route = createFileRoute("/_main_view/$username/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex-1">
      <ProfileEmptyPosts title="Share Photos" />
      {/* <div className="mt-4 grid grid-cols-4 gap-0.5">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="aspect-4/5 bg-muted"></div>
          ))}
        </div> */}
    </div>
  )
  // return (
  //   <div className="mt-4 grid grid-cols-4 gap-0.5">
  //     {[...Array(30)].map((_, i) => (
  //       <div key={i} className="aspect-4/5 bg-muted"></div>
  //     ))}
  //   </div>
  // )
}
