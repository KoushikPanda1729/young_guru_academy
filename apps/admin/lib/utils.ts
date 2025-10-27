/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableQuery } from "@/types/table"
import { subDays, startOfToday } from "date-fns"
import * as xlsx from "xlsx";
import { saveAs } from "file-saver";

export function formatBoolean(value?: boolean) {
  return value ? "Yes" : "No"
}

export const buildQueryParams = (query: Partial<TableQuery>): URLSearchParams => {
  const params = new URLSearchParams()
  for (const key of Object.keys(query) as (keyof TableQuery)[]) {
    const value = query[key]
    if (value !== undefined && value !== null) {
      params.set(key, String(value))
    }
  }
  return params
}

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const isAbsoluteUrl = /^https?:\/\//i.test(url)
  const finalUrl = isAbsoluteUrl ? url : `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`

  const res = await fetch(finalUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    credentials: "include", 
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Request failed: ${res.status}`)
  }

  return res.json()
}

export function getDateRange(preset: string, from?: Date, to?: Date) {
  const today = startOfToday()

  switch (preset) {
    case "7d":
      return { start: subDays(today, 6), end: today, range: "7d" }
    case "30d":
      return { start: subDays(today, 29), end: today, range: "30d" }
    case "90d":
      return { start: subDays(today, 89), end: today, range: "90d" }
    case "total":
      return { start: new Date("2000-01-01"), end: today, range: "total" }
    case "custom":
      return { start: from!, end: to!, range: "custom" }
    default:
      return { start: from!, end: to!, range: "custom" }
  }
}



export function exportToExcel<T extends object[]>(data: T) {
  const workbook = xlsx.utils.book_new();
  const nestedData: Record<string, any[]> = {};
  
  const mainSheetData = data.map((row: any) => {
    const flatRow: Record<string, unknown> = {};
    
    for (const key in row) {
      const value = row[key];
      
      if (isNestedObject(value)) {
        if (!nestedData[key]) {
          nestedData[key] = [];
        }
        nestedData[key].push({ parentId: row.id, ...value });
      } 

      else if (Array.isArray(value) && value.length > 0) {
        if (isNestedObject(value[0])) {
          if (!nestedData[key]) {
            nestedData[key] = [];
          }
          value.forEach((item) => {
            if (isNestedObject(item)) {
              nestedData[key]!.push({ parentId: row.id, ...item });
            }
          });
        } else {
          flatRow[key] = formatValue(value);
        }
      } 
      else {
        flatRow[key] = formatValue(value);
      }
    }
    return flatRow;
  });

  const mainSheet = xlsx.utils.json_to_sheet(mainSheetData, { cellDates: true });
  xlsx.utils.book_append_sheet(workbook, mainSheet, "Report");

  Object.keys(nestedData).forEach(sheetName => {
    if (nestedData[sheetName] && nestedData[sheetName].length > 0) {
      const sheetData = nestedData[sheetName].map(row => formatRow(row));
      const sheet = xlsx.utils.json_to_sheet(sheetData, { cellDates: true });
      xlsx.utils.book_append_sheet(workbook, sheet, capitalize(sheetName));
    }
  });

  // Export the workbook
  const wbout = xlsx.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  const filename = `report.xlsx`;
  saveAs(blob, filename);
}

function isNestedObject(value: unknown): boolean {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === "object" && 
    !Array.isArray(value) && 
    !(value instanceof Date) &&
    // Additional check to ensure it's a plain object with properties
    Object.keys(value as object).length > 0
  );
}

function formatValue(value: unknown) {
  if (value instanceof Date || isDateValue(value)) {
    return parseDate(value);
  }
  if (Array.isArray(value)) {
    // Convert array to string representation for Excel
    return value.map(item => 
      typeof item === 'object' ? JSON.stringify(item) : String(item)
    ).join(', ');
  }
  return value;
}

function formatRow(row: Record<string, unknown>) {
  const newRow: Record<string, unknown> = {};
  for (const key in row) {
    newRow[key] = formatValue(row[key]);
  }
  return newRow;
}

function isDateValue(value: unknown): boolean {
  if (value instanceof Date) return true;
  if (typeof value !== "string" && typeof value !== "number") return false;
  
  const date = new Date(value as string | number);
  return !isNaN(date.getTime());
}

function parseDate(value: unknown): Date | unknown {
  const date = new Date(value as string | number);
  return isNaN(date.getTime()) ? value : date;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}