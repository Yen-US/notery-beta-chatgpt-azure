import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const useApiGPT = <T>() => {
  const url = '/api/note'
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const callApi = useCallback(async (message:string) => {
      setLoading(true);
      try {
        const response: AxiosResponse<T> = await axios({
          method: 'post',
          url: url,
          data: {
            content: message
          }
        })
        setData(response.data);
      } catch (error) {
        setError(error as Error);
      }
      setLoading(false);
    }, []);

  return { callApi, data, error, loading };
}