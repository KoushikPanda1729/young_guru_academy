export const dataTableConfig = {
  textOperators: [
    { label: "Contains", value: "contains" as const },
    { label: "Does not contain", value: "not" as const },
    { label: "Is", value: "equals" as const },
    { label: "Is not", value: "not" as const },
  ],

  numericOperators: [
    { label: "Is", value: "equals" as const },
    { label: "Is not", value: "not" as const },
    { label: "Is less than", value: "lt" as const },
    { label: "Is less than or equal to", value: "lte" as const },
    { label: "Is greater than", value: "gt" as const },
    { label: "Is greater than or equal to", value: "gte" as const },
    { label: "Is between", value: "between" as const },
  ],

  dateOperators: [
    { label: "Is", value: "equals" as const },
    { label: "Is not", value: "not" as const },
    { label: "Is before", value: "lt" as const },
    { label: "Is after", value: "gt" as const },
    { label: "Is on or before", value: "lte" as const },
    { label: "Is on or after", value: "gte" as const },
    { label: "Is between", value: "between" as const },
    { label: "Is relative to today", value: "relative" as const },
  ],

  selectOperators: [
    { label: "Is", value: "equals" as const },
    { label: "Is not", value: "not" as const },
  ],

  multiSelectOperators: [
    { label: "Has any of", value: "in" as const },
    { label: "Has none of", value: "notIn" as const },
  ],

  booleanOperators: [
    { label: "Is", value: "equals" as const },
    { label: "Is not", value: "not" as const },
  ],

  sortOrders: [
    { label: "Asc", value: "asc" as const },
    { label: "Desc", value: "desc" as const },
  ],

  filterVariants: [
    "text",
    "number",
    "range",
    "date",
    "dateRange",
    "boolean",
    "select",
    "multiSelect",
  ] as const,

  operators: [
    "contains",
    "not",
    "equals",
    "in",
    "notIn",
    "lt",
    "lte",
    "gt",
    "gte",
    "between",
    "relative",
  ] as const,

  joinOperators: ["and", "or"] as const,
};

export type DataTableConfig = typeof dataTableConfig;
