export async function POST(request: Request) {
  const res = await request.json();
  const sessionToken = res.sessionToken;
  const refreshToken = res.refreshToken;

  if (!sessionToken) {
    return Response.json(
      {
        message: "No session token found",
      },
      {
        status: 400,
      }
    );
  }
  return Response.json(res, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/, refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/;`,
    },
  });
}
