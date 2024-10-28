import Link from "next/link";
export default function Home() {

  return (
    <div className="flex flex-col items-center h-screen rounded-full bg-red-800">
      <div className="text-6xl mt-10">
        Welcome to Panda Express!
      </div>
      <div className="">
        Produced by: Nick Truong, Anthony Huang, Carson Coen, Ethan Ghoreishi, Nathan Cornelius
      </div>
      <div className="text-2xl mt-24">
        Login As:
      </div>
      <div className="flex flex-col items-center w-full gap-y-6 my-7">
        <Link href="/customerView" className="w-1/6 py-10 bg-red-600 text-white rounded hover:scale-110 hover:duration-300 text-center">Customer</Link>
        <Link href="/cashierView" className="w-1/6 py-10 bg-red-600 text-white rounded hover:scale-110 hover:duration-300 text-center">Cashier</Link>
        <Link href="/managerView" className="w-1/6 py-10 bg-red-600 text-white rounded hover:scale-110 hover:duration-300 text-center">Manager</Link>
      </div>
      <div className="text-2xl mt-22">
        <Link href = "/menuBoardView">Or View Menu</Link>
      </div>
    </div>
  );
}