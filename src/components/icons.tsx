import {
  Loader2,
  LucideProps,
  Moon,
  SunMedium,
} from "lucide-react"

export type Icon = React.ComponentType<LucideProps>

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  spinner: Loader2,
} 