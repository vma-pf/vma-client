import { cookies } from "next/headers";
import { apiRequest } from "@oursrc/app/(auth)/api-request";
import { HttpError } from "@oursrc/lib/http";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");

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
  return Response.json(
    {},
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=; HttpOnly; Secure; SameSite=Lax; Path=/`,
      },
    }
  );
  //   try {
  //     const result = await apiRequest.logoutFromNextServerToServer(
  //       sessionToken.value
  //     );
  //     return Response.json(result.payload, {
  //       status: 200,
  //       headers: {
  //         "Set-Cookie": `sessionToken=; HttpOnly; Secure; SameSite=Lax; Path=/`,
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     if (error instanceof HttpError) {
  //       return Response.json(error.payload, {
  //         status: error.status,
  //       });
  //     } else {
  //       return Response.json(
  //         {
  //           message: "Internal Server Error",
  //         },
  //         {
  //           status: 500,
  //         }
  //       );
  //     }
  //   }
}
