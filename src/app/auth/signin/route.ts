import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("authdb");

    // Find user by email
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401 }
      );
    }

    // Successful login
    return new Response(
      JSON.stringify({
        message: "Sign-in successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      })
    );
  } catch (err) {
    console.error("Signin API error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
