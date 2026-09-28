// src/components/ui/Select.jsx
"use client";

import { forwardRef } from "react";
import SearchableSelect from "./SearchableSelect";

const Select = forwardRef((props, ref) => {
  return <SearchableSelect ref={ref} {...props} />;
});

Select.displayName = "Select";

export { Select, SearchableSelect };
export default Select;
