import Image from "next/image";

export default function ProjectPage() {
    return (
        <div>
            <h1>Project Page</h1>

            {/* <a href="https://ibb.co/TDSvCWzy"><img src="https://i.ibb.co/SD8sLfqS/japan.png" alt="japan" border="0"></a> */}
            <Image 
                src="https://i.ibb.co/SD8sLfqS/japan.png" 
                alt="Profile" 
                width={600} 
                height={800} 
                className="rounded-lg"
            />
        </div>
    );
}
