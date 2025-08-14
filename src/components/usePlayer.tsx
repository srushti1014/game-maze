import { useEffect, useRef, useState } from "react";
import { Cell } from "@/utils/mazeboard";

export function usePlayer(
  mazeGrid: Cell[][],
  rows: number,
  cols: number,
  onWin: () => void
) {
  const [player, setPlayer] = useState({ row: 0, col: 0 });
  const wonRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mazeGrid.length || wonRef.current) return;

      const { row, col } = player;
      const cell = mazeGrid[row][col];
      let newRow = row;
      let newCol = col;

      if (e.key === "ArrowUp" && !cell.walls.top) newRow--;
      else if (e.key === "ArrowDown" && !cell.walls.bottom) newRow++;
      else if (e.key === "ArrowLeft" && !cell.walls.left) newCol--;
      else if (e.key === "ArrowRight" && !cell.walls.right) newCol++;
      else return;

      if (newRow === row && newCol === col) return;

      e.preventDefault(); 
      setPlayer({ row: newRow, col: newCol });

      if (
        newRow === mazeGrid.length - 1 &&
        newCol === mazeGrid[0].length - 1
      ) {
        wonRef.current = true;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            onWin();
          });
        });
      }

    }; 

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player, mazeGrid, rows, cols, onWin]);

  // reset "won" guard & player when maze changes
  useEffect(() => {
    wonRef.current = false;
    setPlayer({ row: 0, col: 0 });
  }, [mazeGrid, rows, cols]);

  return player;
}


// import { useEffect, useState } from "react";
// import { Cell } from "@/utils/mazeboard";

// export function usePlayer(mazeGrid: Cell[][], rows: number, cols: number, onWin: () => void) {
//   const [player, setPlayer] = useState({ row: 0, col: 0 });

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (!mazeGrid.length) return;

//       const { row, col } = player;
//       const cell = mazeGrid[row][col];
//       let newRow = row;
//       let newCol = col;

//       if (e.key === "ArrowUp" && !cell.walls.top) newRow--;
//       else if (e.key === "ArrowDown" && !cell.walls.bottom) newRow++;
//       else if (e.key === "ArrowLeft" && !cell.walls.left) newCol--;
//       else if (e.key === "ArrowRight" && !cell.walls.right) newCol++;

//       if (newRow !== row || newCol !== col) {
//         setPlayer({ row: newRow, col: newCol });

//         if (newRow === rows - 1 && newCol === cols - 1) {
//           setPlayer({ row: newRow, col: newCol });
//           onWin();
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [player, mazeGrid, rows, cols, onWin]);

//   return player;
// }
