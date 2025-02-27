type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pageLimit = 3; // Number of pages to show around the current page

  const generatePageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    // If there's only one page, return an array with just that page
    if (totalPages <= 1) {
      return [1];
    }

    // Add first page
    pageNumbers.push(1);

    if (currentPage > pageLimit + 1) {
      // Add '...' if there are pages between 1 and the currentPage range
      pageNumbers.push('prev');
    }

    // Calculate the start and end of the range around the current page
    const startPage = Math.max(2, currentPage - pageLimit);
    const endPage = Math.min(totalPages - 1, currentPage + pageLimit);

    // Add the range of pages around the current page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - pageLimit) {
      // Add '...' if there are pages between the currentPage range and the last page
      pageNumbers.push('next');
    }

    // Add last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page === currentPage) {
      // Don't trigger API call if the clicked page is the current page
      return;
    }

    if (typeof page === 'number') {
      onPageChange(page);
    } else if (page === 'prev') {
      // Go to the first page of the previous range (jump back by pageLimit)
      onPageChange(Math.max(1, currentPage - pageLimit));
    } else if (page === 'next') {
      // Go to the first page of the next range (jump forward by pageLimit)
      onPageChange(Math.min(totalPages, currentPage + pageLimit));
    }
  };

  return (
    <div className="pagination flex justify-center gap-2 mt-4 mb-4">
      <button
        className={`px-3 py-1 ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {generatePageNumbers().map((page, index) => (
        <button
          key={typeof page === 'number' ? page : `ellipsis-${index}`} // Ensure unique keys
          className={`px-3 py-1 ${
            page === currentPage ? 'bg-primary text-white' : ''
          }`}
          onClick={() => handlePageClick(page)}
        >
          {typeof page === 'string' ? '...' : page}
        </button>
      ))}

      <button
        className={`px-3 py-1 ${
          currentPage === totalPages ? 'cursor-not-allowed' : ''
        }`}
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
