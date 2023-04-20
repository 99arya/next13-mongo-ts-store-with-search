This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


# Date: 20-April-2023
- Submission Date: 20-April-2023
1. Create a Next.js app as a fullstack app with the Routing User Experience as folows
    - Create 'ProductList' Page 
        - This will read data from server and show in Table
        - Above this table show a textbox that will provide a searh experience as follows
            - e.g. If the Text entered in Text box is "ProductName=Laptop", then it will show all laptops in table. E.g. "CategoryName=Electronics", then table will show all Products of the type electronics
    - Create a SSG for showing ProductDetails for a selected product from the 'ProductList' Page when 'Show Details' button is clicked
    - CReate 'AddProduct' page to accept Product Information      
        - After the Save is successful, navigate to the 'ProductList' page

  

    - Create 'EditProduct' Page
        - Navigate to this page base on the ProductRowId selected in the 'ProductList' table
        - SHow the Products details and edit them so that tyey can be saved
        - After the Edit is successful, navigate to the 'ProductList' page
    - Add and Edit pages must have 'Go Back' link to navigate back to the 'ProductList' Page  

2. (optional)
    - If any error occured during any operations (Read/Write), then show the fallback UI with error information                
