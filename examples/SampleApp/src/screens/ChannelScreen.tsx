import React, { useContext } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppContext } from '../context/AppContext';
import { AppTheme, StackNavigatorParamList } from '../types';
import { streamTheme } from '../utils/streamTheme';
import { GoBack } from '../icons/GoBack';
import {
  LocalAttachmentType,
  LocalChannelType,
  LocalCommandType,
  LocalEventType,
  LocalMessageType,
  LocalResponseType,
  LocalUserType,
} from '../types';
import {
  Avatar,
  Channel,
  Chat,
  getChannelPreviewDisplayName,
  MessageInput,
  MessageList,
} from 'stream-chat-react-native/v2';
import { Channel as StreamChatChannel } from 'stream-chat';
import { ScreenHeader } from '../components/ScreenHeader';

export type ChannelScreenNavigationProp = StackNavigationProp<
  StackNavigatorParamList,
  'ChannelScreen'
>;
export type ChannelScreenRouteProp = RouteProp<
  StackNavigatorParamList,
  'ChannelScreen'
>;
export type ChannelScreenProps = {
  navigation: ChannelScreenNavigationProp;
  route: ChannelScreenRouteProp;
};

export type ChannelHeaderProps = {
  channel: StreamChatChannel;
};

const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channel }) => {
  const navigation = useNavigation<ChannelScreenNavigationProp>();
  const { chatClient } = useContext(AppContext);
  const { colors } = useTheme() as AppTheme;
  const isOneOnOneConversation =
    Object.values(channel.state.members).length === 2;

  if (isOneOnOneConversation) {
    const { user } = Object.values(channel.state.members).find(
      (m) => m.user?.id !== chatClient?.user?.id,
    );
    return (
      <ScreenHeader
        RightContent={() => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('OneOnOneChannelDetailScreen', {
                channel,
              });
            }}
          >
            <Avatar image={user.image} size={40} />
          </TouchableOpacity>
        )}
        subtitle={'Online for 10 mins'}
        title={getChannelPreviewDisplayName(channel, chatClient)}
      />
    );
  }
  return (
    <ScreenHeader title={getChannelPreviewDisplayName(channel, chatClient)} />
  );
};

export const ChannelScreen: React.FC<ChannelScreenProps> = ({
  route: {
    params: { channelId },
  },
}) => {
  const { chatClient } = useContext(AppContext);
  const channel = chatClient?.channel('messaging', channelId);

  if (!channel || !chatClient) return null;
  return (
    <View style={{ height: '100%' }}>
      <Chat client={chatClient} style={streamTheme}>
        <ChannelHeader channel={channel} />
        <View style={{ flexGrow: 1, flexShrink: 1 }}>
          <Channel channel={channel}>
            <MessageList<
              LocalAttachmentType,
              LocalChannelType,
              LocalCommandType,
              LocalEventType,
              LocalMessageType,
              LocalResponseType,
              LocalUserType
            > />
            <MessageInput />
          </Channel>
        </View>
      </Chat>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    borderBottomColor: 'rgba(0, 0, 0, 0.0677)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
});