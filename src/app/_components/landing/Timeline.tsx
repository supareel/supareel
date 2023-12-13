import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { Icons } from "../icons";
import { Progress } from "~/components/ui/progress";

export default function TimelineElement(props: ITimelineElement) {
  return (
    <div className="relative w-full">
      {props.progress == 0 ? (
        <Icons.uncheckedcircle />
      ) : (
        <Icons.checkcircle />
      )}
      <div className="ml-6">
        <h4 className="font-bold text-blue-500 leading-3">{props.title}</h4>
        <div className="max-w-screen-sm text-sm text-gray-500 p-3 bg-gray-50 mt-3 rounded-sm">
          {props.details}
        </div>
        <div className="py-4">
          <span className="mt-1 flex gap-2 text-sm items-center font-semibold text-blue-500">
            <Icons.goal width={16} />
            <Progress value={props.progress} className="w-[80%]" />
          </span>
        </div>
      </div>
    </div>
  );
}
