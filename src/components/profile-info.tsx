import {
  BriefcaseBusiness,
  Calendar,
  Link,
  MapPin,
  SettingsIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"

const username = "arridha08"

export default function ProfileInfo() {
  return (
    <div className="w-full py-4">
      <div className="flex h-full w-full flex-col">
        <div className="h-30 w-full">
          <img
            className="h-full w-full object-cover object-bottom"
            src="https://images.unsplash.com/photo-1769540209843-c1e6a462b9d3?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="background wallpaper"
          />
        </div>

        <div className="relative flex h-14 w-full bg-background">
          <div className="absolute bottom-4 left-4">
            <Avatar className="size-32 ring-2 ring-background ring-offset-2 ring-offset-background">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex w-full items-center justify-end gap-x-2">
            <Button variant="outline" size="icon">
              <SettingsIcon />
            </Button>
            <Button variant={"outline"}>Message</Button>
            <Button variant={"default"}>Follow</Button>
          </div>
        </div>

        <div className="">
          <div>
            <h1 className="text-xl font-extrabold">Arridha Amrad</h1>
            <h2 className="text-muted-foreground">@{username}</h2>
          </div>
          <p className="py-2 text-sm leading-relaxed font-light">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis
            expedita reiciendis aliquam impedit culpa fugit error libero aperiam
            dolorem deserunt?
          </p>
        </div>

        <div className="mb-2 flex flex-wrap gap-x-4">
          <div className="flex items-center gap-x-1 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            <h3>Pekanbaru, Riau</h3>
          </div>
          <div className="flex items-center gap-x-1 text-sm text-muted-foreground">
            <BriefcaseBusiness className="size-4" />
            <h3>Software Engineer</h3>
          </div>
          <div className="flex items-center gap-x-1 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <h3>Joined November 2025</h3>
          </div>
          <div className="flex items-center gap-x-1 text-sm text-sky-500">
            <Link className="size-4" />
            <a>arridhaamrad.com</a>
          </div>
        </div>

        <div className="mb-2 flex gap-x-4 text-sm">
          <div className="space-x-1">
            <span className="font-semibold">1.2k</span>
            <span className="font-light text-muted-foreground">posts</span>
          </div>
          <div className="space-x-1">
            <span className="font-semibold">379</span>
            <span className="font-light text-muted-foreground">followers</span>
          </div>
          <div className="space-x-1">
            <span className="font-semibold">54</span>
            <span className="font-light text-muted-foreground">followings</span>
          </div>
        </div>

        <div className="flex gap-x-2">
          <AvatarGroup className="grayscale">
            <Avatar size="sm">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarImage
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
              />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          <span className="text-sm text-muted-foreground">
            Followed by Shadcn, Max Leiter, Evil Rabbit
          </span>
        </div>
      </div>
    </div>
  )
}
