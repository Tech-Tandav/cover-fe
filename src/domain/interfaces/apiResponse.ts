// DRF default PageNumberPagination shape.
export interface IPaginatedApi<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T;
}

// Backwards-compatible alias.
export type IResponseApi<T> = IPaginatedApi<T>;
