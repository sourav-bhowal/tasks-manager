import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { auth } from "../lib/auth";

// NavBar
export default async function NavBar() {
  // Auth session
  const session = await auth();

  // Return the NavBar
  return (
    <nav className="w-full sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="#" className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-6 w-6" />
            <span>TaskMaster</span>
          </Link>

          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <div className="ml-10 flex items-center space-x-8">
                <Link
                  href="/task"
                  className="hover:text-primary border-b-2 border-transparent hover:border-primary
                  transition duration-300 ease-in-out"
                >
                  My Tasks
                </Link>
              </div>
              <div className="hidden xl:block">
                {!session?.user ? (
                  <div className="ml-10 flex items-center space-x-4">
                    <Link href={"/signin"}>
                      <Button size={"lg"}>SignIn</Button>
                    </Link>
                    <Link href={"/signup"}>
                      <Button size={"lg"} variant={"outline"}>
                        SignUp
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p>Welcome, {session.user.username}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
