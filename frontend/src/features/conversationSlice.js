import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
      name: "conversation",
      initialState: {
            conversation: [],
      },
      reducers: {
            fetchedConversation: (state, action) => {
                  state.conversation = action.payload;
            },

            updateLastMessage: (state, action) => {
                  const { conversationId, messageText, sender } = action.payload;
                  const conversation = state.conversation.find(conv => conv._id === conversationId);
                  if (conversation) {
                        conversation.lastMessage = {
                              text: messageText,
                              sender: sender,
                        };
                  }
            },
      },
});
export const { fetchedConversation, updateLastMessage } = conversationSlice.actions;
export default conversationSlice.reducer


// return state.map(conversation => {
//       if (conversation._id === conversationId) {
//         return {
//           ...conversation,
//           lastMessage: {
//             text: messageText,
//             sender: sender,
//           },
//         };
//       }
//       return conversation;
//     });