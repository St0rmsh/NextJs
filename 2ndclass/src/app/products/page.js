import api from '@/components/lib/api'
import ProductCard from '@/components/ProductCard';
import React from 'react'

const page = async () => {

    const response = await api.get("https://fakestoreapi.com/products");

    const products =  response.data;

    console.log(products);

    return (
        <div>
    <div className="grid grid-cols-4">
        {products.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
    </div>

        </div>
    )
}

export default page