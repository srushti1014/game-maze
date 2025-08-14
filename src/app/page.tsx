import MazePage from "./game/page";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <main className="container mx-auto px-4 py-10">
          
          <MazePage />
        </main>
      </div>
    </>
  );
}
