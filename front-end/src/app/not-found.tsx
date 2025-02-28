"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl">Page not found. Redirecting to homepage...</p>
    </div>
  );
};

export default NotFoundPage;
