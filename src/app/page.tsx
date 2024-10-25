import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen">
      <div className="text-6xl mt-10">
        Welcome to Panda Express!
      </div>
      <div className="">
        Produced by: Nick Truong, Anthony Huang, Carson Coen, Ethan Ghoreishi, Nathan Cornelius
      </div>
      <div className="text-2xl mt-24">
        Login As:
      </div>
      <button className="w-1/4 bg-black text-white rounded">Customer</button>
      <button className="w-1/4 bg-black text-white rounded">Cashier</button>
      <button className="w-1/4 bg-black text-white rounded">Manager</button>
        
    </div>
  );
}
