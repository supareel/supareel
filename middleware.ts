import { DASHBOARD } from "~/utils/route_names"

export { default } from "next-auth/middleware"

export const config = { matcher: [DASHBOARD] }