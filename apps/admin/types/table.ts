export type Filter<
  TField extends string = string,
  TValue extends string | number | boolean | Date = string | number | boolean | Date
> = {
  id: TField
  value: TValue
}

export type RangeFilter<TField extends string = string> = {
  id: TField
  value: {
    from: Date | number
    to: Date | number
  }
}

export type AnyFilter<TField extends string = string> =
  | Filter<TField>
  | RangeFilter<TField>


export type Sort<TField extends string = string> = {
  id: TField
  desc: boolean
}

export type TableQuery<TField extends string = string> = {
  page?: number 
  limit?: number 
  tab?: string 
  search?: string
  filters?: AnyFilter<TField>[]
  sort?: Sort<TField>[]
}


export type TableParams<TField extends string = string> = {
  query: TableQuery<TField>
}

export type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export type PaginatedResponse<TData> = {
  data: TData[]
  total: number        
  page: number         
  limit: number     
}

export type PaginatedResponseWithMeta<TData> = {
  data: TData[]
  meta: PaginationMeta
}

export type TableStatus = "idle" | "loading" | "success" | "error"

export interface FilterableField<TField extends string = string> {
  id: TField
  label: string
  type: "text" | "number" | "boolean" | "date"
}



