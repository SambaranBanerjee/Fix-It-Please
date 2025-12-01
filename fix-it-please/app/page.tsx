import Link from "next/link"
export default function index() {
  return (
    <div>
        <h1>Welcome to Fix It Please</h1>
        <div>
            <button>
                <Link href={`/login`}>
                   Login
                </Link>
            </button>
            <button>
                <Link href={`/registration`}>
                    Register
                </Link>
            </button>
        </div>
    </div>
  )
}
