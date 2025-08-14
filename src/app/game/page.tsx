"use client";
import MazeMaker from "@/components/MazeMaker";
import { Cell, MazeBoard } from "@/utils/mazeboard";
import { usePlayer } from "@/components/usePlayer";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
    if (rows && cols) {
      const newRows = rows + (level - 1) * growthStep;
      const newCols = cols + (level - 1) * growthStep;

      const maze = new MazeBoard(newRows, newCols);
      maze.generateMaze();
      setMazeGrid(maze.getGrid());
    }
  }, [rows, cols, level]);

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setShowPrompt(false);
  };

  window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault(); 
    }
  });



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
        </>
      )}

      {showPrompt && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#922668] text-white px-8 py-6 rounded-lg border border-[#38bdf8] flex flex-col items-center gap-4">
            <h3 className="text-2xl font-bold">Level {level} Complete!</h3>
            <button
              onClick={nextLevel}
              className="bg-[#38bdf8] text-white px-6 py-2 rounded-md hover:bg-[#0ea5e9] transition-colors"
            >
              Next Level
            </button>
          </div>
        </div>
      )}
    </>
  );
}
