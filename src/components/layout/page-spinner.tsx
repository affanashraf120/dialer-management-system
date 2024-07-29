import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";

const PageSpinner = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };
    const handleComplete = () => {
      setLoading(false);
    };
    router.events.on("routeChangeStart", (as, { shallow }) => {
      if (!shallow) {
        handleStart();
      }
    });
    router.events.on("routeChangeComplete", (as, { shallow }) => {
      if (!shallow) {
        handleComplete();
      }
    });
    router.events.on("routeChangeError", (as, { shallow }) => {
      if (!shallow) {
        handleComplete();
      }
    });

    return () => {
      router.events.off("routeChangeStart", (as, { shallow }) => {
        if (!shallow) {
          handleStart();
        }
      });
      router.events.off("routeChangeComplete", (as, { shallow }) => {
        if (!shallow) {
          handleComplete();
        }
      });
      router.events.off("routeChangeError", (as, { shallow }) => {
        if (!shallow) {
          handleComplete();
        }
      });
    };
  }, [router.events]);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed w-full h-screen top-0 left-0 bg-background/40 z-[100] flex items-center justify-center backdrop-blur-sm">
      <Loader2
        size={80}
        className="animate-spin"
      />
    </div>
  );
};

export default PageSpinner;
