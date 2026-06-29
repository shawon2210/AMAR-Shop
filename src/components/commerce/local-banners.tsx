export function LocalBanners() {
  return (
    <section className="mt-lg px-container-margin grid grid-cols-1 sm:grid-cols-2 gap-md">
      <div className="bg-tertiary-container text-white p-md rounded-xl flex items-center justify-between overflow-hidden relative cursor-pointer active:scale-95 transition-transform">
        <div>
          <h4 className="font-title-sm text-title-sm">ফ্রি শিপিং</h4>
          <p className="text-[10px] opacity-90">Free Shipping on All Orders Over ৳500</p>
        </div>
        <span className="material-symbols-outlined text-4xl opacity-20 absolute -right-2 -bottom-2">local_shipping</span>
      </div>
      <div className="bg-primary-container text-white p-md rounded-xl flex items-center justify-between overflow-hidden relative cursor-pointer active:scale-95 transition-transform">
        <div>
          <h4 className="font-title-sm text-title-sm">ক্যাশ অন ডেলিভারি</h4>
          <p className="text-[10px] opacity-90">Cash on Delivery Available Nationwide</p>
        </div>
        <span className="material-symbols-outlined text-4xl opacity-20 absolute -right-2 -bottom-2">payments</span>
      </div>
    </section>
  );
}
