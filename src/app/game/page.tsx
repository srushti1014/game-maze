"use client";
import MazeMaker from "@/components/MazeMaker";
import { Cell, MazeBoard } from "@/utils/mazeboard";
import { usePlayer } from "@/components/usePlayer";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoMdTimer } from "react-icons/io";
import { FaArrowRight, FaStar, FaTrophy } from "react-icons/fa";

// const cellSize = 30;

export default function MazePage() {
  const [difficulty, setDifficulty] = useState("");
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [growthStep, setGrowthStep] = useState(0);
  const [mazeGrid, setMazeGrid] = useState<Cell[][]>([]);
  const [level, setLevel] = useState(1);
  const [showPrompt, setShowPrompt] = useState(false);
  const [cellSize, setCellSize] = useState(30);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0)
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (mazeGrid.length && mazeGrid[0].length) {
      const availableWidth = window.innerWidth * 0.9;  // 90% of viewport width
      const availableHeight = window.innerHeight * 0.9; // 80% of viewport height

      const maxCellWidth = availableWidth / mazeGrid[0].length;
      const maxCellHeight = availableHeight / mazeGrid.length;

      setCellSize(Math.floor(Math.min(maxCellWidth, maxCellHeight)));
    }
  }, [mazeGrid]);

  const handleWin = () => {

    if (timeRef.current) clearInterval(timeRef.current);
    const gainedScore = getScoreForLevel();
    setScore(prev => prev + gainedScore);
    setShowPrompt(true);
    toast.success(`You won this level ${level}!`);
  };

  const player = usePlayer(mazeGrid, rows, cols, handleWin);

  useEffect(() => {
    if (!difficulty) return;

    if (difficulty === "easy") {
      setRows(10);
      setCols(10);
      setGrowthStep(1);
    } else if (difficulty === "medium") {
      setRows(14);
      setCols(14);
      setGrowthStep(2);
    } else if (difficulty === "hard") {
      setRows(25);
      setCols(25);
      setGrowthStep(3);
    } else if (difficulty === "superhard") {
      setRows(35);
      setCols(35);
      setGrowthStep(0);
    }
  }, [difficulty]);

  useEffect(() => {
    if (difficulty) {
      setTime(0);
      if (timeRef.current) clearInterval(timeRef.current);
      timeRef.current = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000);
    }

    return () => {
      if (timeRef.current) clearInterval(timeRef.current)
    }
  }, [difficulty, level])


  useEffect(() => {
    if (rows && cols) {
      const newRows = rows + (level - 1) * growthStep;
      const newCols = cols + (level - 1) * growthStep;

      const maze = new MazeBoard(newRows, newCols);
      maze.generateMaze();
      setMazeGrid(maze.getGrid());
    }
  }, [rows, cols, level, growthStep]);

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setShowPrompt(false);
    setTime(0);

    if (timeRef.current) clearInterval(timeRef.current);
    timeRef.current = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  };

  const getScoreForLevel = () => {
    let baseScore: number = 0;
    if (difficulty === "easy") baseScore = 100;
    if (difficulty === "medium") baseScore = 200;
    if (difficulty === "hard") baseScore = 300;
    if (difficulty === "superhard") baseScore = 500;

    return Math.max(
      baseScore - Math.floor(
        time * (difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : difficulty === "hard" ? 3 : 4)), 10);
  };


  return (
    <>
      <h1 className="text-4xl font-bold mb-10 text-center">
        Maze Runner Adventure
      </h1>

      <div className="flex justify-center mt-5">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-2 rounded-md bg-gradient-to-b from-[#48234e] to-[#922668] text-white border border-[#7dd3fc] shadow-lg shadow-[#0284c7] focus:ring-2 focus:ring-[#3A1C3F] focus:outline-none transition-all duration-200 cursor-pointer"
        >
          <option value="" className="bg-[#A75F91]">Select Difficulty</option>
          <option value="easy" className="bg-[#A75F91]">Easy</option>
          <option value="medium" className="bg-[#A75F91]">Medium</option>
          <option value="hard" className="bg-[#A75F91]">Hard</option>
          <option value="superhard" className="bg-[#A75F91]">Super Hard</option>
        </select>
      </div>


      {difficulty && (
        <>
          <p className="text-xl text-center my-5 opacity-90">
            Navigate through the maze using arrow keys!
          </p>
          <h2 className="text-center">Maze Game - Level {level}</h2>
          <div className="flex justify-center items-center mt-5">
            {mazeGrid.length > 0 && (
              <MazeMaker mazeGrid={mazeGrid} player={player} cellSize={cellSize} />
            )}
          </div>

          <div className="flex flex-col justify-center items-center max-w-lg mx-auto text-xl mt-8">
            <p>Time: {time}</p>
            <p>Score: {score} </p>
          </div>
        </>
      )}

      {showPrompt && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#922668] text-white px-8 py-6 rounded-lg border-2 border-[#38bdf8] flex flex-col items-center max-w-sm w-full mx-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold mb-2">Level {level} Complete!</h3>
            </div>

            <div className="w-full space-y-3 mb-4">
              <div className="flex items-center justify-between bg-[#7a1d55]/50 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <IoMdTimer size={24} className="text-green-500 flex-shrink-0" />
                  <span>Time Taken :</span>
                </div>
                <span className="font-medium">{time}s</span>
              </div>

              <div className="flex items-center justify-between bg-[#7a1d55]/50 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaStar size={20} className="text-yellow-300 flex-shrink-0" />
                  <span>Score Gained :</span>
                </div>
                <span className="font-medium">{getScoreForLevel()}</span>
              </div>

              <div className="flex items-center justify-between bg-[#7a1d55]/50 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaTrophy size={20} className="text-blue-300 flex-shrink-0" />
                  <span>Total Score :</span>
                </div>
                <span className="font-medium">{score}</span>
              </div>
            </div>

            <button
              onClick={nextLevel}
              className="bg-[#36b9f1] text-white px-6 py-2 rounded-md hover:bg-[#0ea5e9] transition-colors mt-2 flex items-center gap-2 font-medium cursor-pointer"
            >
              <FaArrowRight size={16} />
              Next Level
            </button>
          </div>
        </div>
      )}
    </>
  );
}
