import { CometChatConversationListWithMessages } from "../../lib/cometchat";
import { CometChatUI } from "../../lib/cometchat/"
import React from "react";
export default function Chat(props) {

  console.log("Props")
  console.log(props.location.state)
  let userData = props.location.state

  let chatComponent;
  if (userData !== undefined) {
    chatComponent = <CometChatConversationListWithMessages chatWithUser={userData} />
  } else {
    chatComponent = <CometChatUI />
  }

  return (
    <div style={{ width: '75vw', height: '80vh' }}>
      {chatComponent}
    </div>
  );
}

// import { CometChatUI } from "./CometChatWorkspace/src";
// import { CometChatUI } from "../../lib/cometchat/"
// import React from "react";

// export default function Chat(props) {

//     console.log('======= /app/inbox props ==========')
//     console.log(props)

//     return (
//       <div style={{width: '800px', height:'800px' }}>
//       	<CometChatUI />
//       </div>
// 	);
// }