import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SimonSays = () => {
  const hasStarted = useRef(false);
  const [levelpreview, setLevelpreview] = useState("start");
  const [currLevel, setCurrLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [compMemory, setCompMemory] = useState([]);
  const [playerMemory, setPlayerMemory] = useState([]);
  const [highScore, setHighScore] = useState(0);
  const [blinkTime, setBlinkTime] = useState(150);
  const [inBtwNextTime, setInBtwNextTime] = useState(500);
  const [currentDifficulty, setCurrentDifficulty] = useState("Normal");
  //for polishing code commented code is before polishing code
  const [isGameOver, setIsGameOver] = useState(false);
  const [activeBtn, setActiveBtn] = useState(null);
  const blinkBtn = (id) => {
    setActiveBtn(id);
    console.log(id);

    setTimeout(() => {
      setActiveBtn(null);
    }, blinkTime);
  };

  const getBtnClass = (id, othSpecCss) =>
    `${othSpecCss} h-full aspect-square active:scale-98 active:opacity-75 cursor-pointer transition-all duration-150 ${activeBtn == id ? "bg-white brightness-200" : ""} `;

  const handleKeyDown = () => {
    if (hasStarted.current) return;
    console.log("jay");
    setIsGameOver(false);
    compHandler();
    hasStarted.current = true;
    setLevelpreview("Level " + currLevel);
  };

  // const behaviorfunc = (target) => {
  //   let targetBox = target;
  //   let temp = window.getComputedStyle(targetBox).backgroundColor;
  //   targetBox.style.backgroundColor = "white";

  //   setTimeout(() => {
  //     targetBox.style.backgroundColor = temp;
  //   }, blinkTime);
  // };

  const resetGame = () => {
    setCurrLevel(0);
    setCompMemory([]);
    setPlayerMemory([]);
    setLevelpreview("start");
    hasStarted.current = false;
  };

  // const compHandler = () => {
  //   // let randNum = Math.floor(Math.random() * 10) % 4;
  //   let randNum = Math.floor(Math.random() * 4);

  //   let targetBox = document.getElementById(`${randNum}`);

  //   behaviorfunc(targetBox);

  //   setCompMemory((prev) => [...prev, targetBox.id]);
  // };

  const compHandler = () => {
    let randNum = Math.floor(Math.random() * 4);

    blinkBtn(randNum);

    setCompMemory((prev) => [...prev, randNum]);
  };

  const playerInpHandler = (e) => {
    let targetBox = e.target;

    if (hasStarted.current) {
      // behaviorfunc(targetBox);
      // setPlayerMemory((prev) => [...prev, targetBox.id]);
      setPlayerMemory((prev) => [...prev, Number(targetBox.id)]);
    }
  };

  const nextLevel = () => {
    setPlayerMemory([]);
    setCurrLevel((prev) => prev + 1);
    setScore((prev) => prev + 10);
    compHandler();
  };

  const handleDifficulty = (e) => {
    if (e.target.value === "easy") {
      setBlinkTime(200);
      setInBtwNextTime(1000);
      setCurrentDifficulty("Easy");
    } else if (e.target.value === "normal") {
      setBlinkTime(150);
      setInBtwNextTime(500);
      setCurrentDifficulty("Normal");
    } else if (e.target.value === "hard") {
      setBlinkTime(100);
      setInBtwNextTime(250);
      setCurrentDifficulty("Hard");
    }
  };
  useEffect(() => {
    if (playerMemory.length == 0) return;

    const isCorrect = playerMemory.every((val, i) => val === compMemory[i]);

    if (!isCorrect) {
      // alert("game over lol");
      resetGame();
      console.log(highScore);
      setScore(0);
      setIsGameOver(true);
      localStorage.setItem("HighScore", highScore);
      return;
    }

    if (playerMemory.length === compMemory.length) {
      setTimeout(nextLevel, inBtwNextTime);
      console.log(playerMemory, compMemory);
    }
  }, [playerMemory]);

  useEffect(() => {
    if (score == 0) return;
    // highScore < score && setHighScore(score);
    setHighScore(Math.max(highScore, score));
  }, [score]);

  useEffect(() => {
    if (highScore == 0) {
      setHighScore(localStorage.getItem("HighScore"));
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex-col lg:flex-row flex bg-gray-950 text-white flex-wrap">
      <Header />
      <div className="min-h-[50vh] w-full lg:h-auto lg:w-1/3 flex flex-col items-center justify-evenly">
        <div>
          <h1 className="text-xl sm:text-2xl">Choose Difficulty...</h1>
        </div>
        <div className="flex justify-evenly w-3/5">
          <button
            className="h-10 w-18 sm:w-24 bg-gray-600/75 rounded active:scale-105 max-w-6xl"
            value={"easy"}
            onClick={(e) => {
              handleDifficulty(e);
            }}
          >
            Easy
          </button>
          <button
            className="h-10 w-18 sm:w-24 bg-gray-600/75 rounded active:scale-105"
            value={"normal"}
            onClick={(e) => {
              handleDifficulty(e);
            }}
          >
            Normal
          </button>
          <button
            className="h-10 w-18 sm:w-24 bg-gray-600/75 rounded active:scale-105"
            value={"hard"}
            onClick={(e) => {
              handleDifficulty(e);
            }}
          >
            Hard
          </button>
        </div>
        <div className="min-h-[60%] lg:min-h-[50%] lg:w-3/5 bg-gray-600/75 rounded text-center flex flex-col items-center justify-evenly">
          <h1>
            Chosen Difficulty:{" "}
            <span className="bg-gray-900/75 text-white">
              <b>{currentDifficulty}</b>
            </span>
          </h1>
          <p>
            Time between each level: {inBtwNextTime}ms
            <br />
            Blink time: {blinkTime}ms
          </p>
          <div className="w-[90%] bg-gray-900 text-start whitespace-pre sm:whitespace-nowrap rounded">
            <pre>
              <code>
                {`setTimeout(() => {
    nextlevel();
}, ${inBtwNextTime});`}
                <br />
                <br />
                {`setTimeout(() => {
    behaviourFunc();
}, ${blinkTime});`}
              </code>
            </pre>
          </div>
        </div>
      </div>
      <div className="h-[80vh] lg:h-[84vh] w-full lg:w-1/3 text-center flex flex-col items-center justify-evenly lg:order-0 order-first">
        <div className="h-1/5 flex flex-col items-center justify-center">
          {isGameOver && (
            <>
              <h2 className="text-red-600 text-2xl leading-relaxed">
                Oops Game Over!
              </h2>
            </>
          )}
          <h2 className="text-xl leading-relaxed">
            {levelpreview == "start" ? (
              <>
                Press any key to Start! or
                <br />
                Click on Simon Says button
              </>
            ) : (
              `Level ${currLevel}`
            )}
          </h2>
          <h2 className="text-xl leading-relaxed">Score: {score}</h2>
          <h2 className="text-xl leading-relaxed">HighScore: {highScore}</h2>
        </div>
        <div className="relative w-[300px] sm:w-[320px] md:w-[380px] aspect-square grid grid-cols-2 gap-2 rounded-full bg-gray-900 border-gray-900 border-10 ">
          {/* <div
            onClick={(e) => {
              playerInpHandler(e);
            }}
            id="0"
            className="h-full aspect-square bg-green-500 rounded-tl-full active:scale-98 active:opacity-75 cursor-pointer"
          ></div>
          <div
            onClick={(e) => {
              playerInpHandler(e);
            }}
            id="1"
            className="h-full aspect-square bg-red-500 rounded-tr-full active:scale-98 active:opacity-75 cursor-pointer"
          ></div>
          <div
            onClick={(e) => {
              playerInpHandler(e);
            }}
            id="3"
            className="h-full aspect-square bg-yellow-300 rounded-bl-full active:scale-98 active:opacity-75 cursor-pointer"
          ></div>
          <div
            onClick={(e) => {
              playerInpHandler(e);
            }}
            id="2"
            className="h-full aspect-square bg-blue-400 rounded-br-full active:scale-98 active:opacity-75 cursor-pointer"
          ></div>

           */}
          <div
            onClick={(e) => {
              playerInpHandler(e);
            }}
            id="0"
            className={getBtnClass(0, "bg-green-500 rounded-tl-full")}
          ></div>
          <div
            onClick={(e) => {
              playerInpHandler(e);
            }}
            id="1"
            className={getBtnClass(1, "bg-red-500 rounded-tr-full")}
          ></div>
          <div
            onClick={(e) => {
              playerInpHandler(e);
            }}
            id="3"
            className={getBtnClass(3, "bg-yellow-400 rounded-bl-full")}
          ></div>
          <div
            onClick={(e) => {
              playerInpHandler(e);
            }}
            id="2"
            className={getBtnClass(2, "bg-blue-400 rounded-br-full")}
          ></div>

          <div
            onClick={handleKeyDown}
            className="flex justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square bg-black rounded-full h-30 cursor-pointer active:scale-95"
          >
            <h2 className="text-white text-2xl text-center">
              Simon
              <br />
              Says!
            </h2>
          </div>
        </div>
      </div>
      <div className="h-[50vh] lg:h-auto w-full lg:w-1/3 flex justify-center items-center">
        <div className="h-[85%] lg:h-[80%] w-[85%] bg-gray-600/75 rounded text-center flex flex-col items-center justify-around">
          <h1 className="text-2xl">Instructions:</h1>
          <div className="text-start w-[90%] max-h-[300px] lg:max-h-none overflow-y-auto bg-gray-900 rounded">
            <ul className="list-disc bg-inherit list-inside">
              <li>You can select Difficulty from Choose Difficulty section</li>
              <li>
                Press the <strong>Simon Says!</strong> button to begin the game.
              </li>
              <li>Simon will light up one color and remember the sequence.</li>
              <li>Watch carefully to the pattern.</li>
              <li>
                Repeat the pattern by clicking the colored buttons in the same
                order.
              </li>
              <li>Each correct round adds one more color to the sequence.</li>
              <li>
                Your score and level increase with every successful round.
              </li>
              <li>If you click the wrong color or order, the game ends.</li>
              <li>
                Your final score is shown and the high score may be updated.
              </li>
              <li>
                Press <strong>Start</strong> to play again and beat your high
                score.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SimonSays;
