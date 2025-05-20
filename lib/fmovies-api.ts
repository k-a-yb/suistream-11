// FMovies API integration with fallback mechanisms
const API_BASE_URL = "https://fmoviesapi.azurewebsites.net/api"

// Fallback data for when the API is unavailable
import { fallbackMovies, fallbackTVShows, fallbackTrending } from "@/lib/fallback-data"

export interface FMovieItem {
  id: string
  title: string
  year: string
  poster: string
  backdrop?: string
  type: "movie" | "tv"
  description?: string
  rating?: number
  duration?: string
  genres?: string[]
  streamingUrl?: string
}

export interface FMovieResponse {
  results: FMovieItem[]
  page: number
  totalPages: number
}

// Convert FMovieItem to our ContentItem format
export const convertToContentItem = (item: FMovieItem) => {
  return {
    id: Number.parseInt(item.id) || Math.floor(Math.random() * 10000),
    title: item.title,
    poster_path: item.poster,
    backdrop_path: item.backdrop || item.poster,
    overview: item.description || `${item.title} (${item.year})`,
    vote_average: item.rating || Math.floor(Math.random() * 10) / 2 + 5, // Random rating between 5-10
    media_type: item.type,
    release_date: item.year ? `${item.year}-01-01` : undefined,
    first_air_date: item.type === "tv" ? `${item.year}-01-01` : undefined,
    streamingUrl: item.streamingUrl,
    // Add SuiStream specific properties
    isExclusive: Math.random() > 0.7, // 30% chance of being exclusive
    price: calculatePrice(item.rating || 7),
  }
}

// Helper function to calculate price based on rating
const calculatePrice = (rating: number): string => {
  if (rating >= 8) return "40"
  if (rating >= 7) return "25"
  if (rating >= 6) return "15"
  return "10"
}

// Enhanced fetch function with error handling and retries
async function fetchWithFallback(url: string, options = {}, fallbackData: any = null) {
  const requestOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  }

  try {
    // Try to fetch from the API with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(url, {
      ...requestOptions,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.warn(`Error fetching from ${url}:`, error)

    // If fallback data is provided, use it
    if (fallbackData) {
      console.info("Using fallback data")
      return fallbackData
    }

    // Otherwise, throw the error
    throw error
  }
}

// Fetch trending content
export async function fetchTrending(): Promise<any> {
  try {
    const data = await fetchWithFallback(`${API_BASE_URL}/trending`, {}, { results: fallbackTrending })

    const results = data.results.map(convertToContentItem)

    return {
      results,
      page: data.page || 1,
      total_pages: data.totalPages || 1,
      total_results: results.length,
    }
  } catch (error) {
    console.error("Error in fetchTrending:", error)

    // Return fallback data in a format compatible with the app
    const results = fallbackTrending.map(convertToContentItem)
    return {
      results,
      page: 1,
      total_pages: 1,
      total_results: results.length,
    }
  }
}

// Fetch popular movies
export async function fetchPopularMovies(): Promise<any> {
  try {
    const data = await fetchWithFallback(
      `${API_BASE_URL}/movies/popular`,
      {},
      { results: fallbackMovies.filter((m) => m.type === "movie") },
    )

    const results = data.results.filter((item: FMovieItem) => item.type === "movie").map(convertToContentItem)

    return {
      results,
      page: data.page || 1,
      total_pages: data.totalPages || 1,
      total_results: results.length,
    }
  } catch (error) {
    console.error("Error in fetchPopularMovies:", error)

    // Return fallback data
    const results = fallbackMovies.filter((m) => m.type === "movie").map(convertToContentItem)

    return {
      results,
      page: 1,
      total_pages: 1,
      total_results: results.length,
    }
  }
}

// Fetch top rated movies
export async function fetchTopRatedMovies(): Promise<any> {
  try {
    const data = await fetchWithFallback(
      `${API_BASE_URL}/movies/top-rated`,
      {},
      { results: fallbackMovies.filter((m) => m.type === "movie" && m.rating >= 8) },
    )

    const results = data.results.filter((item: FMovieItem) => item.type === "movie").map(convertToContentItem)

    return {
      results,
      page: data.page || 1,
      total_pages: data.totalPages || 1,
      total_results: results.length,
    }
  } catch (error) {
    console.error("Error in fetchTopRatedMovies:", error)

    // Return fallback data
    const results = fallbackMovies.filter((m) => m.type === "movie" && m.rating >= 8).map(convertToContentItem)

    return {
      results,
      page: 1,
      total_pages: 1,
      total_results: results.length,
    }
  }
}

// Fetch upcoming movies
export async function fetchUpcomingMovies(): Promise<any> {
  try {
    const data = await fetchWithFallback(
      `${API_BASE_URL}/movies/upcoming`,
      {},
      { results: fallbackMovies.filter((m) => m.type === "movie") },
    )

    const results = data.results.filter((item: FMovieItem) => item.type === "movie").map(convertToContentItem)

    return {
      results,
      page: data.page || 1,
      total_pages: data.totalPages || 1,
      total_results: results.length,
    }
  } catch (error) {
    console.error("Error in fetchUpcomingMovies:", error)

    // Return fallback data
    const results = fallbackMovies.filter((m) => m.type === "movie").map(convertToContentItem)

    return {
      results,
      page: 1,
      total_pages: 1,
      total_results: results.length,
    }
  }
}

// Fetch now playing movies
export async function fetchNowPlayingMovies(): Promise<any> {
  try {
    const data = await fetchWithFallback(
      `${API_BASE_URL}/movies/now-playing`,
      {},
      { results: fallbackMovies.filter((m) => m.type === "movie") },
    )

    const results = data.results.filter((item: FMovieItem) => item.type === "movie").map(convertToContentItem)

    return {
      results,
      page: data.page || 1,
      total_pages: data.totalPages || 1,
      total_results: results.length,
    }
  } catch (error) {
    console.error("Error in fetchNowPlayingMovies:", error)

    // Return fallback data
    const results = fallbackMovies.filter((m) => m.type === "movie").map(convertToContentItem)

    return {
      results,
      page: 1,
      total_pages: 1,
      total_results: results.length,
    }
  }
}

// Fetch popular TV shows
export async function fetchPopularTVShows(): Promise<any> {
  try {
    const data = await fetchWithFallback(
      `${API_BASE_URL}/tv/popular`,
      {},
      { results: fallbackTVShows.filter((m) => m.type === "tv") },
    )

    const results = data.results.filter((item: FMovieItem) => item.type === "tv").map(convertToContentItem)

    return {
      results,
      page: data.page || 1,
      total_pages: data.totalPages || 1,
      total_results: results.length,
    }
  } catch (error) {
    console.error("Error in fetchPopularTVShows:", error)

    // Return fallback data
    const results = fallbackTVShows.filter((m) => m.type === "tv").map(convertToContentItem)

    return {
      results,
      page: 1,
      total_pages: 1,
      total_results: results.length,
    }
  }
}

// Fetch top rated TV shows
export async function fetchTopRatedTVShows(): Promise<any> {
  try {
    const data = await fetchWithFallback(
      `${API_BASE_URL}/tv/top-rated`,
      {},
      { results: fallbackTVShows.filter((m) => m.type === "tv" && m.rating >= 8) },
    )

    const results = data.results.filter((item: FMovieItem) => item.type === "tv").map(convertToContentItem)

    return {
      results,
      page: data.page || 1,
      total_pages: data.totalPages || 1,
      total_results: results.length,
    }
  } catch (error) {
    console.error("Error in fetchTopRatedTVShows:", error)

    // Return fallback data
    const results = fallbackTVShows.filter((m) => m.type === "tv" && m.rating >= 8).map(convertToContentItem)

    return {
      results,
      page: 1,
      total_pages: 1,
      total_results: results.length,
    }
  }
}

// Fetch on the air TV shows
export async function fetchOnTheAirTVShows(): Promise<any> {
  try {
    const data = await fetchWithFallback(
      `${API_BASE_URL}/tv/on-the-air`,
      {},
      { results: fallbackTVShows.filter((m) => m.type === "tv") },
    )

    const results = data.results.filter((item: FMovieItem) => item.type === "tv").map(convertToContentItem)

    return {
      results,
      page: data.page || 1,
      total_pages: data.totalPages || 1,
      total_results: results.length,
    }
  } catch (error) {
    console.error("Error in fetchOnTheAirTVShows:", error)

    // Return fallback data
    const results = fallbackTVShows.filter((m) => m.type === "tv").map(convertToContentItem)

    return {
      results,
      page: 1,
      total_pages: 1,
      total_results: results.length,
    }
  }
}

// Fetch airing today TV shows
export async function fetchAiringTodayTVShows(): Promise<any> {
  try {
    const data = await fetchWithFallback(
      `${API_BASE_URL}/tv/airing-today`,
      {},
      { results: fallbackTVShows.filter((m) => m.type === "tv") },
    )

    const results = data.results.filter((item: FMovieItem) => item.type === "tv").map(convertToContentItem)

    return {
      results,
      page: data.page || 1,
      total_pages: data.totalPages || 1,
      total_results: results.length,
    }
  } catch (error) {
    console.error("Error in fetchAiringTodayTVShows:", error)

    // Return fallback data
    const results = fallbackTVShows.filter((m) => m.type === "tv").map(convertToContentItem)

    return {
      results,
      page: 1,
      total_pages: 1,
      total_results: results.length,
    }
  }
}

// Fetch content details
export async function fetchContentDetails(type: string, id: number): Promise<any> {
  try {
    const data = await fetchWithFallback(
      `${API_BASE_URL}/${type}/${id}`,
      {},
      type === "movie"
        ? fallbackMovies.find((m) => m.id === id.toString())
        : fallbackTVShows.find((m) => m.id === id.toString()),
    )

    return {
      ...convertToContentItem(data),
      media_type: type,
    }
  } catch (error) {
    console.error(`Error in fetchContentDetails for ${type} ${id}:`, error)

    // Return fallback data
    const fallbackItem =
      type === "movie"
        ? fallbackMovies.find((m) => m.id === id.toString())
        : fallbackTVShows.find((m) => m.id === id.toString())

    if (fallbackItem) {
      return {
        ...convertToContentItem(fallbackItem),
        media_type: type,
      }
    }

    // If no matching fallback item, create a placeholder
    return {
      id,
      title: `${type === "movie" ? "Movie" : "TV Show"} #${id}`,
      poster_path: "/placeholder.svg?height=500&width=300",
      backdrop_path: "/placeholder.svg?height=1080&width=1920",
      overview: "Content details are currently unavailable.",
      vote_average: 7.0,
      media_type: type,
      release_date: "2023-01-01",
      first_air_date: type === "tv" ? "2023-01-01" : undefined,
      streamingUrl: "",
      isExclusive: false,
      price: "25",
    }
  }
}

// Fetch content videos
export async function fetchContentVideos(type: string, id: number): Promise<any> {
  try {
    const data = await fetchWithFallback(`${API_BASE_URL}/${type}/${id}/videos`, {}, { results: [] })

    return data
  } catch (error) {
    console.error(`Error in fetchContentVideos for ${type} ${id}:`, error)

    // Return empty results if videos can't be fetched
    return { results: [] }
  }
}

// Fetch similar content
export async function fetchSimilarContent(type: string, id: number): Promise<any> {
  try {
    const data = await fetchWithFallback(
      `${API_BASE_URL}/${type}/${id}/similar`,
      {},
      {
        results:
          type === "movie"
            ? fallbackMovies.filter((m) => m.type === "movie").slice(0, 5)
            : fallbackTVShows.filter((m) => m.type === "tv").slice(0, 5),
      },
    )

    const results = data.results.map(convertToContentItem)

    return {
      results,
      page: data.page || 1,
      total_pages: data.totalPages || 1,
      total_results: results.length,
    }
  } catch (error) {
    console.error(`Error in fetchSimilarContent for ${type} ${id}:`, error)

    // Return fallback data
    const results = (
      type === "movie"
        ? fallbackMovies.filter((m) => m.type === "movie").slice(0, 5)
        : fallbackTVShows.filter((m) => m.type === "tv").slice(0, 5)
    ).map(convertToContentItem)

    return {
      results,
      page: 1,
      total_pages: 1,
      total_results: results.length,
    }
  }
}

// Fetch content credits
export async function fetchContentCredits(type: string, id: number): Promise<any> {
  try {
    const data = await fetchWithFallback(`${API_BASE_URL}/${type}/${id}/credits`, {}, { cast: [], crew: [] })

    return data
  } catch (error) {
    console.error(`Error in fetchContentCredits for ${type} ${id}:`, error)

    // Return empty cast and crew if credits can't be fetched
    return { cast: [], crew: [] }
  }
}

// Search for content
export async function searchContent(query: string, page = 1): Promise<any> {
  try {
    const data = await fetchWithFallback(
      `${API_BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}`,
      {},
      {
        results: [
          ...fallbackMovies.filter((m) => m.title.toLowerCase().includes(query.toLowerCase())),
          ...fallbackTVShows.filter((m) => m.title.toLowerCase().includes(query.toLowerCase())),
        ],
      },
    )

    const results = data.results.map(convertToContentItem)

    return {
      results,
      page: data.page || page,
      total_pages: data.totalPages || 1,
      total_results: results.length,
    }
  } catch (error) {
    console.error(`Error in searchContent for "${query}":`, error)

    // Return fallback search results
    const results = [
      ...fallbackMovies.filter((m) => m.title.toLowerCase().includes(query.toLowerCase())),
      ...fallbackTVShows.filter((m) => m.title.toLowerCase().includes(query.toLowerCase())),
    ].map(convertToContentItem)

    return {
      results,
      page: page,
      total_pages: 1,
      total_results: results.length,
    }
  }
}

// Fetch streaming URL for content
export async function fetchStreamingUrl(type: string, id: number): Promise<string> {
  try {
    const data = await fetchWithFallback(`${API_BASE_URL}/${type}/${id}/stream`, {}, { streamingUrl: "" })

    return data.streamingUrl || ""
  } catch (error) {
    console.error(`Error in fetchStreamingUrl for ${type} ${id}:`, error)

    // Return a fallback streaming URL or empty string
    return ""
  }
}

// Fetch more content for a specific endpoint
export async function fetchMoreContent(endpoint: string, page: number): Promise<any> {
  try {
    // Map the endpoint to the appropriate API endpoint
    let apiEndpoint = endpoint
    if (endpoint.startsWith("movie/")) {
      apiEndpoint = `movies/${endpoint.split("/")[1]}`
    } else if (endpoint.startsWith("tv/")) {
      apiEndpoint = `tv/${endpoint.split("/")[1]}`
    }

    const data = await fetchWithFallback(
      `${API_BASE_URL}/${apiEndpoint}?page=${page}`,
      {},
      {
        results: endpoint.includes("movie")
          ? fallbackMovies.filter((m) => m.type === "movie").slice(0, 5)
          : fallbackTVShows.filter((m) => m.type === "tv").slice(0, 5),
      },
    )

    const results = data.results.map(convertToContentItem)

    return {
      results,
      page: data.page || page,
      total_pages: data.totalPages || 1,
      total_results: results.length,
    }
  } catch (error) {
    console.error(`Error in fetchMoreContent for ${endpoint} page ${page}:`, error)

    // Return fallback data
    const results = (
      endpoint.includes("movie")
        ? fallbackMovies.filter((m) => m.type === "movie").slice(0, 5)
        : fallbackTVShows.filter((m) => m.type === "tv").slice(0, 5)
    ).map(convertToContentItem)

    return {
      results,
      page: page,
      total_pages: page, // No more pages after this
      total_results: results.length,
    }
  }
}
