export const getDynamicSearchParams = async <T>(
  searchParams: T | Promise<T>
): Promise<T> => {
  return searchParams instanceof Promise ? await searchParams : searchParams;
};
