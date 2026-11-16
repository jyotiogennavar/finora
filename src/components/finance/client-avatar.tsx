import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { fullName, initials } from "@/lib/format/labels"

export function ClientAvatar({
  firstName,
  lastName,
  size = "default",
  labelled = true,
  className,
}: {
  firstName: string
  lastName: string
  size?: "sm" | "default" | "lg"
  labelled?: boolean
  className?: string
}) {
  const name = fullName(firstName, lastName)

  return (
    <Avatar
      data-slot="client-avatar"
      size={size}
      className={className}
      aria-label={labelled ? name : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      <AvatarFallback>{initials(firstName, lastName)}</AvatarFallback>
    </Avatar>
  )
}
