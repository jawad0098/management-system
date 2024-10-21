import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center">
    <Link href={'/signup'}>
    <button className="bg-green-400 text-white p-3 rounded-md">Get Started</button>
    </Link>
    </div>
  );
}
