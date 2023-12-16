import React from "react";
import { Button } from "~/components/ui/button";
import { Icons } from "../icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LOGIN } from "~/utils/route_names";

function HeroSection() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-8xl font-black">Manage your brand</h1>
      <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
        with supareel
      </h1>

      <h6 className="py-10 text-xl text-gray-500 md:w-2/5 text-center">
        Our landing page template works on all devices, so you only have to set
        it up once, and get beautiful results forever.
      </h6>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="default" size="lg" onClick={() => router.push(LOGIN)}>
          Start For Free
        </Button>
        <Button variant="secondary" size="lg">
          Learn more
        </Button>
      </div>

      <div className="py-10 justify-center items-center flex flex-col">
        <Image
          alt="product demo"
          src="https://img.youtube.com/vi/7yLeDg_KuOA/maxresdefault.jpg"
          width={800}
          height={500}
        />
        <Button
          variant="outline"
          className="p-5 w-64 rounded-full bg-white text-blue-500 -m-5"
        >
          <Icons.play />
          <p className="w-full">Watch 2 min demo</p>
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
