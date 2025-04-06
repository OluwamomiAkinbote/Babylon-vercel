import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Play, Pause, X } from 'lucide-react';
import StoriesHeader from './StoriesHeader';
import { API_URL } from '../../config';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};

const StoryView = () => {
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [mediaDuration, setMediaDuration] = useState(7); // Default 7s for images
    const [isMuted, setIsMuted] = useState(false); // Default unmuted
    const [videoProgress, setVideoProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axios.get(`${API_URL}/story/`);
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
        setIsMuted(false);
        document.body.style.overflow = 'hidden';
    };

    const closeStory = () => {
        const video = document.querySelector('video');
        if (video) {
            video.pause();
        }
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

    if (selectedStory) {
        const currentMedia = selectedStory.media_files[currentMediaIndex];

        return (
            <div className="fixed inset-0 z-50 bg-black bg-balck flex flex-col items-center justify-center">
                <div className="relative w-full sm:w-[300px] md:w-[350px] h-[600px] sm:h-[700px] flex justify-center items-center">
                    {/* Story Progress Bar */}
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
                        <button onClick={togglePlayPause}>
                            {isPlaying ? <Pause /> : <Play />}
                        </button>
                        <button onClick={closeStory}>
                            <X />
                        </button>
                    </div>

                    {/* Media Display */}
                    {currentMedia.media.endsWith('.mp4') ? (
                        <video
                            key={currentMedia.id}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted={isMuted}
                            controls={false}
                            onLoadedMetadata={(e) => {
                                handleVideoDuration(e);
                                setVideoProgress(0);
                                setCurrentTime(0);
                            }}
                            onTimeUpdate={(e) => {
                                const current = e.target.currentTime;
                                const total = e.target.duration;
                                setVideoProgress((current / total) * 100);
                                setCurrentTime(current);
                            }}
                            onEnded={nextMedia}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <source src={currentMedia.media} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            key={currentMedia.id}
                            src={currentMedia.media}
                            alt="story"
                            className="w-full h-full object-cover"
                            onLoad={() => setMediaDuration(7)}
                        />
                    )}

                    {/* Prev Arrow */}
                    <button
                        onClick={() =>
                            setCurrentMediaIndex(currentMediaIndex - 1 >= 0 ? currentMediaIndex - 1 : 0)
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-black" />
                    </button>

                    {/* Next Arrow */}
                    <button
                        onClick={nextMedia}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
                    >
                        <ChevronRightIcon className="w-6 h-6 text-black" />
                    </button>



                    {/* Video Controls at Bottom-1/4 */}
                    {currentMedia.media.endsWith('.mp4') && (
                        <div className="absolute bottom-1/4 w-full px-6 flex flex-col items-center space-y-2">
                            <div className="w-full h-1 bg-gray-700 rounded">
                                <div
                                    className="h-1 bg-green-400 rounded"
                                    style={{ width: `${videoProgress}%` }}
                                />
                            </div>
                            <div className="w-full flex justify-between items-center text-white text-sm font-medium">
                                <span>{formatTime(currentTime)} / {formatTime(mediaDuration)}</span>
                                <button onClick={() => setIsMuted(prev => !prev)}>
                                    {isMuted ? 'Unmute' : 'Mute'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 w-full h-36 bg-gradient-to-t from-black to-black/24 px-4 flex items-end justify-center text-white text-sm">
                        <p className="pb-12 font-medium">{currentMedia.caption}</p>
                </div>

            </div>
        );
    }

    return <StoriesHeader stories={stories} onStoryClick={openStory} />;
};

export default StoryView;
