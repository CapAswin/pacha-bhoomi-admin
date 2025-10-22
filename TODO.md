# TODO: Standardize UI Tables and Backgrounds in Admin Section

## Tasks

- [x] Update `src/components/admin/customers/customer-table.tsx` to use shadcn Table components instead of raw HTML table
- [x] Update `src/components/admin/orders/order-table.tsx` to use shadcn Table components instead of raw HTML table
- [x] Update `src/components/admin/categories/category-table.tsx` to use DataTablePagination instead of custom pagination
- [x] Update `src/components/admin/products/product-table.tsx` to remove custom background styling (glassmorphism) and use consistent border/rounded styling
- [x] Update page backgrounds in `src/app/(protected)/products/page.tsx`, `src/app/(protected)/customers/page.tsx`, `src/app/(protected)/orders/page.tsx` to match categories page (remove glassmorphism, use consistent styling)
- [x] Update `src/app/(protected)/categories/page.tsx` to match other pages' header styling (use h1 with font-headline and animate-slide-in-up)

## Notes

- All pages now use consistent layout with h1 headers and `div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex"` containers.
- All tables now use shadcn Table components and DataTablePagination.
- Product table removed custom glassmorphism styling.
- Dev server running for manual testing.
