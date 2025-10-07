import { useState, useMemo } from "react";
import Header from "./Header";
import PodcastGrid from "../views/renderGrid";
import PodcastModal from "./podcastModal";
import LoadingSpinner from "../utilities/loadingSpinner";
import ErrorDisplay from "../utilities/loadingError";
import useFetchPodcasts from "../utilities/fetchPodcasts";
import GenreFilter from "../utilities/genreFilter";
import Sorter from "../utilities/podcastSorter";
import Pagination from "../utilities/pagination";

/**
 * Home Component
 * 
 * Main landing page of the podcast app.
 * @component
 */
const Home = () => {
    const [podcastsUrl] = useState("https://podcast-api.netlify.app");
  
    // Fetch all podcasts
    const { 
        data: allPodcasts,
        isLoading, 
        error 
    } = useFetchPodcasts(podcastsUrl);

    // State for filtering and sorting and searching
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [sortCriteria, setSortCriteria] = useState('recent');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostPerPage] = useState(8);
    

    // Filter, seach and sort podcasts
    const filteredAndSortedPodcasts = useMemo(() => {
        if (!allPodcasts || allPodcasts.length === 0) return [];

        // Defining variable for Podcasts to be processed
        let processedPodcasts = allPodcasts;

        // Search
        if (searchTerm) {
            processedPodcasts = processedPodcasts.filter(podcast =>
                podcast.title && podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter
        if (selectedGenre !== 'all') {
            processedPodcasts = processedPodcasts.filter(podcast => 
                podcast.genres && podcast.genres.includes(parseInt(selectedGenre))
            );
        }

        // Sort
        const sortedPodcasts = [...processedPodcasts];

        switch (sortCriteria) {
            case 'title-az':
                sortedPodcasts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-za':
                // adding Reverse alphabetical order
                sortedPodcasts.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'recent':
                sortedPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
                break;
            case 'oldest':
                sortedPodcasts.sort((a, b) => new Date(a.updated) - new Date(b.updated));
                break;
            case 'seasons':
                // Handle podcasts with no seasons property
                sortedPodcasts.sort((a, b) => {
                    const seasonsA = a.seasons || 0;
                    const seasonsB = b.seasons || 0;
                    return seasonsB - seasonsA; // Descending order (most seasons first)
                });
                break;
            default:
                // Default to recent sorting
                sortedPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        }

        return sortedPodcasts;
    }, [allPodcasts, selectedGenre, sortCriteria, searchTerm]);

    // Pagination
    // Using slice method in js, which cuts array using starting index and last index
    const paginationData = useMemo(() => {
        const totalPodcasts = filteredAndSortedPodcasts.length;
        const totalPages = Math.ceil(totalPodcasts / postsPerPage);

        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }

        const lastPodcastIndex = currentPage * postsPerPage;
        const fistPodcastIndex = lastPodcastIndex - postsPerPage;

        // hiding unwanted cards
        const currentCards = filteredAndSortedPodcasts.slice(fistPodcastIndex, lastPodcastIndex);

        return {
            currentCards,
            totalPages,
            currentPage: Math.min(currentPage, totalPages || 1),
            totalPodcasts
        };
    }, [filteredAndSortedPodcasts, currentPage, postsPerPage]);
        

    // State for modal
    const [selectedPodcastId, setSelectedPodcastId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for error display
    // const [isErrorVisible, setIsErrorVisible] = useState(true);

    const handlePodcastSelect = (podcast) => {
        setSelectedPodcastId(podcast.id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPodcastId(null);
    };

    const handleGenreChange = (genreId) => {
        setSelectedGenre(genreId);
        setCurrentPage(1);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleSortChange = (criteria) => {
        setSortCriteria(criteria);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Automatcally move to the top to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };


    // const handleDismissError = () => {
    //     setIsErrorVisible(false);
    // };

    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    
    return (
        <>
            {/* Header */}
            <Header onSearch={handleSearch} />

            <div className="text-white px-12 py-6 flex  w-full gap-5">
                {/* Error Display */}
                {error && (
                    <ErrorDisplay 
                    message={`Failed to load podcasts: ${error}`}
                    />
                )}

                {/* Podcast Modal */}
                <PodcastModal 
                    podcastId={selectedPodcastId}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    allPodcasts={allPodcasts}
                />
            
                <div className="w-full flex flex-col gap-8">
                    {/* Render error or grid for all podcasts */}
                    {allPodcasts && allPodcasts.length > 0 ? (
                        <div>
                            <h2 className="font-bold text-2xl mb-2">
                                {searchTerm ? `Search Results for "${searchTerm}"` : 'Podcasts'}
                                    {filteredAndSortedPodcasts.length !== allPodcasts.length && (
                                        <span className="text-gray-400 text-lg ml-2">
                                            ({filteredAndSortedPodcasts.length} of {allPodcasts.length})
                                        </span>
                                    )}
                            </h2>

                            {/* Drop down filters and sorter */}
                            <div className="flex flex-col mb-4 md:flex-row md:items-center md:justify-start md:gap-3 md:mb-12">
                                <GenreFilter onGenreChange={handleGenreChange} />
                                <Sorter onSortChange={handleSortChange} />
                            </div>

                            {/* Handling empty results */}
                            {searchTerm && filteredAndSortedPodcasts.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400 text-lg">
                                            No podcasts found matching "<span className="text-white">{searchTerm}</span>"
                                        </p>
                                        <button 
                                            onClick={() => setSearchTerm('')}
                                            className="mt-2 text-[#9A7B4F] hover:text-[#b3b3b3] transition-colors"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                )}

                            <PodcastGrid 
                                podcasts={paginationData.currentCards} 
                                onPodcastSelect={handlePodcastSelect}
                            />

                            {/* Pagination Component */}
                            {paginationData.totalPages > 1 && (
                                <Pagination 
                                    currentPage={paginationData.currentPage}
                                    totalPages={paginationData.totalPages}
                                    totalPosts={paginationData.totalPodcasts}
                                    postsPerPage={postsPerPage}
                                    onPageChange={handlePageChange}
                                />
                            )}

                        </div>
                    ) : (
                        <p className="text-gray-400">No podcasts found</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;