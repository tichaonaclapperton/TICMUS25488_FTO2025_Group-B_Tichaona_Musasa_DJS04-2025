import React from "react";

/**
 * Pagination controls for navigating through multiple pages of podcasts.
 *
 * @component
 * @param {Object} props
 * @param {number} props.page - The current page number.
 * @param {number} props.totalPages - The total number of available pages.
 * @param {Function} props.onPageChange - Callback fired when the user navigates to another page.
 * @returns {JSX.Element} Pagination navigation UI.
 */

export default function Pagination({ page, totalPages, onPageChange }) {
	if (totalPages <= 1) return null;
	return (
		<div className="pagination">
			<button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
				Prev
			</button>
			<span>
				Page {page}/{totalPages}
			</span>
			<button
				disabled={page === totalPages}
				onClick={() => onPageChange(page + 1)}
			>
				Next
			</button>
		</div>
	);
}
