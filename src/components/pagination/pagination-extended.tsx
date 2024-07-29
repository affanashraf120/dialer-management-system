import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "..";

interface PaginationProps {
  currentPage: number;
  maxButtons?: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const PaginationExtended = ({
  currentPage,
  maxButtons = 5,
  onPageChange,
  totalPages,
}: PaginationProps) => {
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber !== currentPage) {
      onPageChange(pageNumber);
    }
  };

  const renderPaginationButtons = () => {
    const buttons: React.ReactNode[] = [];

    let startPage: number;
    let endPage: number;

    if (totalPages <= maxButtons) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= Math.ceil(maxButtons / 2)) {
        startPage = 1;
        endPage = maxButtons;
      } else if (currentPage >= totalPages - Math.floor(maxButtons / 2)) {
        startPage = totalPages - maxButtons + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - Math.floor(maxButtons / 2);
        endPage = currentPage + Math.ceil(maxButtons / 2) - 1;
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <Button
          size={"sm"}
          variant={page === currentPage ? "default" : "outline"}
          key={page}
          onClick={() => handlePageChange(page)}
        >
          {page < 10 ? `0${page}` : page}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex items-center gap-1 max-w-fit">
      <Button
        size="sm"
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={3} />
      </Button>
      {renderPaginationButtons()}
      <Button
        size="sm"
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" strokeWidth={3} />
      </Button>
    </div>
  );
};

export { PaginationExtended };
