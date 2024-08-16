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
            updateSeenMessage:(state,action)=>{
                  const conversationId = action.payload; // Expecting the conversation ID to be passed in the payload
                  state.conversation = state.conversation.map((conversation) => {
                      if (conversation._id === conversationId) {
                          return {
                              ...conversation,
                              lastMessage: {
                                  ...conversation.lastMessage,
                                  seen: true,
                              },
                          };
                      }
                      return conversation;
                  });
            }
      },
});
export const { fetchedConversation, updateLastMessage, updateSeenMessage } = conversationSlice.actions;
export default conversationSlice.reducer

 // if you want to use local state for manage state or storing data
 
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


// setSelectedConversation((prev)=>{
//       const updatedConversation = prev.map((conversation)=>{
//             if(conversation._id===conversation){
//             return{
//                   ...conversation,
//                   lastMessage:{
//                         ...conversation.lastMessage,
//                         seen:true,
//                   }
//             }
//       }
//       return conversation;
//       })
//       return updatedConversation;
// })