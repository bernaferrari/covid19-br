import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { loadDataIntoCache } from "../utils/fetcher";

const GetCovidDataComp = ({ children }: PropsWithChildren) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void loadDataIntoCache()
      .then(() => setIsReady(true))
      .catch(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-[512px] w-full rounded-lg">
        <div className="m-auto flex flex-col items-center">
          <div className="size-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <div className="h-4" />
          <p className="text-sm text-gray-600">carregando os dados...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default GetCovidDataComp;
