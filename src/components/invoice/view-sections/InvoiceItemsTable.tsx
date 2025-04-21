import { InvoiceItem } from "@/pages/Invoicing";

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
}

export function InvoiceItemsTable({ items }: InvoiceItemsTableProps) {
  // Group items by date
  const groupedItems = items.reduce((groups: { [key: string]: InvoiceItem[] }, item) => {
    const date = item.date || new Date().toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedItems).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="mt-8 mb-8 space-y-8">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-primary">
              {formatDate(date)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {groupedItems[date][0]?.address || 'No address provided'}
            </p>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Description</th>
                <th className="text-right pb-2">Time</th>
                <th className="text-right pb-2">Hours</th>
                <th className="text-right pb-2">Quantity</th>
                <th className="text-right pb-2">Rate</th>
                <th className="text-right pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {groupedItems[date].map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.description}</td>
                  <td className="text-right py-2">
                    {item.startTime && item.endTime 
                      ? `${formatTime(item.startTime)} - ${formatTime(item.endTime)}`
                      : 'N/A'}
                  </td>
                  <td className="text-right py-2">{Number(item.hours || 0).toFixed(2)}</td>
                  <td className="text-right py-2">{Math.round(Number(item.quantity))}</td>
                  <td className="text-right py-2">${item.rate}</td>
                  <td className="text-right py-2">${item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}