
import React from "react";

export const LoadingState = () => {
  return (
    <div className="section-container py-12 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kitchenia-orange mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    </div>
  );
};
