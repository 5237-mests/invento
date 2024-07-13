// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SaleListItem = ({ sale }: { sale: any }) => {
  const formattedDate = new Date(sale.createdAt).toLocaleDateString();

  return (
    <li className="py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{`Sale ID: ${sale._id}`}</h2>
          <p className="text-sm text-gray-500">{`Shop: ${sale.shop.name}`}</p>
          <p className="text-sm text-gray-500">{`Customer: ${sale.customer ? sale.customer.firstName + ' ' + sale.customer.lastName : 'N/A'}`}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{`Total Amount: $${sale.totalAmount.toFixed(2)}`}</p>
          <p className="text-sm text-gray-500">{`Date: ${formattedDate}`}</p>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-medium">Items:</h3>
        <ul className="mt-1">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {sale.items.map((item: any) => (
            <li key={item._id} className="text-sm text-gray-600">
              {`${item.quantity}x ${item.item.name} - $${(item.price * item.quantity).toFixed(2)}`}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default SaleListItem;
