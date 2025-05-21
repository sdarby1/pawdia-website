import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]/route"

export async function GET(req) {
    const session = await getServerSession(authOptions)
    console.log("GET API", session)
    return new Response(JSON.stringify({ authenticated: !!session}))
}