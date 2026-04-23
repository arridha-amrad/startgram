import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_main_view/_protected/messages")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/messages"!</div>
}
