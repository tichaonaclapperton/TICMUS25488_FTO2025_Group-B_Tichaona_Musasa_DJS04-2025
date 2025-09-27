import React, { useEffect, useState, useCallback } from "react";
import PodcastPreviewCard from "./components/PodcastPreviewCard";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import DetailsModal from "./components/DetailsModal";
import GenreFilter from "./utilities/GenreFilter";
import Pagination from "./utilities/Pagination";
import SortDropdown from "./utilities/SortDropdown";
import SearchBar from "./components/SearchBar";
import { genres } from "./genres/data.js";

export default function App() {
	const [podcasts, setPodcasts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selected, setSelected] = useState(null);

	// utilities
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedGenre, setSelectedGenre] = useState("");
	const [sortOrder, setSortOrder] = useState("newest"); // newest | az | za
	const [page, setPage] = useState(1);
	const itemsPerPage = 12;

	const API_URL = "https://podcast-api.netlify.app/";

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		async function fetchPodcasts() {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch(API_URL, { signal });
				if (!res.ok)
					throw new Error(`API error: ${res.status} ${res.statusText}`);
				const data = await res.json();

				const normalized = (Array.isArray(data) ? data : data.shows || []).map(
					(p) => ({
						id:
							p.id?.toString() ?? p.showId?.toString() ?? String(Math.random()),
						title: p.title ?? p.name ?? "Untitled",
						image: p.image ?? p.cover ?? p.artwork ?? "",
						seasons:
							typeof p.seasons === "number"
								? p.seasons
								: Array.isArray(p.seasonDetails)
								? p.seasonDetails.length
								: p.seasonsCount ?? 0,
						genres:
							Array.isArray(p.genres) && p.genres.length
								? p.genres.map(
										(id) =>
											genres.find((g) => g.id === id)?.title || `Genre ${id}`
								  )
								: [],
						updated:
							p.updated ??
							p.lastUpdated ??
							p.modified ??
							p.publishedAt ??
							p.pubDate ??
							p.updatedAt ??
							null,
						description: p.description ?? p.summary ?? "",
					})
				);

				setPodcasts(normalized);
			} catch (err) {
				if (err.name !== "AbortError")
					setError(err.message || "Failed to fetch podcasts");
			} finally {
				setLoading(false);
			}
		}

		fetchPodcasts();
		return () => controller.abort();
	}, []);

	const onCardClick = useCallback((podcast) => setSelected(podcast), []);
	const onCloseModal = useCallback(() => setSelected(null), []);

	// -----------------------------
	// Filtering + Sorting + Pagination
	// -----------------------------
	const filteredPodcasts = podcasts.filter((p) => {
		const matchesSearch =
			p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			p.genres.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()));
		const matchesGenre =
			selectedGenre === "" || p.genres.includes(selectedGenre);
		return matchesSearch && matchesGenre;
	});

	const sortedPodcasts = [...filteredPodcasts].sort((a, b) => {
		if (sortOrder === "newest") {
			return new Date(b.updated) - new Date(a.updated);
		}
		if (sortOrder === "az") {
			return a.title.localeCompare(b.title);
		}
		if (sortOrder === "za") {
			return b.title.localeCompare(a.title);
		}
		return 0;
	});

	// Pagination
	const totalPages = Math.ceil(sortedPodcasts.length / itemsPerPage);
	const startIndex = (page - 1) * itemsPerPage;
	const paginatedPodcasts = sortedPodcasts.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	// Reset page when search/filter/sort changes
	useEffect(() => {
		setPage(1);
	}, [searchTerm, selectedGenre, sortOrder]);

	return (
		<main className="app-container">
			<header className="app-header">
				<h1>Podcast App</h1>
				<SearchBar value={searchTerm} onChange={setSearchTerm} />
				<SortDropdown value={sortOrder} onChange={setSortOrder} />
				<GenreFilter value={selectedGenre} onChange={setSelectedGenre} />
			</header>

			<section className="content">
				{loading && <Loading message="Loading podcasts..." />}
				{error && <ErrorMessage message={error} />}
				{!loading && !error && paginatedPodcasts.length === 0 && (
					<div className="empty">No podcasts found.</div>
				)}
				{!loading && !error && paginatedPodcasts.length > 0 && (
					<div className="grid" role="list">
						{paginatedPodcasts.map((p) => (
							<PodcastPreviewCard
								key={p.id}
								podcast={p}
								onClick={() => onCardClick(p)}
							/>
						))}
					</div>
				)}
			</section>
			<Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

			{selected && <DetailsModal podcast={selected} onClose={onCloseModal} />}
		</main>
	);
}
