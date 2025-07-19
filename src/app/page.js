import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col p-3 gap-3">
        <h1 className="text-cyan-500 text-3xl">Algorithms</h1>
        <Link 
          href="/pathfinding-algorithms" 
          className="cursor-pointer hover:text-cyan-500 text-xl"
        >
          Pathfinding Algorithms (Unweighted Maze)
        </Link>
        <Link 
          href="/sorting-algorithms" 
          className="cursor-pointer hover:text-cyan-500 text-xl"
        >
          Sorting Algorithms
        </Link>
      </div>
    </>
  );
}
