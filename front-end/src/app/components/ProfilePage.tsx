import Image from "next/image";

export default function ProfilePage() {
    return (
        <div className="px-24 py-8 bg-stone-200">
            <div className="flex justify-between">
                <div className="w-1/2 flex items-center justify-center">
                    <Image src="/istockphoto-1682296067-612x612.jpg" alt="Profile" width={300} height={100} priority className="rounded-lg w-1/2 h-auto"/>
                </div>
                <div className="w-1/2 flex flex-col items-start justify-center gap-2">
                    <p className="text-4xl font-bold">
                        Hi im Pael
                    </p>
                    <p className="text-3xl">
                        An architect based in Albay, Philippines
                    </p>
                    <button className="bg-stone-500 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded">
                            go to portfolio
                    </button>
                </div>
            </div>
        </div>
    );
}