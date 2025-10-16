
import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // You can add custom logic here if needed, otherwise just let it pass through.
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard",
    "/orders",
    "/products",
    "/customers",
    "/promotions",
    "/settings",
    "/loader-test",
  ],
}
