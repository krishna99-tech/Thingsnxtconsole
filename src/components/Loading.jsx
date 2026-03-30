import React from "react";
import { Spinner } from "@heroui/react";

export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <Spinner size="lg" color="primary" label="Loading..." />
    </div>
  );
};
