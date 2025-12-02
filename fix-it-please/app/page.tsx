import Link from "next/link"
export default function index() {
  return (
    <div 
        className="flex flex-col justify-center items-center min-h-screen gap-6"
        style={{backgroundImage: "url('/opoy7.jpg')", backgroundSize: 'cover', backgroundPosition: 'center'}}
    >
        <h1 className="text-5xl font-extrabold font-serif text-[#F7BD03]">Welcome to Fix It Please</h1>
        <div className="flex gap-6">
            <button className="bg-[#F7BD03] text-[#1e2729] font-bold py-3 px-6 rounded-lg shadow-md
                            hover:bg-[#1e2729] hover:text-[#F7BD03]
                            hover:shadow-lg transition-all duration-200 ease-in-out transform 
                            hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-300">
                <Link href="/pages/login" className="text-center text-2xl font-medium">
                   Login
                </Link>
            </button>
            <button className="bg-[#F7BD03] text-[#1e2729] font-bold py-3 px-6 rounded-lg shadow-md
                            hover:bg-[#1e2729] hover:text-[#F7BD03]
                            hover:shadow-lg transition-all duration-200 ease-in-out transform 
                            hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-300">
                <Link href="/pages/registration" className="text-center text-2xl font-medium">
                    Register
                </Link>
            </button>
        </div>
    </div>
  )
}
