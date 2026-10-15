import ThriveApp from "../thrive-app"
import { thriveStaticParams } from "../routes"

export const dynamicParams = false

export function generateStaticParams() {
  return thriveStaticParams()
}

export default function Page() {
  return <ThriveApp />
}
