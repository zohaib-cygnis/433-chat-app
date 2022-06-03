import { useState, useEffect } from "react";
import { getSession, useSession, signOut } from "next-auth/react";
import { io } from "socket.io-client";
import {
  Button,
  Segment,
  Grid,
  Divider,
  Header,
  Search,
} from "semantic-ui-react";

import { debounce, escapeRegExp, filter } from "lodash";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  ConversationList,
  Conversation,
  Sidebar,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";


export default function Home({ user, conversations }) {
  const { data: session, status } = useSession({
    required: true,
  });

  const [messageInputValue, setMessageInputValue] = useState("");
  const [currentConversation, setCurrentConversation] = useState([]);
  const [receiver, setReceiver] = useState({ name: "Name" });

  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);

  const [users, setUsers] = useState([]);

  const [socket, setSocket] = useState(null);

  // search component state
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [source, setSource] = useState(users);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL.replace("/api", ""), {
      cookie: false,
      transports: ["websocket"],
      auth: (token) => {
        token({
          token: status === "authenticated" && session?.user?.accessToken,
        });
      },
      reconnection: true,
      reconnectionAttempts: 100,
      reconnectionDelay: 500,
      reconnectionDelayMax: 1000,
      timeout: 1000,
      autoConnect: true,
      format: "json",
    });

    newSocket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    setSocket(newSocket);
    setThreads(conversations);
    setCurrentConversation(threads[0]);

    setReceiver(() => {
      if (threads?.length) {
        const firstThread = threads[0];
        const receiver =
          firstThread.user1.id === user._id
            ? firstThread.user2
            : firstThread.user1;

        setReceiver(receiver);
      }
    });

    return () => newSocket.close(); // on unmount
  }, [setSocket, status, session, conversations, threads, user._id]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (status === "authenticated" && mounted) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user.accessToken}`,
            },
          }
        );
        if (response.ok) {
          const { data } = await response.json();
          setUsers(data);
        }
      }
    }
    fetchData();
    return () => (mounted = false);
  }, [session, status]);

  useEffect(() => {
    setSource(users);
  }, [users]);

  const handleSearchChange = (e, { value }) => {
    setValue(value);
    const re = new RegExp(escapeRegExp(value), "i");
    const isMatch = (result) => re.test(result.name);

    let data = filter(source, isMatch);

    if (data.length) {
      data = data.map((user) => {
        return Object.assign(
          {},
          {
            title: user.name,
            id: user._id,
          }
        );
      });
      setResults(data);
    }
    setLoading(false);
  };

  const handleResultSelect = async (e, { result }) => {
    setValue("");

    const conversationsUrl = `${process.env.NEXT_PUBLIC_API_URL}/conversation`;

    const response = await fetch(conversationsUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      method: "post",
      body: JSON.stringify({
        userId: result.id,
      }),
    });

    const { data } = await response.json();
    if (response.ok && data) {

      setThreads((prev) => {
        const arr = [...prev];
        console.log(arr, "arr1", arr.length);
        arr.push(data);

        console.log(arr, "arr2", arr.length);

        return arr;
      });
      // clickHandler(data)
      // setReceiver(data.name)
    }
  };

  const clickHandler = async (conversation) => {
    findReceiver(conversation);
    await fetchMesssages(conversation._id);
    // setCurrentConversation(conversation);
  };

  const findReceiver = (conversation) => {
    setReceiver(() => {
      if (threads?.length) {
        const firstThread = threads?.find(
          (thread) => thread._id === conversation._id
        );

        const receiver =
          firstThread.user1.id === user._id
            ? firstThread.user2
            : firstThread.user1;
        setReceiver(receiver);
      }
    });
  };

  const fetchMesssages = async (conversationId) => {
    const messagesUrl = `${process.env.NEXT_PUBLIC_API_URL}/message?conversationId=${conversationId}`;

    const response = await fetch(messagesUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    const { data } = await response.json();
    if (response.ok && data) {
      setMessages(data);
    }
  };

  const sendMessage = async () => {
    const newMessage = {
      conversationId: currentConversation._id,
      receiverId: receiver.id,
      receiverName: receiver.name,
      text: messageInputValue,
      senderId: user._id,
    };
    if (socket?.connected) {
      socket.emit("sendMessage", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    }

    setMessageInputValue("");
  };

  const logout = async () => {
    await signOut({
      callbackUrl: "/auth/signin",
    });
  };

  const conversationsElement = threads.map((conversation, index) => (
    <Conversation
      key={index}
      name={
        conversation.user1.id === user._id
          ? conversation.user2.name
          : conversation.user1.name
      }
      lastSenderName={conversation.name}
      onClick={() => clickHandler(conversation)}
    />
  ));

  const messagesElement = messages.map((message, index) => (
    <Message
      key={index}
      model={{
        message: message.text,
        sentTime: message.createdAt,
        sender: message.name,
        direction: message.senderId === user._id ? "outgoing" : "incoming",
        position: "single",
      }}
    />
  ));

  return (
    <>
      <div
        style={{
          height: "660px",
          position: "relative",
        }}
      >
        <div>
          <Segment>
            <Grid columns={2} stackable textAlign="center">
              <Divider vertical>Or</Divider>
              <Grid.Row verticalAlign="middle">
                <Grid.Column>
                  <Header icon>Find Users</Header>
                  {/* <SearchUsers
                    users={users}
                    threads={threads}
                    setThreads={setThreads}
                    session={session}
                  /> */}

                  <Search
                    fluid
                    loading={loading}
                    onResultSelect={handleResultSelect}
                    onSearchChange={debounce(handleSearchChange, 500, {
                      leading: true,
                    })}
                    results={results}
                    value={value}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Button.Group vertical labeled icon>
                    <Button
                      icon="sign-out"
                      content="Sign Out"
                      onClick={logout}
                    />
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </div>
        <MainContainer responsive>
          <Sidebar position="left" scrollable={true}>
            <ConversationList>{conversationsElement}</ConversationList>
          </Sidebar>
          {threads.length && (
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Content userName={receiver?.name} />
              </ConversationHeader>
              <MessageList>{messagesElement}</MessageList>
              <MessageInput
                placeholder="Type message here"
                value={messageInputValue}
                onChange={(val) => setMessageInputValue(val)}
                onSend={sendMessage}
                attachButton={false}
              />
            </ChatContainer>
          )}
        </MainContainer>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const getUserUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/me`;

  const fetchOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  };

  let response = await fetch(getUserUrl, fetchOptions);

  let user = null;

  if (response.ok) {
    const { data } = await response.json();
    user = data;
  }

  const conversationUrl = `${process.env.NEXT_PUBLIC_API_URL}/conversation`;

  response = await fetch(conversationUrl, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  let conversations = null;
  if (response.ok) {
    const { data } = await response.json();
    conversations = data;
  }

  return {
    props: {
      user,
      conversations,
    },
  };
};
