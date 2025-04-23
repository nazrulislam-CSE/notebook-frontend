export const fetchData = async (endpoint: string) => {
  try {
    endpoint = `http://127.0.0.1:8000/api/${endpoint}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
};