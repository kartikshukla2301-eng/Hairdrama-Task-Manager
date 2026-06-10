"use client";

import { supabase } from "@/lib/supabase";
import { FcGoogle } from "react-icons/fc";
export default function Home() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <main className="min-h-screen bg-[#111111] flex flex-col md:flex-row">

      {/* Left Section */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-12">
        <div>
          <h1 className="text-6xl font-bold text-pink-300 mb-4">
            HairDrama
           
          </h1>
          

          <h2 className="text-3xl font-semibold text-white mb-6">
            Task Management Portal
          </h2>

          <p className="text-gray-400 text-lg max-w-md">
            Manage tasks, assign work to team members,
            track progress and receive email notifications
            in one place.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">

        <div className="bg-[#1a1a1a] border border-[#8B1538] rounded-3xl p-10 w-full max-w-md shadow-2xl">

          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome Back 👋
          </h2>

          <p className="text-gray-400 mb-8">
            Sign in with your Google account
          </p>

          <button
            onClick={loginWithGoogle}
            className="
              w-full
              bg-[#8B1538]
              hover:bg-[#a61b46]
              text-white
              py-3
              rounded-xl
              font-semibold
              flex
              items-center
              justify-center
              gap-3
              transition
            "
          >
            <FcGoogle size={24} />
            Continue with Google
          </button>

          <p className="text-gray-500 text-sm text-center mt-6">
            Secure Google OAuth Login
          </p>

        </div>

      </div>

    </main>
  );
}