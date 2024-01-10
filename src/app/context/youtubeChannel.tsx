import { createContext, useState, useEffect, useContext } from "react";
import type { SetStateAction, Dispatch } from "react";
import type { YtChannelDetailsDb } from "~/schema/db";
import { api } from "~/trpc/react";
import { type SavedYtChannelDetailsOutput } from "~/schema/youtube";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { LOGIN } from "~/utils/route_names";
interface ISelectedYoutubeChannel {
  selectedChannel: YtChannelDetailsDb | undefined;
  setSelectedChannel: Dispatch<SetStateAction<YtChannelDetailsDb | undefined>>;
  ytChannelList: SavedYtChannelDetailsOutput | undefined;
}
const SelectedYoutubeChannel = createContext<ISelectedYoutubeChannel>({
  selectedChannel: undefined,
  setSelectedChannel: () => void 0,
  ytChannelList: undefined,
});

// Create a custom hook to use the state and dispatch
export const useSelectedYoutubeChannel = () => {
  const contextValue = useContext(SelectedYoutubeChannel);
  if (!contextValue) {
    throw new Error(
      "useSelectedYoutubeChannel must be used within a SelectedYoutubeChannelProvider"
    );
  }
  return contextValue;
};

export function SelectedYoutubeChannelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });
  const [selectedChannel, setSelectedChannel] = useState<YtChannelDetailsDb>();

  const { data: ytChannelList, isFetched } =
    api.channel.ytChannelDetails.useQuery<SavedYtChannelDetailsOutput>({
      userId: session?.user.id ?? "",
    });

  useEffect(() => setSelectedChannel(ytChannelList?.channels[0]), [isFetched]);

  const contextValue: ISelectedYoutubeChannel = {
    selectedChannel,
    setSelectedChannel,
    ytChannelList,
  };

  return (
    <SelectedYoutubeChannel.Provider value={contextValue}>
      {children}
    </SelectedYoutubeChannel.Provider>
  );
}
