import { useSearchParams } from "next/navigation";

type PaginationParamKey = "perPage" | "page";

/**
 * A custom hook for retrieving and validating pagination parameters from URL search params.
 * 
 * @returns {Function} getPaginationParam - A function to retrieve and validate pagination parameters.
 * 
 * @example
 * const getPaginationParam = usePaginationParam();
 * const perPage = getPaginationParam("perPage", 10, 100);
 * const page = getPaginationParam("page", 1);
 */
export function usePaginationParam() {
  const searchParams = useSearchParams();

  /**
   * Retrieves and validates a pagination parameter from the search params.
   * 
   * @param {PaginationParamKey} key - The key of the parameter to retrieve ("perPage" or "page").
   * @param {number} defaultValue - The default value to return if the parameter is invalid or not present.
   * @param {number} [max=-1] - The maximum allowed value for the parameter. If -1, no maximum is enforced.
   * @returns {number} The validated parameter value or the default value if invalid.
   */
  const getPaginationParam = (
    key: PaginationParamKey,
    defaultValue: number,
    max = -1,
  ) => {
    const _value = parseInt(
      searchParams.get(key) ?? defaultValue.toString(),
      10,
    );

    if (isNaN(_value) || _value < 0 || (max !== -1 && _value > max)) {
      return defaultValue;
    }

    return _value;
  };

  return getPaginationParam;
}
