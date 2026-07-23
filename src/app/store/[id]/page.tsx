import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/stores/${resolvedParams.id}`);
    if (!res.ok) {
      return { title: 'Store Not Found | AmarShop' };
    }
    const store = await res.json();
    const title = `${store.name} | AmarShop`;
    const description = store.description?.slice(0, 160) || '';
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: store.logo ? [store.logo] : [],
      },
    };
  } catch (error) {
    return { title: 'Store | AmarShop' };
  }
}

export default async function StorePage({ params }: Props) {
  const resolvedParams = await params;
  return (
    <div className="app-container py-12">
      <h1 className="text-2xl font-bold">Store {resolvedParams.id}</h1>
      <p>Store front coming soon...</p>
    </div>
  );
}
