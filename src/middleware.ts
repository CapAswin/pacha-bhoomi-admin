export { default } from "next-auth/middleware"

export const config = { matcher: [
    "/dashboard",
    "/orders",
    "/products",
    "/customers",
    "/promotions",
    "/settings",
    "/loader-test",
] }
