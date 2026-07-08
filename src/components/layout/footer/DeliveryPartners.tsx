const partners = ['Pathao', 'RedX', 'Steadfast', 'Sundarban', 'Paperfly'];

export function DeliveryPartners() {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-900 mb-3">
        Delivery Partners
      </h4>
      <div className="flex flex-wrap items-center gap-2">
        {partners.map((partner) => (
          <span
            key={partner}
            className="inline-flex items-center h-8 px-3 rounded-md border border-gray-200 bg-gray-50 text-xs font-medium text-gray-500"
          >
            {partner}
          </span>
        ))}
      </div>
    </div>
  );
}
