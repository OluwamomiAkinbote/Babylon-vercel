
import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const generateThumbnail = async (videoUrl) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.crossOrigin = 'anonymous';
        video.currentTime = 5;

        video.onloadeddata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png'));
        };

        video.onerror = () => {
            reject('Thumbnail generation failed');
        };
    });
};

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
                    try {
                        const thumb = await generateThumbnail(firstMedia);
                        updatedThumbnails[story.id] = thumb;
                    } catch (error) {
                        console.error(error);

                        // Fallback to the next available image in media_files
                        const fallbackImage = story.media_files.find(
                            (media) => /\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff)$/i.test(media.media)
                        )?.media;

                        updatedThumbnails[story.id] = fallbackImage || '/default-placeholder.png'; // Fallback image or placeholder
                    }
                } else {
                    updatedThumbnails[story.id] = firstMedia; // Use the first media directly if it's an image
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

    const truncateTitle = (title) => {
        const words = title.split(' ');
        return words.length > 3 ? `${words.slice(0, 3).join(' ')}...` : title;
    };

    return (
        <div className="relative p-4 font-robotoCondensed mt-20">
            <h1 className="text-2xl font-bold mb-4 text-center">Latest Stories</h1>

            <div className="absolute top-4 right-4 flex space-x-2">
                <button
                    onClick={scrollLeft}
                    className={`bg-gray-800 text-white ${
                        canScrollLeft ? 'hover:bg-gray-600' : 'opacity-50 cursor-not-allowed'
                    } border border-gray-300 rounded-full p-2 transition`}
                    disabled={!canScrollLeft}
                >
                    <ArrowLeft size={12} />
                </button>
                <button
                    onClick={scrollRight}
                    className={`bg-gray-800 text-white ${
                        canScrollRight ? 'hover:bg-gray-600' : 'opacity-50 cursor-not-allowed'
                    } border border-gray-300 rounded-full p-2 transition`}
                    disabled={!canScrollRight}
                >
                    <ArrowRight size={12} />
                </button>
            </div>

            <div ref={containerRef} className="flex overflow-x-auto space-x-2 md:space-x-4 scrollbar-hide" onScroll={checkScrollPosition}>
                {stories.map((story) => {
                    const thumbnail = thumbnails[story.id] || '/default-placeholder.png';

                    return (
                        <div
                            key={story.id}
                            onClick={() => onStoryClick(story)}
                            className="px-2 flex flex-col items-center cursor-pointer transition transform"
                        >
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-green-500">
                                <img src={thumbnail} alt={story.title} className="w-full h-full object-cover" />
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