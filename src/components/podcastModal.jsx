import { useState, useEffect } from "react";
import { genres } from "../../../data.js";

/**
 * PodcastsModal component which shows the detailed information about a selected podcast in a modal overlay. 
 * It shows the podcast image, description, genres, seasons, and last updated date. 
 * 
 * @component
 * 
 * @param {Object} props - Component props
 * @param {number|string} props.podcastId - The ID of the podcast that is selected by user
 * @param {boolean} props.isOpen - state control to check if the modal is open or closed
 * @param {Function} props.onClose - event listener of call back function
 * @param {Array<Object>} props.allPodcasts - Array of all podcasts data available
 * 
 * @returns {JSX.Element|null} The rendered modal or null if closed/no podcast
 */
const PodcastsModal = ({ podcastId, isOpen, onClose, allPodcasts }) => {
    const [podcastData, setPodcastData] = useState(null);
    const [podcastGenres, setPodcastGenres] = useState([]);

    const getPodcastById = (id) => {
        return allPodcasts.find(podcast => podcast.id === id);
    };

    const getGenresByPodcast = (podcast) => {
        if (!podcast.genres) return [];
            return genres
            .filter(genre => podcast.genres.includes(genre.id))
            .map(genre => genre.title);
        };

  const getFormattedDate = (dateString) => {
    if (!dateString) return "Unknown";
    const updatedDate = new Date(dateString);
        return updatedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        });
    };

  // Load podcast data upon clicking on card for modal to open
    useEffect(() => {
        if (isOpen && podcastId) {
        const podcast = getPodcastById(podcastId);
        if (podcast) {
            setPodcastData(podcast);
            setPodcastGenres(getGenresByPodcast(podcast));
        }
        }
    }, [isOpen, podcastId]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
        onClose();
        }
    };

    if (!isOpen || !podcastData) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-[#282828] rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-white">{podcastData.title}</h2>
                    <button 
                        onClick={onClose}
                        className="text-white text-2xl hover:text-gray-400"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                {/* Main content */}
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    {/* Image */}
                    <img 
                        src={podcastData.image} 
                        alt={podcastData.title}
                        className="w-full lg:w-[40%] h-fit object-cover rounded-lg"
                    />
                    
                    {/* Details */}
                    <div className="flex-1">
                        <p className="text-gray-300 mb-4">{podcastData.description}</p>
                        
                        {/* Genres */}
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-300 mb-2">Genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {podcastGenres.map((genre, index) => (
                                    <span
                                        key={index}
                                        className="bg-[#F4F4F4] w-fit h-fit px-2 py-1 text-sm text-[#121212] rounded"
                                    >
                                        {genre}
                                    </span>
                                ))}
                                {podcastGenres.length === 0 && (
                                    <span className="text-gray-400">No genres listed</span>
                                )}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                            <div>
                                <span className="font-medium">Seasons:</span> {podcastData.seasons || 0}
                            </div>
                            <div>
                                <span className="font-medium">Last Updated:</span> {getFormattedDate(podcastData.updated)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PodcastsModal;