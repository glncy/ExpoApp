export const transformToPath = (
  pathname: string,
  segments: string[],
  search: {
    [key: string]: string;
  }
) => {
  const searchParams = Object.keys(search);
  let query = "";
  searchParams.forEach((key, index) => {
    const path = `[${key}]`;
    const isExist = segments.includes(path);
    if (!isExist) {
      if (query === "") {
        query += "?";
      }

      query += `${key}=${search[key]}`;
      if (index < searchParams.length - 1) {
        query += "&";
      }
    }
  });
  return pathname + query;
};
