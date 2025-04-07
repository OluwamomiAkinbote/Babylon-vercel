import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const StoriesHeader = ({ stories, onStoryClick }) => {
    const containerRef = useRef(null);
    const [thumbnails, setThumbnails] = useState({});
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const loadThumbnails = async () => {
            const updatedThumbnails = {};
            for (const story of stories) {
                const firstMedia = story.media_files[0]?.media;

                if (firstMedia?.endsWith('.mp4')) {
                    updatedThumbnails[story.id] = { type: 'video', src: firstMedia };
                } else if (firstMedia) {
                    updatedThumbnails[story.id] = { type: 'image', src: firstMedia };
                } else {
                    updatedThumbnails[story.id] = { type: 'image', src: '/default-placeholder.png' };
                }
            }
            setThumbnails(updatedThumbnails);
        };

        loadThumbnails();
        checkScrollPosition();
    }, [stories]);

    const checkScrollPosition = () => {
        const container = containerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(container.scrollLeft + container.offsetWidth < container.scrollWidth);
        }
    };

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
            setTimeout(checkScrollPosition, 300);
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
            setTimeout(checkScrollPosition, 300);
        }
    };

    if (stories.length === 0) {
        return <div className="text-white text-center">Loading stories...</div>;
    }

    // Sort stories by date (newest to oldest)
    const sortedStories = [...stories].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="relative p-4 font-robotoCondensed mt-20 mx-2">
            <div className="flex items-center justify-between mb-4">
                <h1 className="md:text-2xl text-lg font-bold">Latest Stories</h1>

                <div className="flex space-x-2">
                    <button
                        onClick={scrollLeft}
                        className={`bg-gray-800 text-white ${
                            canScrollLeft ? 'hover:bg-gray-600' : 'opacity-50 cursor-not-allowed'
                        } border border-gray-300 rounded-full p-2 transition`}
                        disabled={!canScrollLeft}
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <button
                        onClick={scrollRight}
                        className={`bg-gray-800 text-white ${
                            canScrollRight ? 'hover:bg-gray-600' : 'opacity-50 cursor-not-allowed'
                        } border border-gray-300 rounded-full p-2 transition`}
                        disabled={!canScrollRight}
                    >
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            <div
                ref={containerRef}
                className="flex overflow-x-auto space-x-2 md:space-x-4 scrollbar-hide"
                onScroll={checkScrollPosition}
            >
                {sortedStories.map((story) => {
                    const thumb = thumbnails[story.id];
                    const mediaType = thumb?.type || 'image';
                    const mediaSrc = thumb?.src || '/default-placeholder.png';

                    return (
                        <div
                            key={story.id}
                            onClick={() => onStoryClick(story)}
                            className="px-2 flex flex-col items-center cursor-pointer transition transform"
                        >
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-green-500 flex items-center justify-center bg-black">
                                {mediaType === 'video' ? (
                                    <video
                                        src={mediaSrc}
                                        className="w-full h-full object-cover"
                                        muted
                                        autoPlay
                                        loop
                                        playsInline
                                        onLoadedData={(e) => e.target.pause()}
                                    />
                                ) : (
                                    <img
                                        src={mediaSrc}
                                        alt={story.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="max-w-[120px] mx-auto px-1 text-center">
                                <p className="text-sm font-semibold leading-snug break-words">
                                    {story.title}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StoriesHeader;
