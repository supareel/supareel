"use client";
import { api } from "~/trpc/react";
import SpinLoader from "../_components/loader";
import { CheckCircle2Icon, CircleDot } from "lucide-react";
import { useEffect, useState } from "react";

export default function MindsDB() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [modelLoadSubStep, setModelLoadSubStep] = useState<
    "none" | "generating" | "error" | "complete"
  >("none");

  // const connectDb = api.mindsdb.connectPlanetScaleDB.useQuery(undefined, {
  //   enabled: false,
  //   refetchOnMount: false,
  // });
  // const modelLoad = api.mindsdb.loadSentimentAnalysisModel.useQuery(undefined, {
  //   enabled: false,
  //   refetchOnMount: false,
  // });

  return (
    <main>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {currentStep < 1 ? (
              <CircleDot className="text-slate-500" />
            ) : currentStep == 1 ? (
              <SpinLoader />
            ) : (
              <CheckCircle2Icon className="text-green-500" />
            )}
            Connecting to planetscale Database
          </div>

          <div className="flex gap-2">
            {currentStep < 2 ? (
              <CircleDot className="text-slate-500" />
            ) : currentStep == 2 ? (
              <SpinLoader />
            ) : (
              <CheckCircle2Icon className="text-green-500" />
            )}
            Loading Text sentiment model
          </div>
        </div>
      </div>
    </main>
  );
}
