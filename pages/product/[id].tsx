import { ObjectID } from "mongodb";
import { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
import Link from "next/link";

import { connectToDatabase } from "../../utils/database";

interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface Props {
  product: Product;
}

export default function ProductDetail({ product }: Props) {
  return (
    <div className="container mx-auto my-10">
      <Link href="/products">
        <button className="text-blue-500 underline mt-4 mb-4 inline-block">
          Back to Product List
        </button>
      </Link>
      <div className="flex">
        <div className="w-1/2 pr-5">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={600}
          />
        </div>
        <div className="w-1/2">
          <h1 className="text-3xl font-medium mb-4">{product.name}</h1>
          <p className="mb-2">
            <span className="font-bold">Category: </span>
            {product.category}
          </p>
          <p className="mb-2">
            <span className="font-bold">Price: </span>Rs. {' '}
            {product.price}
          </p>
          <p className="mb-2">
            <span className="font-bold">Description: </span>
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const { db } = await connectToDatabase();
    const products = await db
      .collection("products")
      .find({}, { _id: 1 })
      .toArray();
    const paths = products.map((product) => ({
      params: { id: product._id.toString() },
    }));

    return { paths, fallback: false };
  } catch (error) {
    console.error(error);
    return { paths: [], fallback: false };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const { db } = await connectToDatabase();
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectID(params?.id?.toString()) });

    return { props: { product: JSON.parse(JSON.stringify(product)) } };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};
