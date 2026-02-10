import { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Volume2, VolumeX, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

// Photo gallery data - UPDATE THIS with your own photos and captions!
const photos = [
  {
    src: './images/photo1.jpg',
    // caption: 'Our first date - coffee and endless conversations ☕',
    caption: '',
    date: '',
    rotation: 0 // Adjust rotation: 0, 90, 180, 270
  },
  {
    src: './images/photo2.jpg',
    // caption: 'Beach sunset - you looked so beautiful 🌅',
    caption: '',
    date: '',
    rotation: 0
  },
  {
    src: './images/photo3.jpg',
    // caption: 'That silly moment we couldn\'t stop laughing 😂',
    caption: '',
    date: '',
    rotation: 0
  },
  {
    src: './images/photo4.jpg',
    // caption: 'Adventure time - best trip ever! 🏔️',
    caption: '',
    date: '',
    rotation: 0
  },
  {
    src: './images/photo5.jpg',
    // caption: 'Just us being us ❤️',
    caption: '',
    date: '',
    rotation: 0
  }
];

function App() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [noClickCount, setNoClickCount] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; left: number; delay: number; initialTop: number }>>([]);
  const [floatingPhotos, setFloatingPhotos] = useState<Array<{ id: number; left: number; delay: number; initialTop: number; stickerIndex: number }>>([]);
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 });
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [audioError, setAudioError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [cursorTrail, setCursorTrail] = useState<Array<{ id: number; x: number; y: number; type: 'heart' | 'sparkle' }>>([]);
  const slideshowIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const trailIdRef = useRef(0);

  // Audio refs
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const heartbeatRef = useRef<HTMLAudioElement | null>(null);
  const celebrationRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create floating hearts with randomized initial positions
    const hearts = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: (i * 0.1), // Faster generation - 0.1s between each
      initialTop: Math.random() * 100 // Random initial vertical position
    }));
    setFloatingHearts(hearts);

    // Create floating stickers with randomized positions
    const stickerCount = 11; // UPDATE THIS to match number of sticker files you add
    const stickerFloaters = Array.from({ length: 25 }, (_, i) => ({
      id: i + 100,
      left: Math.random() * 100,
      delay: (i * 0.15), // Faster generation - 0.15s between each
      initialTop: Math.random() * 100,
      stickerIndex: (i % stickerCount) + 1 // Cycle through sticker1.png, sticker2.png, etc.
    }));
    setFloatingPhotos(stickerFloaters);

    // Initialize audio elements
    try {
      bgMusicRef.current = new Audio('./audio/background-music.mp3');
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.3;

      heartbeatRef.current = new Audio('./audio/heartbeat.mp3');
      heartbeatRef.current.volume = 1;

      celebrationRef.current = new Audio('./audio/celebration.mp3');
      celebrationRef.current.volume = 0.5;
    } catch (error) {
      console.log('Audio files not found. Please add audio files to public/audio/');
      setAudioError(true);
    }

    return () => {
      // Cleanup audio on unmount
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);

    if (isMuted) {
      // Unmuting - decide what to play based on decision state
      if (answer === 'yes') {
        // After decision: play celebration music
        if (celebrationRef.current) {
          celebrationRef.current.currentTime = 0;
          celebrationRef.current.play().catch(() => {
            console.log('Celebration music blocked by browser');
          });
        }
      } else {
        // Before decision: play background music
        if (bgMusicRef.current) {
          bgMusicRef.current.play().catch(() => {
            console.log('Audio autoplay blocked by browser');
          });
        }
      }
    } else {
      // Muting - pause all audio
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
      if (celebrationRef.current) {
        celebrationRef.current.pause();
      }
    }
  };

  const playHeartbeat = () => {
    if (!isMuted && heartbeatRef.current) {
      heartbeatRef.current.currentTime = 0;
      heartbeatRef.current.play().catch(() => { });
    }
  };

  const handleYes = () => {
    setAnswer('yes');

    // Stop background music
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }

    // Stop heartbeat sound if playing
    if (heartbeatRef.current) {
      heartbeatRef.current.pause();
      heartbeatRef.current.currentTime = 0;
    }

    // Play celebration music
    if (celebrationRef.current) {
      celebrationRef.current.currentTime = 0;
      celebrationRef.current.play().catch(() => {
        console.log('Celebration music blocked by browser');
      });
    }
  };

  const handleNo = () => {
    setNoClickCount(prev => prev + 1);
    if (noClickCount > 2) {
      const randomX = (Math.random() - 0.5) * 200;
      const randomY = (Math.random() - 0.5) * 200;
      setNoButtonOffset({ x: randomX, y: randomY });
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  const toggleSlideshow = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-advance slideshow
  useEffect(() => {
    if (answer === 'yes' && isPlaying && photos.length > 1) {
      slideshowIntervalRef.current = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
      }, 4000); // Change photo every 4 seconds

      return () => {
        if (slideshowIntervalRef.current) {
          clearInterval(slideshowIntervalRef.current);
        }
      };
    } else {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
    }
  }, [answer, isPlaying, photos.length]);

  // Cursor trail effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newParticle = {
        id: trailIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        type: 'sparkle' as 'heart' | 'sparkle' // Only sparkles
      };

      setCursorTrail(prev => [...prev, newParticle]);

      // Remove particle after animation completes (1 second)
      setTimeout(() => {
        setCursorTrail(prev => prev.filter(p => p.id !== newParticle.id));
      }, 1000);
    };

    // Throttle mouse move events to avoid too many particles
    let lastTime = 0;
    const throttledMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime > 50) { // Create particle every 50ms
        lastTime = now;
        handleMouseMove(e);
      }
    };

    window.addEventListener('mousemove', throttledMouseMove);

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
    };
  }, []);

  const noButtonMessages = [
    "No",
    "Are you sure? 🥺",
    "Really? 💔",
    "Please? 🥹",
    "Just say yes! 💔😢",
    "Don't be cruel... 🥹",
    "My heart can't take it! 😭",
    "Okay, suit yourself... 😔"
  ];

  const yesButtonScale = 1 + (noClickCount * 0.3);

  if (answer === 'yes') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-400 to-red-400 flex items-center justify-center relative overflow-hidden">
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            className="floating-heart"
            style={{
              left: `${heart.left}%`,
              top: `${heart.initialTop}%`,
              animationDelay: `${heart.delay}s`,
            }}
          >
            <Heart className="text-white fill-white" size={30} />
          </div>
        ))}

        {floatingPhotos.map((sticker) => (
          <div
            key={sticker.id}
            className="floating-photo"
            style={{
              left: `${sticker.left}%`,
              top: `${sticker.initialTop}%`,
              animationDelay: `${sticker.delay}s`,
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}stickers/sticker${sticker.stickerIndex}.png`}
              alt="Sticker"
              className="object-contain"
              style={{ width: '150px', height: '150px' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ))}

        {/* Audio Control Button */}
        {!audioError && (
          <button
            onClick={toggleMute}
            className={`audio-control ${!isMuted ? 'playing' : ''}`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        )}

        <div className="text-center z-10 animate-scale-in max-w-4xl w-full px-4">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Heart className="text-white fill-white animate-pulse" size={120} />
              <Sparkles className="text-yellow-300 absolute -top-4 -right-4 animate-spin-slow" size={40} />
              <Sparkles className="text-yellow-300 absolute -bottom-4 -left-4 animate-spin-slow" size={40} />
            </div>
          </div>
          <h1 className="text-7xl font-bold text-white mb-6 animate-bounce-slow drop-shadow-2xl">
            YAAAAY! 🎉
          </h1>
          <p className="text-3xl text-white mb-4 font-light drop-shadow-lg">
            You made my day! ❤️
          </p>
          <p className="text-xl text-white/90 italic drop-shadow-lg mb-12">
            This Valentine's Day is going to be amazing!
          </p>

          {/* Photo Gallery */}
          <div className="gallery-container animate-zoom-in mb-8">
            <div className="relative">
              <img
                key={currentPhotoIndex}
                src={photos[currentPhotoIndex].src}
                alt={photos[currentPhotoIndex].caption}
                className="gallery-image animate-zoom-in"
                style={{
                  transform: `rotate(${photos[currentPhotoIndex].rotation}deg)`
                }}
                onError={(e) => {
                  // Fallback if image doesn't exist
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23ec4899" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="white"%3EAdd your photo here!%3C/text%3E%3C/svg%3E';
                }}
              />

              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      prevPhoto();
                      setIsPlaying(false);
                    }}
                    className="gallery-nav-button prev"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={24} className="text-rose-500" />
                  </button>
                  <button
                    onClick={() => {
                      nextPhoto();
                      setIsPlaying(false);
                    }}
                    className="gallery-nav-button next"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={24} className="text-rose-500" />
                  </button>

                  {/* Play/Pause Button */}
                  <button
                    onClick={toggleSlideshow}
                    className="gallery-play-button"
                    aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                    title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                  >
                    {isPlaying ? (
                      <Pause size={20} className="text-rose-500" />
                    ) : (
                      <Play size={20} className="text-rose-500" />
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Photo Caption */}
            <div className="mt-6 text-white">
              <p key={`caption-${currentPhotoIndex}`} className="text-2xl font-semibold mb-2 drop-shadow-lg animate-fade-in">
                {photos[currentPhotoIndex].caption}
              </p>
              <p key={`date-${currentPhotoIndex}`} className="text-lg opacity-90 drop-shadow-lg animate-fade-in">
                {photos[currentPhotoIndex].date}
              </p>
            </div>

            {/* Gallery Dots */}
            {photos.length > 1 && (
              <div className="gallery-dots">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      goToPhoto(index);
                      setIsPlaying(false);
                    }}
                    className={`gallery-dot ${index === currentPhotoIndex ? 'active' : ''}`}
                    aria-label={`Go to photo ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setAnswer(null)}
            className="mt-8 px-6 py-3 bg-white text-rose-500 rounded-full font-semibold hover:scale-110 transition-transform shadow-xl"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 flex items-center justify-center relative overflow-hidden p-4">
      {/* Cursor Trail Particles */}
      {cursorTrail.map((particle) => (
        <div
          key={particle.id}
          className={`cursor-particle ${particle.type}`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
          }}
        >
          {particle.type === 'heart' ? '❤️' : '✨'}
        </div>
      ))}

      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart"
          style={{
            left: `${heart.left}%`,
            top: `${heart.initialTop}%`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          <Heart className="text-pink-300 fill-pink-300" size={20} />
        </div>
      ))}

      {floatingPhotos.map((sticker) => (
        <div
          key={sticker.id}
          className="floating-photo"
          style={{
            left: `${sticker.left}%`,
            top: `${sticker.initialTop}%`,
            animationDelay: `${sticker.delay}s`,
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}stickers/sticker${sticker.stickerIndex}.png`}
            alt="Sticker"
            className="object-contain opacity-70"
            style={{ width: '120px', height: '120px' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      ))}

      {/* Audio Control Button */}
      {!audioError && (
        <button
          onClick={toggleMute}
          className={`audio-control ${!isMuted ? 'playing' : ''}`}
          title={isMuted ? 'Click to play music' : 'Mute'}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      )}

      <div className="max-w-2xl w-full bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl p-12 text-center relative z-10 animate-fade-in border border-white/50">
        <div className="mb-8 flex justify-center">
          <div className="relative animate-float">
            <Heart className="text-rose-500 fill-rose-500" size={80} />
            <div className="absolute inset-0 animate-ping-slow">
              <Heart className="text-rose-300 fill-rose-300" size={80} />
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          Will You Be My
        </h1>
        <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 bg-clip-text text-transparent mb-8">
          Valentine? 💝
        </h2>

        <p className="text-gray-600 text-lg mb-12 italic">
          Love is not just looking at each other, it's looking in the same direction. ✨
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative h-24">
          <button
            onClick={handleYes}
            onMouseEnter={playHeartbeat}
            style={{ transform: `scale(${yesButtonScale})` }}
            className="px-12 py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-bold text-2xl hover:shadow-2xl hover:scale-110 transition-all duration-300 shadow-lg z-20"
          >
            Yes! ❤️
          </button>

          <button
            onClick={handleNo}
            onMouseEnter={playHeartbeat}
            style={{
              transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)`,
              transition: 'transform 0.3s ease-out'
            }}
            className="px-12 py-5 bg-gray-200 text-gray-700 rounded-full font-bold text-2xl hover:bg-gray-300 transition-all duration-300 shadow-lg hover:scale-95 absolute sm:relative z-10"
          >
            {noButtonMessages[Math.min(noClickCount, noButtonMessages.length - 1)]}
          </button>
        </div>

        {noClickCount > 0 && (
          <p className="mt-8 text-rose-500 font-semibold animate-bounce">
            Notice the "Yes" button is getting bigger? 👀
          </p>
        )}

        <div className="mt-12 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Heart
              key={i}
              className="text-rose-300 fill-rose-300 animate-pulse"
              size={20}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
