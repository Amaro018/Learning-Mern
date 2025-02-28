"use client"
import Image from "next/image";
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function ProfilePage() {
    return (
<div className="flex flex-col items-center justify-center bg-slate-300 h-full ">
  <div className="flex flex-col items-center justify-center gap-8">
    {/* Profile Image */}
    <div className="">
      <Image 
        src="/istockphoto-1682296067-612x612.jpg" 
        alt="Profile" 
        width={300} 
        height={100} 
        priority 
        className="rounded-lg w-full h-auto"
      />
    </div>

    {/* Text Content */}
    <div className="text-center">
      <div className="flex flex-col gap-2">
      <p className="text-3xl sm:text-4xl font-bold">Hi, I&apos;m Pael</p>
      <p className="text-xl sm:text-2xl">An architect based in Albay, Philippines</p>
      </div>


      <div className="flex gap-2 justify-center mt-4">
      <button>
        <XIcon sx={{ fontSize: 40, color: 'blue', '&:hover': { color: 'darkblue' } }} />
      </button>
      <button>
        <InstagramIcon sx={{ fontSize: 40, color: 'blue', '&:hover': { color: 'darkblue' } }} />
      </button>
      <button>
        <FacebookRoundedIcon sx={{ fontSize: 40, color: 'blue', '&:hover': { color: 'darkblue' } }} />
      </button>
      </div>
    </div>
  </div>
</div>

    );
}