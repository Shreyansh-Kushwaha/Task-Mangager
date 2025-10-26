// src/components/Pagination.js
import React from 'react';

const Pagination = ({ page, pages, setPage }) => {
  if (pages <= 1) return null;

  const handleClick = (num) => setPage(num);

  return (
    <nav>
      <ul className="pagination">
        {[...Array(pages)].map((_, i) => (
          <li
            key={i}
            className={`page-item ${page === i + 1 ? 'active' : ''}`}
            onClick={() => handleClick(i + 1)}
          >
            <button className="page-link">{i + 1}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
