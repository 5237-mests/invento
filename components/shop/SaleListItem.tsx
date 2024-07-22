import axios from 'axios';

const SaleListItem = ({
  sale,
}: {
  sale: {
    _id: string;
    createdAt: Date;
    shop: { name: string };
    customer: { firstName: string; lastName: string } | null;
    items: { item: { name: string; price: number }; quantity: number }[];
    totalAmount: number;
  };
}) => {
  // format the date with time
  const formattedDate = new Date(sale.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const deleteSale = async (id: string) => {
    try {
      await axios.delete(`/api/sales/?id=${id}`);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  return (
    <li className="py-4 hover:p-1">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl">{`Sale ID: ${sale._id}`}</h2>
          <p className="text-sm text-gray-500">{`Shop: ${sale.shop.name}`}</p>
          <p className="text-sm text-gray-500">{`Customer: ${sale.customer ? sale.customer.firstName + ' ' + sale.customer.lastName : 'N/A'}`}</p>
        </div>
        <div className="text-right">
          {/* //delete sale */}
          <button className="text-red-500" onClick={() => deleteSale(sale._id)}>
            Delete
          </button>

          {/* <p className="text-sm text-gray-500">{`Total Items: ${sale.totalItems}`}</p> */}
          <p className="text-sm text-gray-500">{`Total Amount: ${sale.totalAmount.toFixed(2)} br`}</p>
          <p className="text-sm text-gray-500">{`Date: ${formattedDate}`}</p>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-medium">Items:</h3>
        <ul className="mt-1">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {sale?.items?.map((item: any) => (
            <li key={item._id} className="text-sm text-gray-600">
              {`${item?.quantity}x ${item?.item?.name} - $${(item?.price * item?.quantity).toFixed(2)}`}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default SaleListItem;
