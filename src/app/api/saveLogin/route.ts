import { kv } from "@vercel/kv";

interface User {
  name: string;
  email: string;
  login: number;
  created: string;
  updated: string;
}

export async function POST(req: Request) {
  const { name, email } = await req.json();
  let response = Response.json({
    status: 200,
  });
  console.log("name", name);
  console.log("email", email);

  try {
    // Retrieve user data from KV store
    const getUser: User | null = await kv.get(email);
    console.log("getUser", getUser);

    // Check if the user exists
    if (getUser) {
      // User exists, update login count and timestamp
      await kv.set(email, {
        ...getUser,
        login: getUser.login + 1,
        updated: new Date().toISOString(),
      });
    } else {
      // User doesn't exist, create a new user
      const newUser: User = {
        name,
        email,
        login: 1,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };

      await kv.set(email, newUser);
    }
  } catch (error) {
    // Handle errors
    response = Response.json(
      { error: error },
      {
        status: 400,
      }
    );
  }

  return response;
}
