"use client";
import Image from "next/image";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useUser } from "../context/UserContext";
export default function ProfilePage() {
  const { currentUser } = useUser();
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Profile Image */}
        <div className="">
          <Image
            src="/istockphoto-1682296067-612x612.jpg"
            alt="Profile"
            width={300}
            height={100}
            priority
            className="rounded-lg w-full h-auto shadow-xl"
          />
        </div>

        {/* Text Content */}
        <div className="text-center">
          <div className="flex flex-col gap-2">
            <p className="text-3xl sm:text-4xl font-bold">
              Hi, I&apos;m {currentUser?.username || "John Doe"}
            </p>
            <p className="text-xl sm:text-2xl">
              {currentUser?.userInformation?.about ||
                "An architect based in Albay, Philippines"}
            </p>
          </div>

          <div className="flex gap-2 justify-center mt-4">
            <button>
              <XIcon
                sx={{
                  fontSize: 40,
                  color: "blue",
                  "&:hover": { color: "darkblue" },
                }}
              />
            </button>
            <button>
              <InstagramIcon
                sx={{
                  fontSize: 40,
                  color: "blue",
                  "&:hover": { color: "darkblue" },
                }}
              />
            </button>
            <button>
              <FacebookRoundedIcon
                sx={{
                  fontSize: 40,
                  color: "blue",
                  "&:hover": { color: "darkblue" },
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
