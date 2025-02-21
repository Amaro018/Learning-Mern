"use client"
import Image from "next/image";
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';

export default function ProfilePage() {
    return (
<div className="px-6 sm:px-12 md:px-24 py-8 bg-stone-200">
  <div className="flex flex-col md:flex-row justify-between items-center">
    {/* Profile Image */}
    <div className="w-full md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
      <Image 
        src="/istockphoto-1682296067-612x612.jpg" 
        alt="Profile" 
        width={300} 
        height={100} 
        priority 
        className="rounded-lg w-1/2 h-auto"
      />
    </div>

    {/* Text Content */}
    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-3">
      <p className="text-3xl sm:text-4xl font-bold">Hi, I&apos;m Pael</p>
      <p className="text-xl sm:text-2xl">An architect based in Albay, Philippines</p>
      <div className="flex gap-4">
      <button className="bg-stone-500 hover:bg-stone-700 text-white font-bold py-2 px-6 rounded">
        Go to Portfolio
      </button>
      <button className="bg-blue-700 hover:bg-blue-900 text-white font-bold px-6 rounded flex items-center gap-2">
        <FacebookRoundedIcon sx={{color: 'white'}} />
        <p>Facebook</p>
      </button>
      </div>
    </div>
  </div>
</div>

    );
}