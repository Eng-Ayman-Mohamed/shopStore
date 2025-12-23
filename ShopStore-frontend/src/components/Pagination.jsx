import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}) => {
  // Debug logging to understand what's happening
  console.log("Pagination props:", {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  });

  // Always render pagination for consistency, but disable if only one page
  const isDisabled = totalPages <= 1;

  const handlePrevious = () => {
    if (hasPrevPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Show 5 page numbers at most
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    // Adjust start if we're near the end
    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className="pagination"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        marginTop: "20px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={!hasPrevPage}
        style={{
          padding: "8px 12px",
          border: "1px solid #ddd",
          backgroundColor: hasPrevPage ? "#fff" : "#f5f5f5",
          color: hasPrevPage ? "#333" : "#999",
          cursor: hasPrevPage ? "pointer" : "not-allowed",
          borderRadius: "4px",
          fontSize: "14px",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          if (hasPrevPage) {
            e.target.style.backgroundColor = "#f0f0f0";
          }
        }}
        onMouseOut={(e) => {
          if (hasPrevPage) {
            e.target.style.backgroundColor = "#fff";
          }
        }}
      >
        ← Previous
      </button>

      {/* First page if needed */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => handlePageClick(1)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              backgroundColor: currentPage === 1 ? "#007bff" : "#fff",
              color: currentPage === 1 ? "#fff" : "#333",
              cursor: "pointer",
              borderRadius: "4px",
              fontSize: "14px",
              transition: "all 0.2s",
            }}
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span style={{ color: "#999" }}>...</span>}
        </>
      )}

      {/* Page numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            backgroundColor: currentPage === page ? "#007bff" : "#fff",
            color: currentPage === page ? "#fff" : "#333",
            cursor: "pointer",
            borderRadius: "4px",
            fontSize: "14px",
            transition: "all 0.2s",
            minWidth: "40px",
          }}
          onMouseOver={(e) => {
            if (currentPage !== page) {
              e.target.style.backgroundColor = "#f0f0f0";
            }
          }}
          onMouseOut={(e) => {
            if (currentPage !== page) {
              e.target.style.backgroundColor = "#fff";
            }
          }}
        >
          {page}
        </button>
      ))}

      {/* Last page if needed */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span style={{ color: "#999" }}>...</span>
          )}
          <button
            onClick={() => handlePageClick(totalPages)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              backgroundColor: currentPage === totalPages ? "#007bff" : "#fff",
              color: currentPage === totalPages ? "#fff" : "#333",
              cursor: "pointer",
              borderRadius: "4px",
              fontSize: "14px",
              transition: "all 0.2s",
            }}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!hasNextPage}
        style={{
          padding: "8px 12px",
          border: "1px solid #ddd",
          backgroundColor: hasNextPage ? "#fff" : "#f5f5f5",
          color: hasNextPage ? "#333" : "#999",
          cursor: hasNextPage ? "pointer" : "not-allowed",
          borderRadius: "4px",
          fontSize: "14px",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          if (hasNextPage) {
            e.target.style.backgroundColor = "#f0f0f0";
          }
        }}
        onMouseOut={(e) => {
          if (hasNextPage) {
            e.target.style.backgroundColor = "#fff";
          }
        }}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
