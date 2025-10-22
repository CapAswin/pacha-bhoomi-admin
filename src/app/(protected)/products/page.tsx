
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductForm } from './product-form';
import { Product } from '@/lib/types';
import { useLoading } from '@/context/loading-context';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { showLoading, hideLoading } = useLoading();

  async function fetchProducts() {
    showLoading('Fetching products...');
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      hideLoading();
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleAddClick() {
    setSelectedProduct(null);
    setIsFormVisible(true);
  }

  function handleEditClick(product: Product) {
    setSelectedProduct(product);
    setIsFormVisible(true);
  }

  async function handleDelete(productId: string) {
    showLoading('Deleting product...');
    try {
      const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
      fetchProducts(); // Refresh the list
    } catch (error) {
      alert((error as Error).message);
      console.error(error);
    } finally {
      hideLoading();
    }
  }

  function handleFormClose() {
    setIsFormVisible(false);
    fetchProducts();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {isFormVisible ? (
        <ProductForm product={selectedProduct} onClose={handleFormClose} />
      ) : (
        <>
          <Button onClick={handleAddClick}>Add Product</Button>
          <div className="mt-4">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-2 border-b">
                <span>{product.name}</span>
                <div>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(product)}>Edit</Button>
                  <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDelete(product.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
