'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import { useCompare } from '@/hooks/useCompare';
import { useWishlist } from '@/hooks/useWishlist';
import { ArrowRightLeft, Check, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck, X, ZoomIn } from '@/lib/icons';
import type { Product } from './ProductCard';
import ProductExtras from './ProductExtras';

type DetailProduct = Product & { description?: string; features?: string[]; colors?: string[]; sizes?: string[]; sellerName?: string; seller?: string };

export default function ProductView({ product }: { product: DetailProduct }) {
  const { add } = useCart();
  const { has: hasWishlist, toggle: toggleWishlist } = useWishlist();
  const { has: hasCompare, toggle: toggleCompare } = useCompare();
  const images = useMemo(() => product.images?.length ? product.images : ['/placeholder-product.svg'], [product.images]);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(product.colors?.[0] || '');
  const [size, setSize] = useState(product.sizes?.[0] || '');
  const saved = hasWishlist(product._id);
  const compared = hasCompare(product._id);
  const discount = product.listPrice && product.listPrice > product.price ? Math.round((1 - product.price / product.listPrice) * 100) : 0;
  const soldOut = product.stock !== undefined && product.stock <= 0;

  async function addItem() {
    const ok = await add(product._id, qty);
    toast[ok ? 'success' : 'error'](ok ? 'Added to your bag' : 'Sign in to add items');
  }

  async function saveItem() {
    const ok = await toggleWishlist(product._id);
    if (!ok) toast.error('Sign in to save products');
  }

  return (
    <div className="shell py-8 md:py-12">
      <div className="mb-7 flex items-center gap-2 text-sm text-[#526259]"><Link href="/" className="amazon-link">Home</Link><span>/</span><span className="truncate">{product.title}</span></div>
      <div className="grid gap-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-12">
        <div className="min-w-0">
          <div className="surface relative overflow-hidden p-3 sm:p-5">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.1rem] bg-[#edf1e9]">
              <img src={images[activeImage]} alt={product.title} className="h-full w-full object-contain mix-blend-multiply" />
              {discount > 0 && <span className="pill absolute left-4 top-4 bg-[#ff765c] text-white">-{discount}% today</span>}
              <button onClick={() => setZoomed(true)} className="absolute bottom-4 right-4 rounded-full bg-white/90 p-3 shadow-sm transition hover:scale-105" aria-label="Zoom product image"><ZoomIn className="h-5 w-5" /></button>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.slice(0, 5).map((src, index) => <button type="button" key={`${src}-${index}`} onClick={() => setActiveImage(index)} className={`aspect-square overflow-hidden rounded-lg border-2 bg-[#edf1e9] p-1 transition ${activeImage === index ? 'border-[#9bb85c]' : 'border-transparent hover:border-[#c3d39d]'}`} aria-label={`View image ${index + 1}`}><img src={src} alt="" className="h-full w-full object-contain mix-blend-multiply" /></button>)}
            </div>
            <p className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-[#728749]"><ZoomIn className="h-3.5 w-3.5" /> Tap an image to explore the details</p>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3"><p className="eyebrow">{product.brand || 'Halozon selection'}</p><div className="flex gap-2"><button onClick={saveItem} className={`rounded-full border border-[#dfe5dc] p-2.5 ${saved ? 'text-[#ff765c]' : 'text-[#526259]'}`} aria-label={saved ? 'Remove from wishlist' : 'Save product'}><Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} /></button><button onClick={() => { toggleCompare(product._id); toast.success(compared ? 'Removed from compare' : 'Added to compare'); }} className={`rounded-full border border-[#dfe5dc] p-2.5 ${compared ? 'bg-[#d7f36b]' : 'text-[#526259]'}`} aria-label={compared ? 'Remove from compare' : 'Add to compare'}><ArrowRightLeft className="h-4 w-4" /></button></div></div>
          <h1 className="mt-3 text-4xl font-black tracking-[-.05em] md:text-5xl">{product.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm"><span className="flex items-center gap-1 font-bold text-[#b07a29]"><Star className="h-4 w-4 fill-current" />{product.rating?.toFixed(1) || '4.5'}</span><span className="text-[#8b998d]">{product.ratingCount || 0} reviews</span>{product.stock !== undefined && product.stock > 0 && <span className="pill bg-[#d7f36b] text-[#405719]">In stock</span>}</div>
          <div className="mt-6 flex items-baseline gap-3"><b className="text-4xl font-black">${product.price.toFixed(2)}</b>{product.listPrice && product.listPrice > product.price && <><del className="text-[#8b998d]">${product.listPrice.toFixed(2)}</del><span className="text-sm font-black text-[#ff765c]">Save {discount}%</span></>}</div>
          <p className="muted mt-5 max-w-xl leading-relaxed">{product.description || 'A thoughtfully selected product from a trusted Halozon seller.'}</p>
          {product.features?.length ? <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">{product.features.slice(0, 6).map((feature) => <li key={feature} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-[#728749]" />{feature}</li>)}</ul> : null}
          {product.colors?.length ? <div className="mt-7"><div className="flex items-center justify-between"><b className="text-sm">Color</b><span className="text-xs text-[#8b998d]">{color || 'Choose a color'}</span></div><div className="mt-3 flex flex-wrap gap-2">{product.colors.map((value) => <button key={value} type="button" onClick={() => setColor(value)} className={`rounded-full border px-3 py-2 text-xs font-bold ${color === value ? 'border-[#405719] bg-[#d7f36b] text-[#405719]' : 'border-[#dfe5dc] hover:border-[#9bb85c]'}`}>{value}</button>)}</div></div> : null}
          {product.sizes?.length ? <div className="mt-6"><div className="flex items-center justify-between"><b className="text-sm">Size</b><span className="text-xs text-[#8b998d]">{size || 'Choose a size'}</span></div><div className="mt-3 flex flex-wrap gap-2">{product.sizes.map((value) => <button key={value} type="button" onClick={() => setSize(value)} className={`min-w-12 rounded-lg border px-3 py-2 text-xs font-bold ${size === value ? 'border-[#405719] bg-[#d7f36b] text-[#405719]' : 'border-[#dfe5dc] hover:border-[#9bb85c]'}`}>{value}</button>)}</div></div> : null}
          <div className="mt-8 flex gap-2"><div className="flex items-center rounded-xl border border-[#cbd6ca]"><button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button><span className="w-8 text-center text-sm font-black">{qty}</span><button className="p-3" onClick={() => setQty(qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button></div><button onClick={addItem} disabled={soldOut} className="btn btn-primary flex-1"><ShoppingCart className="h-5 w-5" />{soldOut ? 'Sold out' : 'Add to bag'}</button></div>
          <div className="mt-4 grid grid-cols-3 gap-2">{[[Truck, product.fastShipping === false ? 'Reliable delivery' : 'Fast delivery'], [ShieldCheck, 'Buyer protected'], [Heart, 'Easy returns']].map(([Icon, label]) => { const ItemIcon = Icon as typeof Truck; return <div key={label as string} className="surface p-3 text-center"><ItemIcon className="mx-auto h-5 w-5 text-[#728749]" /><small className="mt-2 block text-[11px] font-bold">{label as string}</small></div>; })}</div>
          <div className="mt-6 border-t border-[#dfe5dc] pt-5 text-sm"><p><span className="text-[#8b998d]">Sold by</span> <b>{product.sellerName || product.seller || 'Halozon marketplace'}</b></p><p className="mt-2 text-[#526259]">Free delivery on orders over $35 · Secure checkout · 30-day returns</p></div>
        </div>
      </div>
      <ProductExtras productId={product._id} />
      {zoomed && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#17221c]/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Product image zoom"><button onClick={() => setZoomed(false)} className="absolute right-5 top-5 rounded-full bg-white p-3" aria-label="Close zoom"><X /></button><img src={images[activeImage]} alt={product.title} className="max-h-[88vh] max-w-[92vw] rounded-2xl bg-[#edf1e9] object-contain shadow-2xl" /></div>}
    </div>
  );
}
