import React from "react";
import {genres} from "../genres/data.js";

export default function GenreFilter({value, onChange}){
    return(
        <select value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">All genres</option>
            {genres.map((g) =>(
                <option key={g.id} value={g.title}>
                    {g.title}
                </option>
            ))}
        </select>

    );
}