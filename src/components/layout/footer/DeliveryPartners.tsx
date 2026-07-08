const partners = ['Pathao', 'RedX', 'Steadfast', 'Sundarban', 'Paperfly'];

export function DeliveryPartners() {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-900 mb-3 text-center md:text-left">
        Delivery Partners
      </h4>
      <div className="flex flex-row flex-wrap justify-center md:justify-start items-center gap-2">
        {partners.map((partner) => (
          <span
            key={partner}
            className="inline-flex items-center h-8 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 hover:border-gray-300 transition-colors"
          >
            {partner}
          </span>
        ))}
      </div>
    </div>
  );
}
