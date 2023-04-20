import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import Image from "next/image";
import { IProduct } from "../../models/Product";
import { connectToDatabase } from '../../utils/database';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


interface ProductListProps {
  initialProducts: IProduct[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
  const debouncedSearch = useDebounce(search, 1000); // 500ms debounce delay

  useEffect(() => {
    if (!debouncedSearch) {
      setProducts(initialProducts);
      return;
    }

    const fetchProducts = async () => {
      setLoader(true);
      const res = await fetch(`/api/products?search=${debouncedSearch}`);
      const products = await res.json();
      setProducts(products);
      setLoader(false);
    };

    fetchProducts();
  }, [debouncedSearch]);

  return (
    <div className="container mx-auto">
      {loader && (
        <div className="fullscreen-loader">
          {/* Add your loader component or animation here */}
          <div className="loader"></div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">Product List</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-300"
        />
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-2">Image</th>
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Category</th>
            <th className="text-left py-2">Price</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product._id}>
              <td className="py-2">
                <Image src={product.imageUrl} alt={product.name} width={100} height={50} />
              </td>
              <td className="py-2">{product.name}</td>
              <td className="py-2">{product.category}</td>
              <td className="py-2">Rs. {product.price}</td>
              <td className="py-2">
                <div className="flex">
                  <Link href={`/product/edit?id=${product._id}`}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                      Edit
                    </button>
                  </Link>
                  <Link href={`/product/${product._id}`}>
                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                      Show Details
                    </button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6">
        <Link href="/add-product">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Add Product
          </button>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const { db } = await connectToDatabase();
  const products = await db.collection('products').find({}).toArray();

  return {
    props: {
      initialProducts: JSON.parse(JSON.stringify(products)),
    },
  };
}
