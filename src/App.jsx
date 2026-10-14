
import { useState } from "react";
import "./index.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE = "https://image.tmdb.org/t/p/w500";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchMovies(e) {
    e.preventDefault();
    if (!query.trim()) return;

    if (!API_KEY) {
      setError("TMDB API key .env file mein set karo.");
      return;
    }

    setLoading(true);
    setError("");
    setSelected(null);
    setMovies([]);

    try {
      const url = new URL("https://api.themoviedb.org/3/search/movie");
      url.search = new URLSearchParams({
        query: query.trim(),
        include_adult: "false",
        language: "en-US",
        page: "1",
      });

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Movie search failed. API key check karo.");

      const data = await response.json();
      setMovies(data.results || []);
    } catch (err) {
      setError(err.message || "Movies load nahi hui.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-pink-400">YOUR MOVIE HUB</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Movie Explorer 🎬
          </h1>
          <p className="mt-2 text-slate-400">
            Find movies, explore ratings and discover stories.
          </p>
        </header>

        <form onSubmit={searchMovies} className="mb-8 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-pink-500"
          />
          <button
            disabled={loading}
            className="rounded-xl bg-pink-600 px-5 py-3 font-semibold hover:bg-pink-500 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className="mb-6 text-red-400">{error}</p>}

        {selected && (
          <section className="mb-8 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:flex-row">
            {selected.poster_path && (
              <img
                src={`${IMAGE}${selected.poster_path}`}
                alt={`${selected.title} poster`}
                className="w-36 rounded-xl object-cover"
              />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{selected.title}</h2>
              <p className="mt-2 text-sm text-slate-400">
                Release: {selected.release_date || "Unknown"} · ⭐{" "}
                {Number(selected.vote_average || 0).toFixed(1)}/10
              </p>
              <p className="mt-4 text-slate-300">
                {selected.overview || "No overview available."}
              </p>
              <button
                onClick={() => setSelected(null)}
                className="mt-4 text-pink-400 hover:underline"
              >
                Close details
              </button>
            </div>
          </section>
        )}

        {loading && <p className="text-slate-400">Finding movies...</p>}

        {!loading && movies.length === 0 && !error && (
          <p className="py-10 text-center text-slate-400">
            Search for a movie to get started.
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie) => (
            <button
              key={movie.id}
              onClick={() => setSelected(movie)}
              className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 text-left transition hover:-translate-y-1 hover:border-pink-500"
            >
              {movie.poster_path ? (
                <img
                  src={`${IMAGE}${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                  loading="lazy"
                  className="aspect-[2/3] w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[2/3] place-items-center p-3 text-slate-500">
                  No poster
                </div>
              )}
              <div className="p-3">
                <h2 className="line-clamp-2 font-semibold">{movie.title}</h2>
                <p className="mt-2 text-sm text-slate-400">
                  {movie.release_date?.slice(0, 4) || "Year N/A"} · ⭐{" "}
                  {Number(movie.vote_average || 0).toFixed(1)}
                </p>
              </div>
            </button>
          ))}
        </div>

        <footer className="mt-10 text-center text-xs text-slate-500">
          Movie data provided by TMDB. This project is not endorsed or certified by TMDB.
        </footer>
      </div>
    </main>
  );
}
