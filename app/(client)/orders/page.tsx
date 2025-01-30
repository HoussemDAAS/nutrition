// app/orders/page.tsx
"use client";
import { useState } from 'react';
import { createClient } from '@sanity/client';
import { motion } from 'framer-motion';
import PriceFormater from '@/components/PriceFormater';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { Command, Produit } from '@/sanity.types';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
});

type OrderItem = {
  _key: string;
  quantity?: number;
  price?: number;
  product?: Produit;
};

type OrderWithProducts = Omit<Command, 'items'> & {
  items?: OrderItem[];
};

export default function OrdersPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<OrderWithProducts[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const query = `*[_type == "command" && customer.phone == $phone] | order(_createdAt desc) {
        _id,
        _createdAt,
        customer,
        items[] {
          _key,
          quantity,
          price,
          product->{
            _id,
            nom,
            slug,
            images[] {
              ...,
              asset->
            },
            prix
          }
        },
        total,
        status
      }`;
      
      const result: OrderWithProducts[] = await client.fetch(query, { phone });
      setOrders(result);
      if (result.length === 0) setError('No orders found for this phone number');
    } catch (err) {
      setError(`Failed to fetch orders: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1"
            />
            <Button onClick={fetchOrders} disabled={loading}>
              {loading ? 'Searching...' : 'Search Orders'}
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Order #{order._id?.slice(-6).toUpperCase()}
                    </h2>
                    <p className="text-gray-500">
                      {order._createdAt && new Date(order._createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <Separator className="my-4" />

                <div className="grid gap-4">
                  {order.items?.map((item) => (
                    <div key={item._key} className="flex items-center gap-4">
                      {item.product?.images?.[0]?.asset && (
                        <Image
                          src={urlFor(item.product.images[0]).url()}
                          alt={item.product.nom || 'Product image'}
                          width={80}
                          height={80}
                          className="rounded-md"
                        />
                      )}
                      <div className="flex-1">
                        <Link
                          href={`/product/${item.product?.slug?.current || '#'}`}
                          className="font-medium hover:text-AccentColor"
                        >
                          {item.product?.nom || 'Unnamed Product'}
                        </Link>
                        <p className="text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <PriceFormater
                        amount={(item.price || 0) * (item.quantity || 0)}
                        className="font-semibold"
                      />
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Delivery Address</p>
                    <p className="text-gray-600">
                      {order.customer?.address}, {order.customer?.city}
                    </p>
                  </div>
                  <PriceFormater
                    amount={order.total || 0}
                    className="text-xl font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}