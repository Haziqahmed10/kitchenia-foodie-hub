
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusMap: Record<string, { color: string; label: string }> = {
    'preparing': { color: 'bg-yellow-100 text-yellow-800', label: 'Preparing' },
    'out for delivery': { color: 'bg-blue-100 text-blue-800', label: 'Out for Delivery' },
    'delivered': { color: 'bg-green-100 text-green-800', label: 'Delivered' },
    'cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    'pending': { color: 'bg-gray-100 text-gray-800', label: 'Pending' }
  };
  
  const defaultStatus = { 
    color: 'bg-gray-100 text-gray-800', 
    label: status.charAt(0).toUpperCase() + status.slice(1) 
  };
  
  const statusStyle = statusMap[status.toLowerCase()] || defaultStatus;
  
  return <Badge className={statusStyle.color}>{statusStyle.label}</Badge>;
};
