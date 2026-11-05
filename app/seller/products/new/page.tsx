'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';

export default function NewProduct() {
  const router = useRouter();
  const [fields, setFields] = useState<any>({title: '', price: '', listPrice: '', description: '', categorySlug: 'electronics', images: '', stock: '10'});
  const [error, setError] = useState('');

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/seller/products', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...fields, images: fields.images.split(',').map((value: string) => value.trim()).filter(Boolean)})});
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Could not create product.');
      return toast.error(data.error);
    }
    toast.success('Product created');
    router.push('/seller/products');
  }

  const inputs: [string, string, string][] = [['title', 'Title', 'text'], ['price', 'Price', 'number'], ['listPrice', 'List price', 'number'], ['categorySlug', 'Category', 'text'], ['stock', 'Stock', 'number'], ['images', 'Image URLs, comma separated', 'text']];

  return (
    <form onSubmit={save} className="surface max-w-3xl p-8" aria-labelledby="new-product-title">
      <p className="eyebrow">Catalog</p>
      <h1 id="new-product-title" className="page-title mt-2">Add a product</h1>
      {error && <p className="error-text mt-4 rounded-lg bg-red-50 p-3" role="alert">{error}</p>}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {inputs.map(([key, label, type]) => {
          const id = `new-product-${key}`;
          return <div key={key}><label htmlFor={id} className="text-sm font-bold">{label}</label><input id={id} required={key === 'title' || key === 'price' || key === 'images'} type={type} value={fields[key]} onChange={(event) => setFields({...fields, [key]: event.target.value})} className="input mt-2" /></div>;
        })}
      </div>
      <div className="mt-4"><label htmlFor="new-product-description" className="text-sm font-bold">Description</label><textarea id="new-product-description" value={fields.description} onChange={(event) => setFields({...fields, description: event.target.value})} className="input mt-2 min-h-32" /></div>
      <button type="submit" className="btn btn-primary mt-6">Create product</button>
    </form>
  );
}
