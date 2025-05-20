import { Suspense } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ContentSection from "@/components/content-section"
import { ContentSkeleton } from "@/components/ui/content-skeleton"
import {
  fetchPopularTVShows,
  fetchTopRatedTVShows,
  fetchOnTheAirTVShows,
  fetchAiringTodayTVShows,
} from "@/lib/fmovies-api"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TV Shows - SuiStream",
  description:
    "Browse our collection of TV shows on SuiStream, the decentralized streaming platform built on Sui blockchain.",
}

export default async function TVShowsPage() {
  // Fetch initial data for each section with error handling
  const [popularTVShows, topRatedTVShows, onTheAirTVShows, airingTodayTVShows] = await Promise.all([
    fetchPopularTVShows().catch((error) => {
      console.error("Error fetching popular TV shows:", error)
      return { results: [], page: 1, total_pages: 1, total_results: 0 }
    }),
    fetchTopRatedTVShows().catch((error) => {
      console.error("Error fetching top rated TV shows:", error)
      return { results: [], page: 1, total_pages: 1, total_results: 0 }
    }),
    fetchOnTheAirTVShows().catch((error) => {
      console.error("Error fetching on the air TV shows:", error)
      return { results: [], page: 1, total_pages: 1, total_results: 0 }
    }),
    fetchAiringTodayTVShows().catch((error) => {
      console.error("Error fetching airing today TV shows:", error)
      return { results: [], page: 1, total_pages: 1, total_results: 0 }
    }),
  ])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container px-4 mx-auto pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">TV Shows</h1>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Popular TV Shows" endpoint="tv/popular" initialData={popularTVShows} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Top Rated" endpoint="tv/top_rated" initialData={topRatedTVShows} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Currently Airing" endpoint="tv/on_the_air" initialData={onTheAirTVShows} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Airing Today" endpoint="tv/airing_today" initialData={airingTodayTVShows} />
        </Suspense>
      </div>

      <Footer />
    </main>
  )
}
