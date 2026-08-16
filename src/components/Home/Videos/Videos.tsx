"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  Heart,
  Share2,
  Download,
} from "lucide-react";
import Image from "next/image";

interface VideoItem {
  id: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  views: number;
  likes: number;
  date: string;
  category: string;
}

const Videos = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [likedVideos, setLikedVideos] = useState<number[]>([]);

  // স্কুলের ভিডিও ডেটা
  const schoolVideos: VideoItem[] = [
    {
      id: 1,
      title: "বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৪",
      description: "স্কুলের বার্ষিক ক্রীড়া প্রতিযোগিতার সেরা মুহূর্তসমূহ",
      duration: "5:32",
      thumbnail:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      views: 1250,
      likes: 245,
      date: "১৫ মার্চ, ২০২৪",
      category: "ক্রীড়া",
    },
    {
      id: 2,
      title: "বিজ্ঞান মেলা ২০২৪",
      description: "ছাত্র-ছাত্রীদের উদ্ভাবনী প্রজেক্ট প্রদর্শনী",
      duration: "7:15",
      thumbnail:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      views: 1890,
      likes: 312,
      date: "১০ মার্চ, ২০২৪",
      category: "বিজ্ঞান",
    },
    {
      id: 3,
      title: "সাংস্কৃতিক অনুষ্ঠান",
      description: "বার্ষিক সাংস্কৃতিক সন্ধ্যার বিশেষ পরিবেশনা",
      duration: "12:45",
      thumbnail:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      views: 2450,
      likes: 421,
      date: "২৫ ফেব্রুয়ারি, ২০২৪",
      category: "সংস্কৃতি",
    },
    {
      id: 4,
      title: "শিক্ষক দিবস উদযাপন",
      description: "শিক্ষকদের প্রতি ছাত্র-ছাত্রীদের শ্রদ্ধা ও ভালোবাসা",
      duration: "8:20",
      thumbnail:
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      views: 1670,
      likes: 298,
      date: "৫ অক্টোবর, ২০২৩",
      category: "উদযাপন",
    },
    {
      id: 5,
      title: "স্কুল ভবন উদ্বোধন",
      description: "নতুন একাডেমিক ভবনের আনুষ্ঠানিক উদ্বোধনী অনুষ্ঠান",
      duration: "6:50",
      thumbnail:
        "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      views: 2100,
      likes: 356,
      date: "১৫ জানুয়ারি, ২০২৪",
      category: "অনুষ্ঠান",
    },
    {
      id: 6,
      title: "শিক্ষা সফর ২০২৩",
      description: "ছাত্র-ছাত্রীদের শিক্ষামূলক ভ্রমণের স্মৃতিচারণ",
      duration: "10:30",
      thumbnail:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      views: 1780,
      likes: 267,
      date: "২০ ডিসেম্বর, ২০২৩",
      category: "ভ্রমণ",
    },
  ];

  const handleVideoSelect = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.load();
      setTimeout(() => {
        videoRef.current?.play();
      }, 100);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleLike = (videoId: number) => {
    if (likedVideos.includes(videoId)) {
      setLikedVideos(likedVideos.filter((id) => id !== videoId));
    } else {
      setLikedVideos([...likedVideos, videoId]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      {/* হেডিং সেকশন */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600 mb-4">
            ভিডিও গ্যালারি
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            স্কুলের বিভিন্ন অনুষ্ঠান, আয়োজন ও বিশেষ মুহূর্তের ভিডিও সংগ্রহ
          </p>
        </div>

        {/* ভিডিও ক্যাটেগরি ফিল্টার */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg">
            সব ভিডিও
          </button>
          {[
            "ক্রীড়া",
            "বিজ্ঞান",
            "সংস্কৃতি",
            "উদযাপন",
            "অনুষ্ঠান",
            "ভ্রমণ",
          ].map((category) => (
            <button
              key={category}
              className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* মেইন কন্টেন্ট */}
      <div className="max-w-7xl mx-auto">
        {/* সিলেক্টেড ভিডিও প্লেয়ার */}
        {selectedVideo && (
          <div className="mb-12 bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-[500px] object-cover"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                আপনার ব্রাউজার ভিডিও সাপোর্ট করে না।
              </video>

              {/* ভিডিও কন্ট্রোলস */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-white">
                    <h2 className="text-2xl font-bold mb-1">
                      {selectedVideo.title}
                    </h2>
                    <p className="text-gray-300">{selectedVideo.description}</p>
                  </div>
                  <button
                    onClick={handleFullscreen}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-300"
                  >
                    <Maximize className="h-5 w-5 text-white" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* প্রোগ্রেস বার */}
                  <div className="flex items-center gap-4">
                    <span className="text-white text-sm">
                      {formatTime(currentTime)}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={videoRef.current?.duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                    <span className="text-white text-sm">
                      {selectedVideo.duration}
                    </span>
                  </div>

                  {/* কন্ট্রোল বাটনস */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlayPause}
                        className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors duration-300"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5 text-gray-800" />
                        ) : (
                          <Play className="h-5 w-5 text-gray-800" />
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <Volume2 className="h-5 w-5 text-white" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLike(selectedVideo.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300 ${
                          likedVideos.includes(selectedVideo.id)
                            ? "bg-red-50 text-red-600"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            likedVideos.includes(selectedVideo.id)
                              ? "fill-red-600"
                              : ""
                          }`}
                        />
                        <span>
                          {selectedVideo.likes +
                            (likedVideos.includes(selectedVideo.id) ? 1 : 0)}
                        </span>
                      </button>

                      <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors duration-300">
                        <Share2 className="h-5 w-5" />
                        <span>শেয়ার</span>
                      </button>

                      <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors duration-300">
                        <Download className="h-5 w-5" />
                        <span>ডাউনলোড</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ভিডিও ইনফো */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    বিস্তারিত
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedVideo.description} এই ভিডিওটি স্কুলের একটি
                    গুরুত্বপূর্ণ ঘটনা ধারণ করেছে যা আমাদের শিক্ষার্থীদের সক্রিয়
                    অংশগ্রহণ এবং উদ্যম প্রদর্শন করে।
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">দেখা হয়েছে</span>
                    <span className="font-semibold text-gray-800">
                      {selectedVideo.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">লাইক</span>
                    <span className="font-semibold text-gray-800">
                      {selectedVideo.likes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">তারিখ</span>
                    <span className="font-semibold text-gray-800">
                      {selectedVideo.date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600">বিভাগ</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-600 rounded-full font-medium">
                      {selectedVideo.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ভিডিও গ্রিড */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">সমস্ত ভিডিও</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schoolVideos.map((video) => (
              <div
                key={video.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  selectedVideo?.id === video.id ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {/* থাম্বনেইল */}
                <div
                  className="relative h-64 cursor-pointer group"
                  onClick={() => handleVideoSelect(video)}
                >
                  <Image
                    width={600}
                    height={600}
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* প্লে বাটন */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full group-hover:bg-white/30 transition-all duration-300">
                      <div className="p-3 bg-white rounded-full">
                        <Play className="h-6 w-6 text-gray-800" />
                      </div>
                    </div>
                  </div>

                  {/* ডুরেশন */}
                  <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded-md text-sm">
                    {video.duration}
                  </div>
                </div>

                {/* ভিডিও ডিটেইলস */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      className="text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors duration-300 line-clamp-2"
                      onClick={() => handleVideoSelect(video)}
                    >
                      {video.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(video.id);
                      }}
                      className="flex-shrink-0"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          likedVideos.includes(video.id)
                            ? "fill-red-600 text-red-600"
                            : "text-gray-400 hover:text-red-600"
                        } transition-colors duration-300`}
                      />
                    </button>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        👁️ {video.views}
                      </span>
                      <span className="flex items-center gap-1">
                        ❤️{" "}
                        {video.likes + (likedVideos.includes(video.id) ? 1 : 0)}
                      </span>
                    </div>
                    <span>{video.date}</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-teal-50 text-blue-600 rounded-full text-sm font-medium">
                      {video.category}
                    </span>
                    <button
                      onClick={() => handleVideoSelect(video)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full hover:from-blue-700 hover:to-teal-700 transition-all duration-300 text-sm font-medium"
                    >
                      দেখুন
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* স্ট্যাটস সেকশন */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {schoolVideos.length}+
              </div>
              <div className="text-blue-100">ভিডিও</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {schoolVideos
                  .reduce((acc, video) => acc + video.views, 0)
                  .toLocaleString()}
                +
              </div>
              <div className="text-blue-100">মোট দেখা</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {schoolVideos
                  .reduce((acc, video) => acc + video.likes, 0)
                  .toLocaleString()}
                +
              </div>
              <div className="text-blue-100">লাইক</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">৬+</div>
              <div className="text-blue-100">বিভাগ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos;
