import React from "react";

export interface Language {
  code: string;
  name: string;
  Flag: React.ComponentType<{ className?: string }>;
  flagCode: string;
}
