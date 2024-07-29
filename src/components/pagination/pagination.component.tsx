import React, { useMemo } from "react";
import { Button } from "../button";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useRouter } from "next/router";

type PaginationProps = {
  currentPage: number;
  maxButtons?: number;
  totalPages?: number; // TODO: 
  onPageChange: (pageNumber: number) => void;
  disableNextButton?: boolean;
};

const Pagination = ({
  onPageChange,
  currentPage,
  disableNextButton,
}: PaginationProps) => {
  return (
    <div className="flex items-center gap-2 justify-center w-full">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        variant="outline"
        disabled={currentPage === 1}
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Prev
      </Button>
      <Button
        disabled={disableNextButton}
        onClick={() => onPageChange(currentPage + 1)}
        variant="outline"
      >
        Next
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

const usePagination = ({ dataPerPage = 15 }: { dataPerPage?: number } = {}) => {
  const router = useRouter();

  const selectedPage = useMemo(() => {
    const parsedPageNumber = Number(router.query["page"]);
    return isNaN(parsedPageNumber) ? 1 : parsedPageNumber;
  }, [router.query]);

  const onPageChange = (page: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  return {
    offset: (selectedPage - 1) * dataPerPage,
    limit: dataPerPage,
    selectedPage,
    onPageChange,
  };
};

export { Pagination, usePagination };
