import { createContext, useState, useEffect, useContext } from "react";
import type { SetStateAction, Dispatch } from "react";
import type { YtChannelDetailsDb } from "~/schema/db";
import { api } from "~/trpc/react";
import { useUserSession } from "./userSession";
import { type SavedYtChannelDetailsOutput } from "~/schema/youtube";
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
  const { session } = useUserSession();
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
