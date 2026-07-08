const partners = ['Pathao', 'RedX', 'Steadfast', 'Sundarban', 'Paperfly'];

export function DeliveryPartners() {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-900 mb-2.5">
        Delivery Partners
      </h4>
      <div className="flex flex-row flex-nowrap items-center gap-1.5 overflow-x-auto pb-1">
        {partners.map((partner) => (
          <span
            key={partner}
            className="inline-flex items-center h-7 px-2.5 rounded-md border border-gray-200 bg-gray-50 text-[11px] font-medium text-gray-500 whitespace-nowrap shrink-0"
          >
            {partner}
          </span>
        ))}
      </div>
    </div>
  );
}
