export type QueryValue = string | number | boolean | null | undefined;

export type ListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: QueryValue;
};

export const toQueryString = (query: ListQuery = {}) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value));
    }
  });

  const result = params.toString();
  return result ? `?${result}` : "";
};

export const createListQuery = <T extends ListQuery>(query: T) => ({
  ...query,
  page: query.page ?? 1,
  limit: query.limit ?? 40,
});
