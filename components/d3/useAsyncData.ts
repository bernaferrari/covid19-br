import { useEffect, useState } from "react";

type AsyncState<T> =
  | { status: "loading"; data?: undefined; error?: undefined }
  | { status: "ready"; data: T; error?: undefined }
  | { status: "error"; data?: undefined; error: Error };

const toError = (error: unknown) => (error instanceof Error ? error : new Error(String(error)));

export const useAsyncData = <T>(load: () => Promise<T>): AsyncState<T> => {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

  useEffect(() => {
    let isMounted = true;

    load()
      .then((data) => {
        if (isMounted) setState({ status: "ready", data });
      })
      .catch((error: unknown) => {
        if (isMounted) setState({ status: "error", error: toError(error) });
      });

    return () => {
      isMounted = false;
    };
  }, [load]);

  return state;
};
