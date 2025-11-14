// "use effect"
// import { Button } from '@/components/ui/button'
// import { Mic, Paperclip, Send } from 'lucide-react'
// import React, { useContext, useEffect, useState } from 'react'
// import AiMultiModels from './AiMultiModels'
// import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
// import axios from 'axios'

// function ChatInputBox() {

//     const [userInput, setUserInput] = useState()
//     const { messages, setMessages, aiSelectedModels, setAiSelectedModels } = useContext(AiSelectedModelContext)


//     const handleSend = async () => {
//         if (!userInput.trim()) return;

//         // 1️⃣ Add user message to all enabled models
//         setMessages((prev) => {
//             const updated = { ...prev };
//             Object.keys(aiSelectedModels).forEach((modelKey) => {
//                 updated[modelKey] = [
//                     ...(updated[modelKey] ?? []),
//                     { role: "user", content: userInput },
//                 ];
//             });
//             return updated;
//         });

//         const currentInput = userInput; // capture before reset
//         setUserInput("");

//         // 2️⃣ Fetch response from each enabled model


//         try {
//             const result = await axios.post("/api/ai-multi-model", {
//                 model: modelInfo.modelId,
//                 msg: [{ role: "user", content: currentInput }],
//                 parentModel,
//             });

//             const { aiResponse, model } = result.data;

//             // 3️⃣ Add AI response to that model’s messages
//             setMessages((prev) => {
//                 const updated = [...(prev[parentModel] ?? [])];
//                 const loadingIndex = updated.findIndex((m) => m.loading);

//                 if (loadingIndex !== -1) {
//                     updated[loadingIndex] = {
//                         role: "assistant",
//                         content: aiResponse,
//                         model,
//                         loading: false,
//                     };
//                 } else {
//                     // fallback if no loading msg found
//                     updated.push({
//                         role: "assistant",
//                         content: aiResponse,
//                         model,
//                         loading: false,
//                     });
//                 }

//                 return { ...prev, [parentModel]: updated };
//             });
//         } catch (err) {
//             console.error(err);
//             setMessages((prev) => ({
//                 ...prev,
//                 [parentModel]: [
//                     ...(prev[parentModel] ?? []),
//                     { role: "assistant", content: "⚠️ Error fetching response." },
//                 ],
//             }));
//         }
//     };

//     useEffect(() => {
//         console.log("MESSAGES:", messages)
//     }, [messages])

//     return (
//         <div className='relative min-h-screen'>
//             {/* Page Content */}
//             <div>
//                 <AiMultiModels />
//             </div>
//             {/* Fixed Chat Input */}
//             <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4'>
//                 <div className='w-full border rounded-xl shadow-md max-w-2xl p-4'>
//                     <input
//                         onChange={(event) => setUserInput(event.target.value)}
//                         type="text" placeholder='Ask me anything...'
//                         className='border-0 outline-none' />
//                     <div className='mt-3 flex justify-between items-center'>
//                         <Button variant={"ghost"} className="" size="icon">
//                             <Paperclip className='h-5 w-5' />
//                         </Button>
//                         <div className='flex gap-5'>
//                             <Button variant={"ghost"} size="icon"><Mic /></Button>
//                             <Button
//                                 onClick={handleSend}
//                                 className={'bg-radial from-purple-500 to-indigo-950'} size="icon"><Send /></Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ChatInputBox






// "use effect"
// import { Button } from '@/components/ui/button'
// import { Mic, Paperclip, Send } from 'lucide-react'
// import React, { useContext, useEffect, useState } from 'react'
// import AiMultiModels from './AiMultiModels'
// import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
// import axios from 'axios'

// function ChatInputBox() {

//     const [userInput, setUserInput] = useState()
//     const { messages, setMessages, aiSelectedModels, setAiSelectedModels } = useContext(AiSelectedModelContext)



//     const handleSend = async () => {
//         if (!userInput?.trim()) return;
//         // ✅ Guard if aiSelectedModels not ready
//         if (!aiSelectedModels || Object.keys(aiSelectedModels).length === 0) {
//             console.warn("⚠️ aiSelectedModels not ready yet");
//             return;
//         }

//         const currentInput = userInput.trim();
//         setUserInput("");

//         // 1️⃣ Add user message to all enabled models
//         setMessages((prev) => {
//             const updated = { ...prev };
//             Object.keys(aiSelectedModels ?? {}).forEach((modelKey) => {
//                 updated[modelKey] = [
//                     ...(updated[modelKey] ?? []),
//                     { role: "user", content: currentInput },
//                 ];
//             });
//             return updated;
//         });

//         // 🔄 NEW: Optimistically add a "loading" assistant message for each model *immediately*
//         setMessages((prev) => {
//             const updated = { ...prev };
//             Object.keys(aiSelectedModels ?? {}).forEach((modelKey) => {
//                 updated[modelKey] = [
//                     ...(updated[modelKey] ?? []),
//                     {
//                         role: "assistant",
//                         content: 'loading',  // ← This triggers your loader in AiMultiModels
//                         model: modelKey,     // ← Optional: Pre-set for rendering
//                         loading: true        // ← Optional: For future filtering if needed
//                     },
//                 ];
//             });
//             return updated;
//         });

//         // 2️⃣ Fetch response from each model in parallel (use Promise.all for true parallelism)
//         const requests = Object.entries(aiSelectedModels ?? {}).map(([parentModel, modelInfo]) =>
//             axios
//                 .post("/api/ai-multi-model", {
//                     model: modelInfo.modelId,
//                     msg: [{ role: "user", content: currentInput }],
//                     parentModel,
//                 })
//                 .then((result) => ({ parentModel, ...result.data }))  // Return with parentModel for easy update
//                 .catch((err) => ({
//                     parentModel,
//                     error: true,
//                     aiResponse: "⚠️ Error fetching response.",
//                     model: parentModel
//                 }))  // Handle errors gracefully
//         );

//         try {
//             const results = await Promise.all(requests);  // ← Now truly parallel!

//             // 3️⃣ Update each model's messages with real responses (replaces the loading one)
//             setMessages((prev) => {
//                 const updated = { ...prev };
//                 results.forEach(({ parentModel, aiResponse, model, error }) => {
//                     // Find the index of the last assistant message (the loading one) and replace it
//                     const modelMessages = updated[parentModel] ?? [];
//                     const lastAssistantIndex = modelMessages.reduce((lastIdx, msg, idx) =>
//                         msg.role === 'assistant' && msg.content === 'loading' ? idx : lastIdx, -1
//                     );

//                     if (lastAssistantIndex !== -1) {
//                         // Replace loading with real response
//                         updated[parentModel] = [
//                             ...modelMessages.slice(0, lastAssistantIndex),
//                             {
//                                 role: "assistant",
//                                 content: error ? aiResponse : aiResponse,  // Use error msg if failed
//                                 model: model ?? parentModel,
//                                 loading: false,  // ← No longer loading
//                             },
//                             ...modelMessages.slice(lastAssistantIndex + 1),  // Keep any messages after it (unlikely, but safe)
//                         ];
//                     } else {
//                         // Fallback: Append if loading wasn't found (edge case)
//                         updated[parentModel] = [
//                             ...modelMessages,
//                             {
//                                 role: "assistant",
//                                 content: error ? aiResponse : aiResponse,
//                                 model: model ?? parentModel,
//                                 loading: false,
//                             },
//                         ];
//                     }
//                 });
//                 return updated;
//             });
//         } catch (err) {
//             console.error("Bulk request failed:", err);
//             // Optional: Handle full batch failure (e.g., network error) by updating all to error state
//         }
//     };



//     useEffect(() => {
//         console.log(messages)
//     }, [messages])

//     return (
//         <div className='relative min-h-screen'>
//             {/* Page Content */}
//             <div>
//                 <AiMultiModels />
//             </div>
//             {/* Fixed Chat Input */}
//             <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4'>
//                 <div className='w-full border rounded-xl shadow-md max-w-2xl p-4'>
//                     <input
//                         value={userInput}
//                         onChange={(event) => setUserInput(event.target.value)}
//                         type="text" placeholder='Ask me anything...'
//                         className='border-0 outline-none w-full' />
//                     <div className='mt-3 flex justify-between items-center'>
//                         <Button variant={"ghost"} className="" size="icon">
//                             <Paperclip className='h-5 w-5' />
//                         </Button>
//                         <div className='flex gap-5'>
//                             <Button variant={"ghost"} size="icon"><Mic /></Button>
//                             <Button
//                                 onClick={handleSend}
//                                 className={'bg-radial from-purple-500 to-indigo-950'} size="icon"><Send /></Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ChatInputBox



// "use client"

// import { Button } from '@/components/ui/button'
// import { Mic, Paperclip, Send } from 'lucide-react'
// import React, { useContext, useEffect, useState } from 'react'
// import AiMultiModels from './AiMultiModels'
// import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
// import axios from 'axios'
// import { v4 as uuidv4 } from 'uuid'
// import { doc, getDoc, setDoc } from 'firebase/firestore'
// import { db } from '@/config/FirebaseConfig'
// import { useUser } from '@clerk/nextjs'
// import { useSearchParams } from 'next/navigation'

// function ChatInputBox() {
//     const [userInput, setUserInput] = useState("")
//     const [chatId, setChatId] = useState()
//     const { messages, setMessages, aiSelectedModels } = useContext(AiSelectedModelContext)

//     const { user } = useUser()

//     const params = useSearchParams()


//     useEffect(() => {
//         const chatId_ = params.get('chatId')
//         if (chatId_) {
//             setChatId(chatId_)
//             GetMessages(chatId_)
//         } else {
//             setChatId(uuidv4())
//         }

//     }, [params])

//     const handleSend = async () => {
//         if (!userInput?.trim()) return;

//         // ✅ Guard if aiSelectedModels not ready
//         if (!aiSelectedModels || Object.keys(aiSelectedModels).length === 0) {
//             console.warn("⚠️ aiSelectedModels not ready yet");
//             return;
//         }

//         const currentInput = userInput.trim();
//         setUserInput("");

//         console.log("📤 Sending to models:", Object.keys(aiSelectedModels));

//         // 1️⃣ Add user message to all enabled models
//         setMessages((prev) => {
//             const updated = { ...prev };
//             Object.keys(aiSelectedModels).forEach((modelKey) => {
//                 updated[modelKey] = [
//                     ...(updated[modelKey] ?? []),
//                     { role: "user", content: currentInput },
//                 ];
//             });
//             return updated;
//         });

//         // 2️⃣ Add loading state for all models
//         setMessages((prev) => {
//             const updated = { ...prev };
//             Object.keys(aiSelectedModels).forEach((modelKey) => {
//                 updated[modelKey] = [
//                     ...(updated[modelKey] ?? []),
//                     {
//                         role: "assistant",
//                         content: 'loading',
//                         model: modelKey,
//                         loading: true
//                     },
//                 ];
//             });
//             return updated;
//         });

//         // 3️⃣ Fetch responses from ALL models in parallel
//         const requestPromises = Object.entries(aiSelectedModels).map(([parentModel, modelInfo]) => {
//             if (!modelInfo.modelId || !modelInfo.enable) {
//                 console.warn(`⚠️ Skipping ${parentModel}: Missing modelId or not enabled`);
//                 return null; // Skip invalid models
//             }

//             console.log(`🚀 Requesting from ${parentModel} (${modelInfo.modelId})`);

//             return axios
//                 .post("/api/ai-multi-model", {
//                     model: modelInfo.modelId,
//                     msg: [{ role: "user", content: currentInput }],
//                     parentModel,
//                 })
//                 .then((result) => {
//                     console.log(`✅ Response from ${parentModel}:`, result.data);
//                     return { parentModel, ...result.data };
//                 })
//                 .catch((err) => {
//                     console.error(`❌ Error from ${parentModel}:`, err);
//                     return {
//                         parentModel,
//                         error: true,
//                         aiResponse: `⚠️ Error: ${err.message}`,
//                         model: parentModel
//                     };
//                 });
//         });

//         // Filter out skipped (null) promises
//         const validRequests = requestPromises.filter(promise => promise !== null);

//         try {
//             const results = await Promise.all(validRequests);
//             console.log("📥 All responses received:", results);

//             // 4️⃣ Update messages with real responses
//             setMessages((prev) => {
//                 const updated = { ...prev };

//                 results.forEach(({ parentModel, aiResponse, model, error }) => {
//                     const modelMessages = updated[parentModel] ?? [];

//                     // Find and replace the loading message
//                     const lastLoadingIndex = modelMessages.reduce((lastIdx, msg, idx) =>
//                         msg.role === 'assistant' && msg.content === 'loading' ? idx : lastIdx, -1
//                     );

//                     if (lastLoadingIndex !== -1) {
//                         updated[parentModel] = [
//                             ...modelMessages.slice(0, lastLoadingIndex),
//                             {
//                                 role: "assistant",
//                                 content: aiResponse,
//                                 model: model ?? parentModel,
//                                 loading: false,
//                             },
//                             ...modelMessages.slice(lastLoadingIndex + 1),
//                         ];
//                     } else {
//                         // Fallback: append if loading wasn't found
//                         updated[parentModel] = [
//                             ...modelMessages,
//                             {
//                                 role: "assistant",
//                                 content: aiResponse,
//                                 model: model ?? parentModel,
//                                 loading: false,
//                             },
//                         ];
//                     }
//                 });

//                 return updated;
//             });

//         } catch (err) {
//             console.error("❌ Bulk request failed:", err);
//         }
//     };

//     // Handle Enter key
//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSend();
//         }
//     };



//     useEffect(() => {
//         console.log("💬 Current messages state:", messages);
//         console.log("🤖 Current selected models:", aiSelectedModels);
//     }, [messages, aiSelectedModels]);

//     useEffect(() => {

//         if (messages) {
//             SaveMessages()
//         }
//     }, [messages]);


//     const SaveMessages = async () => {
//         // ✅ Guard: Don't save if chatId or user isn't ready
//         if (!chatId || !user?.primaryEmailAddress?.emailAddress) {
//             console.warn("⚠️ Skipping save: chatId or user not ready");
//             return;
//         }

//         const docRef = doc(db, 'chatHistory', chatId)
//         await setDoc(docRef, {
//             chatId: chatId,
//             messages: messages,
//             userEmail: user?.primaryEmailAddress.emailAddress,
//             lastUpdated: Date.now()
//         })
//     }

//     const GetMessages = async () => {

//         const docRef = doc(db, 'chatHistory', chatId)
//         const docSnap = await getDoc(docRef)
//         console.log("GETMESSAGES🕯️:", docSnap.data())
//         const docData = docSnap.data()
//         setMessages(docData.messages)

//     }

//     return (
//         <div className='relative min-h-screen'>
//             {/* Page Content */}
//             <div>
//                 <AiMultiModels />
//             </div>

//             {/* Fixed Chat Input */}
//             <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4'>
//                 <div className='w-full border rounded-xl shadow-md max-w-2xl p-4 bg-background'>
//                     <input
//                         value={userInput}
//                         onChange={(event) => setUserInput(event.target.value)}
//                         onKeyPress={handleKeyPress}
//                         type="text"
//                         placeholder='Ask me anything...'
//                         className='border-0 outline-none w-full bg-transparent'
//                     />
//                     <div className='mt-3 flex justify-between items-center'>
//                         <Button variant={"ghost"} className="" size="icon">
//                             <Paperclip className='h-5 w-5' />
//                         </Button>
//                         <div className='flex gap-5'>
//                             <Button variant={"ghost"} size="icon">
//                                 <Mic />
//                             </Button>
//                             <Button
//                                 onClick={handleSend}
//                                 disabled={!userInput?.trim()}
//                                 className={'bg-radial from-purple-500 to-indigo-950'}
//                                 size="icon"
//                             >
//                                 <Send />
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ChatInputBox


"use client"

import { Button } from '@/components/ui/button'
import { Mic, Paperclip, Send } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import AiMultiModels from './AiMultiModels'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import { useUser } from '@clerk/nextjs'
import { useSearchParams, useRouter } from 'next/navigation'

function ChatInputBox() {
    const [userInput, setUserInput] = useState("")
    const [chatId, setChatId] = useState(null)
    const { messages, setMessages, aiSelectedModels } = useContext(AiSelectedModelContext)

    const { user } = useUser()
    const params = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const chatId_ = params.get('chatId')

        if (chatId_) {
            // Only load if it's a different chatId
            if (chatId_ !== chatId) {
                setChatId(chatId_)
                GetMessages(chatId_)
            }
        } else {
            // New chat - generate new ID, clear messages, update URL
            const newChatId = uuidv4()
            setChatId(newChatId)
            setMessages({}) // Clear messages for new chat
            router.push(`?chatId=${newChatId}`)
        }
    }, [params.get('chatId')]) // Watch specifically for chatId changes

    const handleSend = async () => {
        if (!userInput?.trim()) return;

        // ✅ Guard if aiSelectedModels not ready
        if (!aiSelectedModels || Object.keys(aiSelectedModels).length === 0) {
            console.warn("⚠️ aiSelectedModels not ready yet");
            return;
        }

        const currentInput = userInput.trim();
        setUserInput("");

        console.log("📤 Sending to models:", Object.keys(aiSelectedModels));

        // 1️⃣ Add user message to all enabled models
        setMessages((prev) => {
            const updated = { ...prev };
            Object.keys(aiSelectedModels).forEach((modelKey) => {
                if (aiSelectedModels[modelKey].enable) {
                    updated[modelKey] = [
                        ...(updated[modelKey] ?? []),
                        { role: "user", content: currentInput },
                    ];
                }
            });
            return updated;
        });

        // 2️⃣ Add loading state for all enabled models
        setMessages((prev) => {
            const updated = { ...prev };
            Object.keys(aiSelectedModels).forEach((modelKey) => {
                if (aiSelectedModels[modelKey].enable) {
                    updated[modelKey] = [
                        ...(updated[modelKey] ?? []),
                        {
                            role: "assistant",
                            content: 'loading',
                            model: modelKey,
                            loading: true
                        },
                    ];
                }
            });
            return updated;
        });

        // 3️⃣ Fetch responses from ALL enabled models in parallel
        const requestPromises = Object.entries(aiSelectedModels)
            .filter(([_, modelInfo]) => modelInfo.enable && modelInfo.modelId)
            .map(([parentModel, modelInfo]) => {
                console.log(`🚀 Requesting from ${parentModel} (${modelInfo.modelId})`);

                return axios
                    .post("/api/ai-multi-model", {
                        model: modelInfo.modelId,
                        msg: [{ role: "user", content: currentInput }],
                        parentModel,
                    })
                    .then((result) => {
                        console.log(`✅ Response from ${parentModel}:`, result.data);
                        return { parentModel, ...result.data };
                    })
                    .catch((err) => {
                        console.error(`❌ Error from ${parentModel}:`, err);
                        return {
                            parentModel,
                            error: true,
                            aiResponse: `⚠️ Error: ${err.message}`,
                            model: parentModel
                        };
                    });
            });

        try {
            const results = await Promise.all(requestPromises);
            console.log("📥 All responses received:", results);

            // 4️⃣ Update messages with real responses
            setMessages((prev) => {
                const updated = { ...prev };

                results.forEach(({ parentModel, aiResponse, model, error }) => {
                    const modelMessages = updated[parentModel] ?? [];

                    // Find and replace the loading message
                    const lastLoadingIndex = modelMessages.reduce((lastIdx, msg, idx) =>
                        msg.role === 'assistant' && msg.content === 'loading' ? idx : lastIdx, -1
                    );

                    if (lastLoadingIndex !== -1) {
                        updated[parentModel] = [
                            ...modelMessages.slice(0, lastLoadingIndex),
                            {
                                role: "assistant",
                                content: aiResponse,
                                model: model ?? parentModel,
                                loading: false,
                            },
                            ...modelMessages.slice(lastLoadingIndex + 1),
                        ];
                    } else {
                        // Fallback: append if loading wasn't found
                        updated[parentModel] = [
                            ...modelMessages,
                            {
                                role: "assistant",
                                content: aiResponse,
                                model: model ?? parentModel,
                                loading: false,
                            },
                        ];
                    }
                });

                return updated;
            });

        } catch (err) {
            console.error("❌ Bulk request failed:", err);
        }
    };

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        console.log("💬 Current messages state:", messages);
        console.log("🤖 Current selected models:", aiSelectedModels);
    }, [messages, aiSelectedModels]);

    useEffect(() => {
        // Only save if we have valid data
        if (messages && Object.keys(messages).length > 0 && chatId && user) {
            SaveMessages()
        }
    }, [messages]);

    const SaveMessages = async () => {
        // ✅ Guard: Don't save if chatId or user isn't ready
        if (!chatId || !user?.primaryEmailAddress?.emailAddress) {
            console.warn("⚠️ Skipping save: chatId or user not ready");
            return;
        }

        try {
            const docRef = doc(db, 'chatHistory', chatId)
            await setDoc(docRef, {
                chatId: chatId,
                messages: messages,
                userEmail: user?.primaryEmailAddress.emailAddress,
                lastUpdated: Date.now()
            })
            console.log("✅ Messages saved successfully")
        } catch (error) {
            console.error("❌ Error saving messages:", error)
        }
    }

    const GetMessages = async (chatIdToFetch) => {
        try {
            const docRef = doc(db, 'chatHistory', chatIdToFetch)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                console.log("GETMESSAGES🕯️:", docSnap.data())
                const docData = docSnap.data()
                setMessages(docData.messages || {})
            } else {
                console.log("No chat found with this ID")
                setMessages({})
            }
        } catch (error) {
            console.error("❌ Error fetching messages:", error)
            setMessages({})
        }
    }

    return (
        <div className='relative min-h-screen'>
            {/* Page Content */}
            <div>
                <AiMultiModels />
            </div>

            {/* Fixed Chat Input */}
            <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4'>
                <div className='w-full border rounded-xl shadow-md max-w-2xl p-4 bg-background'>
                    <input
                        value={userInput}
                        onChange={(event) => setUserInput(event.target.value)}
                        onKeyPress={handleKeyPress}
                        type="text"
                        placeholder='Ask me anything...'
                        className='border-0 outline-none w-full bg-transparent'
                    />
                    <div className='mt-3 flex justify-between items-center'>
                        <Button variant={"ghost"} className="" size="icon">
                            <Paperclip className='h-5 w-5' />
                        </Button>
                        <div className='flex gap-5'>
                            <Button variant={"ghost"} size="icon">
                                <Mic />
                            </Button>
                            <Button
                                onClick={handleSend}
                                disabled={!userInput?.trim()}
                                className={'bg-radial from-purple-500 to-indigo-950'}
                                size="icon"
                            >
                                <Send />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatInputBox