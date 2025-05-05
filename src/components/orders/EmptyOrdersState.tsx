
import React from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmptyOrdersState = () => {
  return (
    <div className="text-center py-12 border rounded-lg bg-gray-50">
      <Package className="h-12 w-12 mx-auto text-gray-400" />
      <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
      <p className="mt-2 text-gray-600">You haven't placed any orders with us yet.</p>
      <Button asChild className="mt-6 bg-kitchenia-orange hover:bg-orange-600">
        <Link to="/menu">Browse Our Menu</Link>
      </Button>
    </div>
  );
};
