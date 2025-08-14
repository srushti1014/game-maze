"use client";
import { useEffect, useRef } from "react";
import { Cell } from "@/utils/mazeboard";

interface MazeCanvasProps {
  mazeGrid: Cell[][];
  cellSize: number;
  player: { row: number; col: number };
}

export default function MazeMaker({
  mazeGrid,
  cellSize,
  player,
}: MazeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background 
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "#A83159");
    gradient.addColorStop(1, "#922668");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // maze walls
    ctx.strokeStyle = "#e9d5ff";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    mazeGrid.forEach((row) => {
      row.forEach((cell) => {
        const x = cell.col * cellSize;
        const y = cell.row * cellSize;

        if (cell.walls.top) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellSize, y);
          ctx.stroke();
        }
        if (cell.walls.right) {
          ctx.beginPath();
          ctx.moveTo(x + cellSize, y);
          ctx.lineTo(x + cellSize, y + cellSize);
          ctx.stroke();
        }
        if (cell.walls.bottom) {
          ctx.beginPath();
          ctx.moveTo(x, y + cellSize);
          ctx.lineTo(x + cellSize, y + cellSize);
          ctx.stroke();
        }
        if (cell.walls.left) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + cellSize);
          ctx.stroke();
        }
      });
    });

    // player 
    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#0284c7";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(
      player.col * cellSize + cellSize / 2,
      player.row * cellSize + cellSize / 2,
      cellSize / 2.9,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    // Add subtle inner glow to player
    ctx.fillStyle = "#7dd3fc";
    ctx.beginPath();
    ctx.arc(
      player.col * cellSize + cellSize / 2,
      player.row * cellSize + cellSize / 2,
      cellSize / 4,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // Draw start point
    // ctx.fillStyle = "#22c55e"; // green
    // ctx.beginPath();
    // ctx.arc(cellSize / 2, cellSize / 2, cellSize / 3, 0, Math.PI * 2);
    // ctx.fill();

    // Draw end point
    ctx.fillStyle = "#22c55e"; // red
    ctx.beginPath();
    ctx.arc(
      (mazeGrid[0].length - 0.5) * cellSize,
      (mazeGrid.length - 0.5) * cellSize,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [mazeGrid, cellSize, player]);

  return (
    <>
      <div className="relative inline-block overflow-hidden shadow-lg border-2 border-purple-300/30">
        <canvas
          ref={canvasRef}
          width={mazeGrid[0]?.length * cellSize || 0}
          height={mazeGrid.length * cellSize || 0}
          className="block"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, transparent 0%, rgba(16, 185, 129, 0.1) 100%)",
          }}
        />
      </div>
    </>
  );
}

// "use client";
// import { useEffect, useRef } from "react";
// import { Cell } from "@/utils/mazeboard";

// interface MazeCanvasProps {
//   mazeGrid: Cell[][];
//   cellSize: number;
//   player: { row: number; col: number };
// }

// export default function MazeMaker({
//   mazeGrid,
//   cellSize,
//   player,
// }: MazeCanvasProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current!;
//     const ctx = canvas.getContext("2d")!;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw background
//     const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
//     gradient.addColorStop(0, "#A83159");
//     gradient.addColorStop(1, "#922668");
//     ctx.fillStyle = gradient;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Draw maze walls
//     ctx.strokeStyle = "#e9d5ff";
//     ctx.lineWidth = 3;
//     ctx.lineJoin = "round";
//     ctx.lineCap = "round";

//     mazeGrid.forEach((row) => {
//       row.forEach((cell) => {
//         const x = cell.col * cellSize;
//         const y = cell.row * cellSize;

//         if (cell.walls.top) {
//           ctx.beginPath();
//           ctx.moveTo(x, y);
//           ctx.lineTo(x + cellSize, y);
//           ctx.stroke();
//         }
//         if (cell.walls.right) {
//           ctx.beginPath();
//           ctx.moveTo(x + cellSize, y);
//           ctx.lineTo(x + cellSize, y + cellSize);
//           ctx.stroke();
//         }
//         if (cell.walls.bottom) {
//           ctx.beginPath();
//           ctx.moveTo(x, y + cellSize);
//           ctx.lineTo(x + cellSize, y + cellSize);
//           ctx.stroke();
//         }
//         if (cell.walls.left) {
//           ctx.beginPath();
//           ctx.moveTo(x, y);
//           ctx.lineTo(x, y + cellSize);
//           ctx.stroke();
//         }
//       });
//     });

//     // Load and draw rocket (player)
//     const rocketImg = new Image();
//     rocketImg.src = "/vector.jpg"; // your rocket image path
//     rocketImg.onload = () => {
//       ctx.drawImage(
//         rocketImg,
//         player.col * cellSize + cellSize * 0.1,
//         player.row * cellSize + cellSize * 0.1,
//         cellSize * 0.8,
//         cellSize * 0.8
//       );
//     };

//     // Load and draw Earth (goal)
//     const earthImg = new Image();
//     earthImg.src = "/earth.png"; // your earth image path
//     earthImg.onload = () => {
//       ctx.drawImage(
//         earthImg,
//         (mazeGrid[0].length - 1) * cellSize + cellSize * 0.1,
//         (mazeGrid.length - 1) * cellSize + cellSize * 0.1,
//         cellSize * 0.8,
//         cellSize * 0.8
//       );
//     };
//   }, [mazeGrid, cellSize, player]);

//   return (
//     <div className="relative inline-block rounded-xl overflow-hidden shadow-lg border-2 border-purple-300/30">
//       <canvas
//         ref={canvasRef}
//         width={mazeGrid[0]?.length * cellSize || 0}
//         height={mazeGrid.length * cellSize || 0}
//         className="block"
//       />
//     </div>
//   );
// }

// "use client";
// import { Cell } from "@/utils/mazeboard";

// interface MazeRendererProps {
//   mazeGrid: Cell[][];
//   player: { row: number; col: number };
//   cellSize: number;
// }

// export default function MazeMaker({ mazeGrid, player, cellSize }: MazeRendererProps) {
//   const containerSize = mazeGrid.length === mazeGrid[0]?.length
//     ? cellSize * (mazeGrid[0]?.length || 0)
//     : "auto";

//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: `repeat(${mazeGrid[0]?.length || 0}, ${cellSize}px)`,
//         width: containerSize,
//         height: containerSize,
//         // gap: "1px",
//         // background: "#B049F2",
//       }}
//     >
//       {mazeGrid.flat().map((cell, i) => {
//         const isPlayer = player.row === cell.row && player.col === cell.col;
//         return (
//           <div
//             key={i}
//             style={{
//               width: cellSize,
//               height: cellSize,
//               boxSizing: "border-box",
//               // borderTop: cell.walls.top ? "2px solid black" : "2px solid transparent",
//               borderRight: cell.walls.right ? "2px solid black" : "2px solid transparent",
//               borderBottom: cell.walls.bottom ? "2px solid black" : "2px solid transparent",
//               // borderLeft: cell.walls.left ? "2px solid black" : "2px solid transparent",
//             }}
//             className={isPlayer ? "bg-green-300" : "bg-[#B049F2]"}
//           >
//             {isPlayer ? "🙂" : ""}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
