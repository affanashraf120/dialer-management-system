import { createContext, useContext } from "react";

type TPagePropsContext<T> = T;

const PagePropsContext = createContext<any | undefined>(undefined);

type PagePropsContextProviderProps<T> = {
  initialProps: TPagePropsContext<T>;
  children: React.ReactNode;
};

export function PagePropsProvider<T>({
  initialProps,
  children,
}: PagePropsContextProviderProps<T>) {
  return (
    <PagePropsContext.Provider value={initialProps}>
      {children}
    </PagePropsContext.Provider>
  );
}

export function usePageProps<T>(): TPagePropsContext<T> {
  const context = useContext(PagePropsContext);
  if (!context) {
    throw new Error(
      "usePagePropsContext must be used within a PagePropsContextProvider"
    );
  }
  return context;
}
