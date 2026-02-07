import { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';

function App() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [noClickCount, setNoClickCount] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; left: number; delay: number }>>([]);
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const hearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setFloatingHearts(hearts);
  }, []);

  const handleYes = () => {
    setAnswer('yes');
  };

  const handleNo = () => {
    setNoClickCount(prev => prev + 1);
    if (noClickCount > 2) {
      const randomX = (Math.random() - 0.5) * 200;
      const randomY = (Math.random() - 0.5) * 200;
      setNoButtonOffset({ x: randomX, y: randomY });
    }
  };

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
              animationDelay: `${heart.delay}s`,
            }}
          >
            <Heart className="text-white fill-white" size={30} />
          </div>
        ))}

        <div className="text-center z-10 animate-scale-in">
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
          <p className="text-xl text-white/90 italic drop-shadow-lg">
            This Valentine's Day is going to be amazing!
          </p>
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
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          <Heart className="text-white/30 fill-white/30" size={24} />
        </div>
      ))}

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center relative z-10 animate-fade-in">
        <div className="mb-8 flex justify-center">
          <div className="relative animate-float">
            <Heart className="text-rose-500 fill-rose-500" size={80} />
            <div className="absolute inset-0 animate-ping-slow">
              <Heart className="text-rose-300 fill-rose-300" size={80} />
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          Can You Be My
        </h1>
        <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 bg-clip-text text-transparent mb-8">
          Valentine? 💝
        </h2>

        <p className="text-gray-600 text-lg mb-12 italic">
          "Love is not just looking at each other, it's looking in the same direction" ✨
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative h-24">
          <button
            onClick={handleYes}
            style={{ transform: `scale(${yesButtonScale})` }}
            className="px-12 py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-bold text-2xl hover:shadow-2xl hover:scale-110 transition-all duration-300 shadow-lg z-20"
          >
            Yes! ❤️
          </button>

          <button
            onClick={handleNo}
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
