import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Play, Pause, X } from 'lucide-react';
import StoriesHeader from './StoriesHeader';
import { API_URL } from '../../config';

const StoryView = () => {
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [mediaDuration, setMediaDuration] = useState(7); // Default 7s for images
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axios.get(`${API_URL}/story/`);
                setStories(response.data);
            } catch (error) {
                console.error('Error fetching stories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    useEffect(() => {
        if (!selectedStory) return;

        const progressInterval = setInterval(() => {
            if (isPlaying && progress < 100) {
                setProgress((prev) => prev + (100 / (mediaDuration * 10)));
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
        const video = document.querySelector('video');
        if (video) video.pause();
        setSelectedStory(null);
        setCurrentMediaIndex(0);
        setProgress(0);
        document.body.style.overflow = 'auto';
    };

    const togglePlayPause = () => {
        setIsPlaying((prevState) => !prevState);
    };

    const handleVideoDuration = (e) => {
        const duration = e.target.duration;
        setMediaDuration(duration > 120 ? 120 : duration);
    };

    const getMediaUrl = (url) => {
        return url.startsWith('http') ? url : `${API_URL}${url}`;
    };

    if (selectedStory) {
        const currentMedia = selectedStory.media_files[currentMediaIndex];
        const mediaUrl = getMediaUrl(currentMedia.media);

        return (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center">
                <div className="relative w-full sm:w-[300px] md:w-[350px] h-[600px] sm:h-[700px] flex justify-center items-center">
                    {/* Progress Bar */}
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

                    {/* Control Buttons */}
                    <div className="absolute top-6 right-4 flex items-center space-x-2 text-white z-50">
                        <button onClick={togglePlayPause} className="text-xl">
                            {isPlaying ? <Pause /> : <Play />}
                        </button>
                        <button onClick={closeStory} className="text-xl">
                            <X />
                        </button>
                    </div>

                    {/* Media Content */}
                    {currentMedia.media.endsWith('.mp4') ? (
                        <video
                            key={currentMedia.id}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            controls
                            onLoadedMetadata={handleVideoDuration}
                            onEnded={nextMedia}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <source src={mediaUrl} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            key={currentMedia.id}
                            src={mediaUrl}
                            alt="story"
                            className="w-full h-full object-cover"
                            onLoad={() => setMediaDuration(7)}
                            onError={(e) => {
                                e.target.src = `${API_URL}/static/images/default-story.png`;
                            }}
                        />
                    )}

                    <button 
                        onClick={() => setCurrentMediaIndex(Math.max(0, currentMediaIndex - 1))} 
                        className="absolute left-4 text-white text-3xl"
                    >
                        &#8592;
                    </button>

                    <button 
                        onClick={nextMedia} 
                        className="absolute right-4 text-white text-3xl"
                    >
                        &#8594;
                    </button>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent text-white text-center p-2">
                    <p className="font-semibold">{currentMedia.caption}</p>
                </div>
            </div>
        );
    }

    return loading ? (
        <div className="text-center py-8">Loading stories...</div>
    ) : (
        <StoriesHeader stories={stories} onStoryClick={openStory} />
    );
};

export default StoryView;