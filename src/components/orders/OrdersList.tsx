
import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderSummary {
  id: string;
  order_code: string;
  created_at: string;
  total_amount: number;
  status: string;
  items_summary: string;
}

interface OrdersListProps {
  orders: OrderSummary[];
}

export const OrdersList = ({ orders }: OrdersListProps) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Code</TableHead>
            <TableHead>Food Items</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.order_code}</TableCell>
              <TableCell className="max-w-xs truncate">{order.items_summary}</TableCell>
              <TableCell>
                {format(new Date(order.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>Rs. {order.total_amount}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/order/${order.id}`}>
                    <FileText className="h-4 w-4 mr-1" /> View Details
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
