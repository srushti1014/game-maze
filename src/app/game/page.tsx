"use client";
import MazeMaker from "@/components/MazeMaker";
import { Cell, MazeBoard } from "@/utils/mazeboard";
import { usePlayer } from "@/components/usePlayer";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const cellSize = 30;

export default function MazePage() {
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [mazeGrid, setMazeGrid] = useState<Cell[][]>([]);
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState("");
  const [growthStep, setGrowthStep] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleWin = () => {
    // alert(`You won Level ${level}! Moving to next...`);
    setShowPrompt(true);
    toast.success(`You won Level ${level}! Moving to next...`)
  };

  const player = usePlayer(mazeGrid, rows, cols, handleWin);

  useEffect(() => {
    if (!difficulty) return;

    if (difficulty === "easy") {
      setRows(5);
      setCols(5);
      setGrowthStep(1);
    } else if (difficulty === "medium") {
      setRows(18);
      setCols(18);
      setGrowthStep(2);
    } else if (difficulty === "hard") {
      setRows(30);
      setCols(30);
      setGrowthStep(3);
    } else if (difficulty === "superhard") {
      setRows(40);
      setCols(40);
      setGrowthStep(4);
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

  return (
    <>
      {!difficulty && (
        <div className="flex justify-center mt-5">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="p-2 rounded-md bg-gradient-to-b from-[#A83159] to-[#922668] text-white border border-[#7dd3fc] shadow-lg shadow-[#0284c7] focus:ring-2 focus:ring-[#38bdf8] focus:outline-none transition-all duration-200"
          >
            <option value="" className="bg-[#922668]">Select Difficulty</option>
            <option value="easy" className="bg-[#922668]">Easy</option>
            <option value="medium" className="bg-[#922668]">Medium</option>
            <option value="hard" className="bg-[#922668]">Hard</option>
            <option value="superhard" className="bg-[#922668]">Super Hard</option>
          </select>
        </div>
      )}

      {difficulty && (
        <>
          <h1 className="text-4xl font-bold mb-6 text-center">
            Maze Runner Adventure
          </h1>
          <p className="text-xl text-center mb-8 opacity-90">
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
