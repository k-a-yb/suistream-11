import { Suspense } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ContentSection from "@/components/content-section"
import { ContentSkeleton } from "@/components/ui/content-skeleton"
import { fetchPopularMovies, fetchTopRatedMovies, fetchUpcomingMovies, fetchNowPlayingMovies } from "@/lib/fmovies-api"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Movies - SuiStream",
  description:
    "Browse our collection of movies on SuiStream, the decentralized streaming platform built on Sui blockchain.",
}

export default async function MoviesPage() {
  // Fetch initial data for each section with error handling
  const [popularMovies, topRatedMovies, upcomingMovies, nowPlayingMovies] = await Promise.all([
    fetchPopularMovies().catch((error) => {
      console.error("Error fetching popular movies:", error)
      return { results: [], page: 1, total_pages: 1, total_results: 0 }
    }),
    fetchTopRatedMovies().catch((error) => {
      console.error("Error fetching top rated movies:", error)
      return { results: [], page: 1, total_pages: 1, total_results: 0 }
    }),
    fetchUpcomingMovies().catch((error) => {
      console.error("Error fetching upcoming movies:", error)
      return { results: [], page: 1, total_pages: 1, total_results: 0 }
    }),
    fetchNowPlayingMovies().catch((error) => {
      console.error("Error fetching now playing movies:", error)
      return { results: [], page: 1, total_pages: 1, total_results: 0 }
    }),
  ])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container px-4 mx-auto pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">Movies</h1>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Popular Movies" endpoint="movie/popular" initialData={popularMovies} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Top Rated" endpoint="movie/top_rated" initialData={topRatedMovies} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Upcoming" endpoint="movie/upcoming" initialData={upcomingMovies} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Now Playing" endpoint="movie/now_playing" initialData={nowPlayingMovies} />
        </Suspense>
      </div>

      <Footer />
    </main>
  )
}
