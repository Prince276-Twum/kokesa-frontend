// components/ui/Pagination.tsx
import React, { useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  showQuickNav?: boolean;
  className?: string;
  showItemCount?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 7,
  totalItems,
  itemsPerPage = 10,
  showQuickNav = false,
  className = "",
  showItemCount = false,
}) => {
  const safeCurrentPage = useMemo(
    () => Math.max(1, Math.min(currentPage, totalPages || 1)),
    [currentPage, totalPages]
  );

  const itemRange = useMemo(() => {
    if (!totalItems) return null;

    const start = (safeCurrentPage - 1) * itemsPerPage + 1;
    const end = Math.min(safeCurrentPage * itemsPerPage, totalItems);

    return { start, end };
  }, [safeCurrentPage, itemsPerPage, totalItems]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const sidePages = Math.floor((maxVisiblePages - 3) / 2);

    pages.push(1);

    if (safeCurrentPage - sidePages > 2) {
      pages.push("ellipsis-start");
    }

    const rangeStart = Math.max(2, safeCurrentPage - sidePages);
    const rangeEnd = Math.min(totalPages - 1, safeCurrentPage + sidePages);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (safeCurrentPage + sidePages < totalPages - 1) {
      pages.push("ellipsis-end");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [totalPages, maxVisiblePages, safeCurrentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page !== safeCurrentPage && page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    },
    [onPageChange, safeCurrentPage, totalPages]
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between w-full">
        <div className="flex-1 flex items-center justify-between">
          {showItemCount && itemRange && (
            <p className="text-sm text-gray-550">
              Showing <span className="font-medium">{itemRange.start}</span> to{" "}
              <span className="font-medium">{itemRange.end}</span> of{" "}
              <span className="font-medium">{totalItems}</span> results
            </p>
          )}

          <nav
            className="relative z-0 inline-flex -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} className="mr-1" />
              <span className="hidden md:inline">Previous</span>
            </button>

            {showQuickNav && (
              <button
                onClick={() => handlePageChange(1)}
                disabled={safeCurrentPage === 1}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="First page"
              >
                First
              </button>
            )}

            <div className="hidden md:flex">
              {pageNumbers.map((page, index) => {
                if (page === "ellipsis-start" || page === "ellipsis-end") {
                  return (
                    <span
                      key={`${page}-${index}`}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  );
                }

                const pageNum = page as number;
                const isActive = pageNum === safeCurrentPage;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      isActive
                        ? "z-10 bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    } text-sm font-medium`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Mobile page indicator (only shown on small screens) */}
            <span className="md:hidden relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              {safeCurrentPage} / {totalPages}
            </span>

            {showQuickNav && (
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={safeCurrentPage === totalPages}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Last page"
              >
                Last
              </button>
            )}

            <button
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <span className="hidden md:inline">Next</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile pagination controls */}
      <div className="flex items-center justify-between sm:hidden p-3 border-t border-gray-200">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} className="mr-1" /> Prev
        </button>

        <p className="text-sm text-gray-500">
          <span className="font-medium">{safeCurrentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>

        <button
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          Next <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
