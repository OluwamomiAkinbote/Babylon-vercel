import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Play, Pause, X } from 'lucide-react';
import StoriesHeader from './StoriesHeader';

const StoryView = () => {
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [mediaDuration, setMediaDuration] = useState(7); // Default 7s for images

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/story/');
                setStories(response.data);
            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        };
        fetchStories();
    }, []);

    useEffect(() => {
        if (!selectedStory) return;

        const progressInterval = setInterval(() => {
            if (isPlaying && progress < 100) {
                setProgress((prev) => prev + (100 / (mediaDuration * 10))); // Dynamic speed based on media duration
            }
        }, 100);

        if (progress >= 100) {
            nextMedia();
        }

        return () => clearInterval(progressInterval);
    }, [selectedStory, progress, isPlaying, mediaDuration]);

    const nextMedia = () => {
        if (currentMediaIndex < selectedStory.media_files.length - 1) {
            setCurrentMediaIndex((prevIndex) => prevIndex + 1);
            setProgress(0);
        } else {
            closeStory();
        }
    };

    const openStory = (story) => {
        setSelectedStory(story);
        setCurrentMediaIndex(0);
        setProgress(0);
        setIsPlaying(true);
        document.body.style.overflow = 'hidden';
    };

    const closeStory = () => {
        // Pause the video if it exists
        const video = document.querySelector('video');
        if (video) {
            video.pause();
        }
        setSelectedStory(null);
        setCurrentMediaIndex(0);
        setProgress(0);
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    const togglePlayPause = () => {
        setIsPlaying((prevState) => !prevState);
    };

    const handleVideoDuration = (e) => {
        const duration = e.target.duration;
        setMediaDuration(duration > 120 ? 120 : duration); // Limit duration to 120 seconds
    };

    if (selectedStory) {
        const currentMedia = selectedStory.media_files[currentMediaIndex];

        return (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center">
                <div className="relative w-full sm:w-[300px] md:w-[350px] h-[600px] sm:h-[700px] flex justify-center items-center">
                    {/* Progress Bar Dynamically Adjusted */}
                    <div className="absolute top-2 left-4 right-4 flex space-x-1">
                        {selectedStory.media_files.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1 flex-grow rounded ${index === currentMediaIndex ? 'bg-white' : 'bg-gray-500'}`}
                                style={{
                                    width: index === currentMediaIndex ? `${progress}%` : '100%',
                                    transition: index === currentMediaIndex ? `width ${mediaDuration}s linear` : 'none',
                                }}
                            />
                        ))}
                    </div>

                    {/* Close and Pause/Play Icons */}
                    <div className="absolute top-6 right-4 flex items-center space-x-2 text-white z-50">
                        <button onClick={togglePlayPause} className="text-xl">
                            {isPlaying ? <Pause /> : <Play />}
                        </button>
                        <button onClick={closeStory} className="text-xl">
                            <X />
                        </button>
                    </div>

                    {/* Story Content with Dynamic Duration */}
                    {currentMedia.media.endsWith('.mp4') ? (
                        <video
                            key={currentMedia.id}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            controls
                            onLoadedMetadata={handleVideoDuration}
                            onEnded={nextMedia}
                            onClick={(e) => e.stopPropagation()} // Prevent event interference
                        >
                            <source src={currentMedia.media} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            key={currentMedia.id}
                            src={currentMedia.media}
                            alt="story"
                            className="w-full h-full object-cover"
                            onLoad={() => setMediaDuration(7)} // Set default duration for images
                        />
                    )}

                    <button onClick={() => setCurrentMediaIndex(currentMediaIndex - 1 >= 0 ? currentMediaIndex - 1 : 0)} className="absolute left-4 text-white text-3xl">
                        &#8592;
                    </button>

                    <button onClick={nextMedia} className="absolute right-4 text-white text-3xl">
                        &#8594;
                    </button>
                </div>

                {/* Footer Section */}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent text-white text-center p-2">
                    <p className="font-semibold">{currentMedia.caption}</p>
                </div>
            </div>
        );
    }

    return <StoriesHeader stories={stories} onStoryClick={openStory} />;
};

export default StoryView;