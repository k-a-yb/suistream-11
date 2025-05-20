import { Suspense } from "react"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import ContentSection from "@/components/content-section"
import FeatureSection from "@/components/feature-section"
import Footer from "@/components/footer"
import { ContentSkeleton } from "@/components/ui/content-skeleton"
import { fetchTrending, fetchPopularMovies, fetchPopularTVShows } from "@/lib/fmovies-api"

export default async function Home() {
  // Fetch data in parallel with error handling
  const [trendingData, moviesData, tvShowsData] = await Promise.all([
    fetchTrending().catch((error) => {
      console.error("Error fetching trending data:", error)
      return { results: [], page: 1, total_pages: 1, total_results: 0 }
    }),
    fetchPopularMovies().catch((error) => {
      console.error("Error fetching movies data:", error)
      return { results: [], page: 1, total_pages: 1, total_results: 0 }
    }),
    fetchPopularTVShows().catch((error) => {
      console.error("Error fetching TV shows data:", error)
      return { results: [], page: 1, total_pages: 1, total_results: 0 }
    }),
  ])

  // Get featured content (first trending item with backdrop)
  const featuredContent = trendingData.results.find((item) => item.backdrop_path) ||
    trendingData.results[0] || {
      id: 1,
      title: "SuiStream Exclusive Content",
      backdrop_path: "/placeholder.svg?height=1080&width=1920",
      poster_path: "/placeholder.svg?height=500&width=300",
      overview: "Welcome to SuiStream, the decentralized streaming platform built on Sui blockchain.",
      vote_average: 9.5,
      media_type: "movie",
    }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <Suspense fallback={<div className="h-[60vh] bg-gradient-to-b from-background/80 to-background animate-pulse" />}>
        <HeroSection content={featuredContent} />
      </Suspense>

      <div className="container px-4 mx-auto">
        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Trending Now" endpoint="trending" initialData={trendingData} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Popular Movies" endpoint="movie" initialData={moviesData} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Popular TV Shows" endpoint="tv" initialData={tvShowsData} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection
            title="NFT Exclusive Content"
            endpoint="exclusive"
            filter="exclusive"
            initialData={trendingData}
          />
        </Suspense>
      </div>

      <FeatureSection />
      <Footer />
    </main>
  )
}
