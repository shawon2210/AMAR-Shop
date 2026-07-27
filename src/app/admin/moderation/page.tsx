'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdminPage } from '@/lib/api/hooks';
import { fetchProducts } from '@/lib/api/admin/products';
import { fetchReviews, updateReview, deleteReview } from '@/lib/api/admin/marketing';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700',
  inactive: 'bg-gray-100 text-gray-700',
  approved: 'bg-blue-100 text-blue-700',
  hidden: 'bg-purple-100 text-purple-700',
};

function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-IN')}`;
}

export default function ModerationPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('products');

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
    page: productsPage,
    setPage: setProductsPage,
  } = useAdminPage(
    ({ page, limit }) =>
      fetchProducts({
        page,
        limit,
        search: search || undefined,
        status: 'pending',
      }),
    [search],
  );

  const {
    data: reviewsData,
    loading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
    page: reviewsPage,
    setPage: setReviewsPage,
  } = useAdminPage(
    ({ page, limit }) =>
      fetchReviews({
        page,
        limit,
        status: 'pending',
      }),
    [],
  );

  const handleApproveProduct = async (id: string) => {
    try {
      await fetch('/api/admin/commerce/products/:id/approve'.replace(':id', id), {
        method: 'POST',
      });
      await refetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve product');
    }
  };

  const handleRejectProduct = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await fetch('/api/admin/commerce/products/:id/reject'.replace(':id', id), {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      await refetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject product');
    }
  };

  const handleHideReview = async (id: string) => {
    try {
      await deleteReview(id);
      await refetchReviews();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to hide review');
    }
  };

  const handleUpdateReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateReview(id, { status });
      await refetchReviews();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update review');
    }
  };

  return (
    <div className='space-y-5'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
        <h1 className='text-xl sm:text-2xl font-bold text-[#222]'>Moderation Queue</h1>
        {(productsData || reviewsData) && (
          <span className='text-xs sm:text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium w-fit'>
            {(productsData?.total ?? 0) + (reviewsData?.total ?? 0)} pending items
          </span>
        )}
      </div>

      <div className='border-b border-[#ddd] mb-4'>
        <div className='flex gap-6'>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'products'
              ? 'border-green-500 text-green-700'
              : 'border-transparent text-[#888] hover:text-green-600'
            }`}
          >
            Products Pending Approval
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'reviews'
              ? 'border-green-500 text-green-700'
              : 'border-transparent text-[#888] hover:text-green-600'
            }`}
          >
            Reviews Pending Moderation
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <>
          <div className='flex flex-col sm:flex-row gap-3 mb-4'>
            <div className='flex items-center gap-2 bg-white border border-[#ddd] rounded-lg px-3 py-2 flex-1 max-w-md'>
              <span className='material-symbols-outlined text-[#888] text-[20px]'>search</span>
              <input
                type='text'
                placeholder='Search products...'
                value={search}
                onChange={(e) => { setSearch(e.target.value); setProductsPage(1); }}
                className='bg-transparent border-none outline-none text-sm flex-1'
              />
            </div>
          </div>

          {productsError && <AdminError message={productsError} onRetry={refetchProducts} />}

          {productsLoading ? (
            <AdminLoading />
          ) : !productsData || productsData.products.length === 0 ? (
            <AdminEmpty message='No pending products found' />
          ) : (
            <>
              {/* Desktop Table */}
              <div className='hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto'>
                <table className='w-full text-xs sm:text-sm'>
                  <thead>
                    <tr className='text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]'>
                      <th className='p-2 sm:p-3 whitespace-nowrap'>Product</th>
                      <th className='p-2 sm:p-3 whitespace-nowrap'>Store</th>
                      <th className='p-2 sm:p-3 whitespace-nowrap'>Price</th>
                      <th className='p-2 sm:p-3 whitespace-nowrap'>Stock</th>
                      <th className='p-2 sm:p-3 whitespace-nowrap'>Status</th>
                      <th className='p-2 sm:p-3 whitespace-nowrap'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsData.products.map((p) => (
                      <tr key={p.id} className='border-b border-[#f5f5f5] hover:bg-[#fafafa]'>
                        <td className='p-2 sm:p-3'>
                          <div className='flex items-center gap-2 sm:gap-3'>
                            <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#f0f0f0] flex items-center justify-center overflow-hidden shrink-0'>
                              {p.images?.[0] ? (
                                <Image src={p.images[0]} alt={p.name} width={40} height={40} className='w-full h-full object-cover' />
                              ) : (
                                <span className='material-symbols-outlined text-[#888] text-[16px] sm:text-[20px]'>inventory_2</span>
                              )}
                            </div>
                            <span className='font-medium text-[#333] max-w-[140px] sm:max-w-[200px] truncate'>{p.name}</span>
                          </div>
                        </td>
                        <td className='p-2 sm:p-3 text-[#555] whitespace-nowrap'>{p.store?.name || 'N/A'}</td>
                        <td className='p-2 sm:p-3 font-medium whitespace-nowrap'>{formatBDT(p.price)}</td>
                        <td className='p-2 sm:p-3 whitespace-nowrap'>
                          <span className={p.stockCount === 0 ? 'text-red-500 font-medium' : 'text-[#666]'}>
                            {p.stockCount === 0 ? 'Out of Stock' : p.stockCount}
                          </span>
                        </td>
                        <td className='p-2 sm:p-3 whitespace-nowrap'>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[p.status] || 'bg-gray-100 text-gray-700'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className='p-2 sm:p-3 whitespace-nowrap'>
                          <div className='flex items-center gap-1'>
                            {p.status === 'pending' && (
                              <>
                                <button onClick={() => handleApproveProduct(p.id)} className='text-[10px] sm:text-[11px] bg-green-500 text-white px-1.5 sm:px-2 py-1 rounded-md hover:bg-green-600 font-medium'>Approve</button>
                                <button onClick={() => handleRejectProduct(p.id)} className='text-[10px] sm:text-[11px] bg-red-500 text-white px-1.5 sm:px-2 py-1 rounded-md hover:bg-red-600 font-medium'>Reject</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className='sm:hidden space-y-3'>
                {productsData.products.map((p) => (
                  <div key={p.id} className='bg-white rounded-xl border border-[#eee] p-3 space-y-2'>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 rounded-lg bg-[#f0f0f0] flex items-center justify-center overflow-hidden flex-shrink-0'>
                        {p.images?.[0] ? (
                          <Image src={p.images[0]} alt={p.name} width={48} height={48} className='w-full h-full object-cover' />
                        ) : (
                          <span className='material-symbols-outlined text-[#888] text-[20px]'>inventory_2</span>
                        )}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='font-medium text-[#333] text-sm truncate'>{p.name}</p>
                        <p className='text-xs text-[#888]'>{p.store?.name || 'N/A'} · {p.category?.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='font-semibold'>{formatBDT(p.price)}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[p.status] || 'bg-gray-100 text-gray-700'}`}>
                        {p.status}
                      </span>
                    </div>
                    {p.status === 'pending' && (
                      <div className='flex gap-2 pt-1'>
                        <button onClick={() => handleApproveProduct(p.id)} className='flex-1 text-xs bg-green-500 text-white py-1.5 rounded-md font-medium hover:bg-green-600'>Approve</button>
                        <button onClick={() => handleRejectProduct(p.id)} className='flex-1 text-xs bg-red-500 text-white py-1.5 rounded-md font-medium hover:bg-red-600'>Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {productsData.totalPages > 1 && (
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-[#888]'>
                    Page {productsPage} of {productsData.totalPages} ({productsData.total} total)
                  </span>
                  <div className='flex gap-2'>
                    <button
                      disabled={productsPage <= 1}
                      onClick={() => setProductsPage((p) => Math.max(1, p - 1))}
                      className='px-3 py-1.5 bg-white border border-[#ddd] rounded-lg disabled:opacity-50 hover:bg-[#f5f5f5]'
                    >
                      Previous
                    </button>
                    <button
                      disabled={productsPage >= productsData.totalPages}
                      onClick={() => setProductsPage((p) => p + 1)}
                      className='px-3 py-1.5 bg-white border border-[#ddd] rounded-lg disabled:opacity-50 hover:bg-[#f5f5f5]'
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        // Reviews tab
        <>
          <div className='flex flex-col sm:flex-row gap-3 mb-4'>
            <div className='flex items-center gap-2 bg-white border border-[#ddd] rounded-lg px-3 py-2 flex-1 max-w-md'>
              <span className='material-symbols-outlined text-[#888] text-[20px]'>search</span>
              <input
                type='text'
                placeholder='Search reviews...'
                value={search}
                onChange={(e) => { setSearch(e.target.value); setReviewsPage(1); }}
                className='bg-transparent border-none outline-none text-sm flex-1'
              />
            </div>
          </div>

          {reviewsError && <AdminError message={reviewsError} onRetry={refetchReviews} />}

          {reviewsLoading ? (
            <AdminLoading />
          ) : !reviewsData || reviewsData.reviews.length === 0 ? (
            <AdminEmpty message='No pending reviews found' />
          ) : (
            <>
              {/* Desktop Table */}
              <div className='hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto'>
                <table className='w-full text-xs sm:text-sm'>
                  <thead>
                    <tr className='text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]'>
                      <th className='p-2 sm:p-3 whitespace-nowrap'>Review</th>
                      <th className='p-2 sm:p-3 whitespace-nowrap'>User</th>
                      <th className='p-2 sm:p-3 whitespace-nowrap'>Product</th>
                      <th className='p-2 sm:p-3 whitespace-nowrap'>Rating</th>
                      <th className='p-2 sm:p-3 whitespace-nowrap'>Status</th>
                      <th className='p-2 sm:p-3 whitespace-nowrap'>Reported</th>
                      <th className='p-2 sm:p-3 whitespace-nowrap'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewsData.reviews.map((r) => (
                      <tr key={r.id} className='border-b border-[#f5f5f5] hover:bg-[#fafafa]'>
                        <td className='p-2 sm:p-3'>
                          <div>
                            <p className='font-medium text-[#333] text-sm truncate'>Review on {r.product.name}</p>
                            <p className='text-xs text-[#666] mt-1 line-clamp-2'>{r.comment}</p>
                          </div>
                        </td>
                        <td className='p-2 sm:p-3 text-[#555] whitespace-nowrap'>{r.user.name}</td>
                        <td className='p-2 sm:p-3 text-[#555] whitespace-nowrap truncate max-w-xs'>{r.product.name}</td>
                        <td className='p-2 sm:p-3 whitespace-nowrap'>
                          <span className='flex items-center gap-1'>
                            <span className='text-yellow-600'>★</span>
                            <span className='font-medium'>{r.rating}</span>
                          </span>
                        </td>
                        <td className='p-2 sm:p-3 whitespace-nowrap'>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[r.status] || 'bg-gray-100 text-gray-700'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className='p-2 sm:p-3 whitespace-nowrap'>
                          {r.reported ? (
                            <span className='text-red-600 text-xs font-medium'>FLAGGED</span>
                          ) : (
                            <span className='text-[#999] text-xs'>No</span>
                          )}
                        </td>
                        <td className='p-2 sm:p-3 whitespace-nowrap'>
                          <div className='flex items-center gap-1 flex-wrap'>
                            {r.status === 'pending' && (
                              <>
                                <button onClick={() => handleUpdateReview(r.id, 'approved')} className='text-[10px] sm:text-[11px] bg-green-500 text-white px-1.5 py-0.5 rounded-md hover:bg-green-600 font-medium'>Approve</button>
                                <button onClick={() => handleUpdateReview(r.id, 'rejected')} className='text-[10px] sm:text-[11px] bg-red-500 text-white px-1.5 py-0.5 rounded-md hover:bg-red-600 font-medium'>Reject</button>
                                <button onClick={() => handleHideReview(r.id)} className='text-[10px] sm:text-[11px] bg-purple-500 text-white px-1.5 py-0.5 rounded-md hover:bg-purple-600 font-medium'>Hide</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className='sm:hidden space-y-3'>
                {reviewsData.reviews.map((r) => (
                  <div key={r.id} className='bg-white rounded-xl border border-[#eee] p-3 space-y-2'>
                    <div className='space-y-1'>
                      <p className='font-medium text-[#333] text-sm truncate'>Review on {r.product.name}</p>
                      <p className='text-xs text-[#666] line-clamp-2'>{r.comment}</p>
                    </div>
                    <div className='flex items-center justify-between text-xs'>
                      <span className='text-[#888]'>By {r.user.name}</span>
                      <span className='text-[#888]'>Product: {r.product.name}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[r.status] || 'bg-gray-100 text-gray-700'}`}>
                        {r.status}
                      </span>
                      {r.reported ? (
                        <span className='text-red-600 text-xs font-medium'>FLAGGED</span>
                      ) : (
                        <span className='text-[#999] text-xs'>No</span>
                      )}
                    </div>
                    {r.status === 'pending' && (
                      <div className='flex gap-2 pt-1'>
                        <button onClick={() => handleUpdateReview(r.id, 'approved')} className='flex-1 text-xs bg-green-500 text-white py-1.5 rounded-md font-medium hover:bg-green-600'>Approve</button>
                        <button onClick={() => handleUpdateReview(r.id, 'rejected')} className='flex-1 text-xs bg-red-500 text-white py-1.5 rounded-md font-medium hover:bg-red-600'>Reject</button>
                        <button onClick={() => handleHideReview(r.id)} className='flex-1 text-xs bg-purple-500 text-white py-1.5 rounded-md font-medium hover:bg-purple-600'>Hide</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {reviewsData.totalPages > 1 && (
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-[#888]'>
                    Page {reviewsPage} of {reviewsData.totalPages} ({reviewsData.total} total)
                  </span>
                  <div className='flex gap-2'>
                    <button
                      disabled={reviewsPage <= 1}
                      onClick={() => setReviewsPage((p) => Math.max(1, p - 1))}
                      className='px-3 py-1.5 bg-white border border-[#ddd] rounded-lg disabled:opacity-50 hover:bg-[#f5f5f5]'
                    >
                      Previous
                    </button>
                    <button
                      disabled={reviewsPage >= reviewsData.totalPages}
                      onClick={() => setReviewsPage((p) => p + 1)}
                      className='px-3 py-1.5 bg-white border border-[#ddd] rounded-lg disabled:opacity-50 hover:bg-[#f5f5f5]'
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
