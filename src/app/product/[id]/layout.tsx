import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/products/${resolvedParams.id}`);
    if (!res.ok) {
      return { title: 'Product Not Found | AmarShop' };
    }
    const product = await res.json();
    const title = `${product.name} | AmarShop`;
    const description = product.description?.slice(0, 160) || '';
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: product.images && product.images.length > 0 ? [product.images[0]] : [],
      },
    };
  } catch (error) {
    return { title: 'Product | AmarShop' };
  }
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}
