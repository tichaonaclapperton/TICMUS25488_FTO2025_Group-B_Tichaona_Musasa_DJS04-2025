import React from "react";

/**
 * Dropdown for sorting podcasts by date or title.
 *
 * @component
 * @param {Object} props
 * @param {"newest"|"az"|"za"} props.value - The selected sort order.
 * @param {Function} props.onChange - Callback fired when the sort order changes.
 * @returns {JSX.Element} A sort dropdown component.
 */

export default function sortDropdown({ value, onChange }) {
	return (
		<select value={value} onChange={(e) => onChange(e.target.value)}>
			<option value="newest">Newest First</option>
			<option value="az">A-Z</option>
			<option value="za">Z-A</option>
		</select>
	);
}
