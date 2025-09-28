import React from "react";
import { genres } from "../genres/data.js";

/**
 * Dropdown component for filtering podcasts by genre.
 *
 * @component
 * @param {Object} props
 * @param {string} props.value - The currently selected genre title.
 * @param {Function} props.onChange - Callback fired when the genre changes.
 * @returns {JSX.Element} A genre filter dropdown.
 */

export default function GenreFilter({ value, onChange }) {
	return (
		<select value={value} onChange={(e) => onChange(e.target.value)}>
			<option value="">All genres</option>
			{genres.map((g) => (
				<option key={g.id} value={g.title}>
					{g.title}
				</option>
			))}
		</select>
	);
}
