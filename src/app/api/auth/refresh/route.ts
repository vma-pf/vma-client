import { SERVERURL } from "@oursrc/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get("sessionToken");
    const refreshToken = cookieStore.get("refreshToken");
    const res = await fetch(`${SERVERURL}/api/auth/refresh-token?refreshToken=${refreshToken || ""}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
        },
        method: "POST",
    });
    const newToken = await res.json();
    return Response.json(newToken);
}