import react from 'react';

export default function sortDropdown({value, onChange}){
    return(
        <select value={value} onChange={(e)=> onChange(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
        </select>

    )
}