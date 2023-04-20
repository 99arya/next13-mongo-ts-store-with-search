
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { connectToDatabase } from '../../utils/database';
import Link from 'next/link';

interface Product {
    _id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    imageUrl: string;
}

interface Props {
    initialProduct: Product;
}

export default function ProductDetails({ initialProduct }: Props) {
    const [product, setProduct] = useState<Product>(initialProduct);
    const [loader, setLoader] = useState(false);
    const [name, setName] = useState(product?.name);
    const [category, setCategory] = useState(product?.category);
    const [price, setPrice] = useState(product?.price);
    const [description, setDescription] = useState(product?.description);
    const [imageUrl, setImageUrl] = useState(product?.imageUrl);
    const router = useRouter();

    useEffect(() => {
        if (initialProduct) {
            setProduct(initialProduct);
            setName(initialProduct.name);
            setCategory(initialProduct.category);
            setPrice(initialProduct.price);
            setDescription(initialProduct.description);
            setImageUrl(initialProduct.imageUrl);
        }
    }, [initialProduct]);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoader(true);

        const res = await fetch(`/api/products`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id: product._id,
                name,
                category,
                description,
                price,
                imageUrl,
            }),
        });

        if (res.status === 200) {
            setLoader(false);
            router.push('/products');
        } else {
            setLoader(false);
            // Handle error
        }
    }
    return (
        <div className="container mx-auto my-10">
            {loader && (
                <div className="fullscreen-loader">
                    {/* Add your loader component or animation here */}
                    <div className="loader"></div>
                </div>
            )}
            <h1 className="text-3xl mb-6">Edit Coffee Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium">
                        Name:
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="category" className="block text-sm font-medium">
                        Category:
                    </label>
                    <input
                        id="category"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="description" className="block text-sm font-medium">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="block w-full border border-gray-300 rounded-md p-2"
                    ></textarea>
                </div>
                <div className="space-y-1">
                    <label htmlFor="price" className="block text-sm font-medium">
                        Price:
                    </label>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        required
                        className="block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="imageUrl" className="block text-sm font-medium">
                        Image URL:
                    </label>
                    <input
                        id="imageUrl"
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <button
                    disabled={loader}
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                    {loader ? 'Please Wait ...' : 'Update'}
                </button>
            </form>

            <Link href="/products">
                <button className="text-blue-500 underline mt-4 inline-block">
                    Back to Product List
                </button>
            </Link>
        </div>
    );
}
export async function getServerSideProps(context) {
    const { id } = context.query;
    try {
        const res = await fetch(`http://localhost:3000/api/products?id=${id}`);
        const product = await res.json();
        return {
            props: {
                initialProduct: product,
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}