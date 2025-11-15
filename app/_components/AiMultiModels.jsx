// import AiModelList from '@/shared/AiModelList'
// import Image from 'next/image'
// import React, { useContext, useState } from 'react'
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Loader, Lock, LockIcon, MessageSquare } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
// import { useUser } from '@clerk/nextjs'
// import { doc, updateDoc } from 'firebase/firestore'
// import { db } from '@/config/FirebaseConfig'

// function AiMultiModels() {

//     const [aiModelList, setAiModelList] = useState(AiModelList)



//     const { messages, setMessages, aiSelectedModels, setAiSelectedModels } = useContext(AiSelectedModelContext)

//     const { user } = useUser()

//     const onToggleChange = (model, value) => {
//         setAiModelList((prev) =>
//             prev.map((m) =>
//                 m.model === model ? { ...m, enable: value } : m)
//         )
//     }

//     const onSelectedValue = async (parentModel, value) => {
//         setAiSelectedModels(prev => ({
//             ...prev,
//             [parentModel]: {
//                 modelId: value
//             }
//         }))

//         // Update it to firebase
//         const docRef = doc(db, "user", user?.primaryEmailAddress.emailAddress)
//         await updateDoc(docRef, {
//             selectedModelPref: aiSelectedModels
//         })

//     }

//     return (
//         <div className='flex flex-1 h-[75vh] border-b bg-radial from-purple-500 to-indigo-950 rounded-lg'>
//             {aiModelList.map((model, index) => (
//                 <div key={index} className={`flex flex-col border-r h-full overflow-auto
//                 ${model.enable ? 'flex-1 min-w-[400px]' : "w-[100px] flex-none"}
//                 `}>
//                     <div className='flex w-full h-[70px] items-center justify-between border-b p-4 bg-radial from-purple-500 to-indigo-950 rounded-b-lg' key={index}>
//                         <div className='flex items-center gap-4'>
//                             <Image src={model.icon} alt='Logo' width={26} height={26} />

//                             {model.enable &&
//                                 <Select
//                                     disabled={model.premium}
//                                     onValueChange={(value) => onSelectedValue(model.model, value)}
//                                     defaultValue={aiSelectedModels?.[model.model]?.modelId ?? ""} >
//                                     <SelectTrigger className="w-[180px] text-black data-[placeholder]:text-black">
//                                         <SelectValue placeholder={aiSelectedModels?.[model.model]?.modelId ?? "Select a model"} />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectGroup className="px-3">
//                                             <SelectLabel>Free</SelectLabel>
//                                             {model.subModel.map((subModel, index) => subModel.premium === false && (
//                                                 <SelectItem key={index} value={subModel.id}>{subModel.name}</SelectItem>
//                                             ))}
//                                         </SelectGroup>
//                                         <SelectGroup className="px-3">
//                                             <SelectLabel>Premium</SelectLabel>
//                                             {model.subModel.map((subModel, index) => subModel.premium === true && (
//                                                 <SelectItem key={index} value={subModel.name} disabled={subModel.premium}>{subModel.name} {subModel.premium && <Lock className='h-4 w-4' />}</SelectItem>
//                                             ))}
//                                         </SelectGroup>

//                                     </SelectContent>
//                                 </Select>}
//                         </div>
//                         <div>
//                             {model.enable ? <Switch checked={model.enable}
//                                 onCheckedChange={(v) => onToggleChange(model.model, v)}
//                             />
//                                 : <MessageSquare onClick={() => onToggleChange(model.model, true)} />}
//                         </div>
//                     </div>
//                     {model.premium && model.enable && <div className='flex items-center justify-center h-full'>
//                         <Button><LockIcon />Upgrade to unlock</Button>
//                     </div>}
//                     <div className='flex-1 p-4'>
//                         <div className='flex-1 p-4 space-y-2'>
//                             {messages[model.model]?.map((m, i) => (
//                                 <div key={i}
//                                     className={`p-2 rounded-md ${m.role == 'user' ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-900"

//                                         }`}>
//                                     {m.role == 'assistant' && (
//                                         <span className='text-sm text-gray-600'>{m.model ?? model.model}</span>
//                                     )}
//                                     <div className='flex gap-3 items-center'>
//                                         {m.content == 'loading' && <><Loader className='animate-spin' /><span>Thinking...</span></>}
//                                         {m.content !== 'loading' && <h2>{m.content}</h2>}
//                                     </div>



//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//             ))}


//         </div>
//     )
// }

// export default AiMultiModels


// import AiModelList from '@/shared/AiModelList'
// import Image from 'next/image'
// import React, { useContext, useEffect, useState } from 'react'
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Loader, Lock, LockIcon, MessageSquare } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
// import { useUser } from '@clerk/nextjs'
// import { doc, updateDoc } from 'firebase/firestore'
// import { db } from '@/config/FirebaseConfig'

// function AiMultiModels() {
//     const [aiModelList, setAiModelList] = useState(AiModelList)
//     const { messages, setMessages, aiSelectedModels, setAiSelectedModels } = useContext(AiSelectedModelContext)
//     const { user } = useUser()

//     // ✅ Enable models that are in aiSelectedModels by default
//     useEffect(() => {
//         if (aiSelectedModels && Object.keys(aiSelectedModels).length > 0) {
//             setAiModelList((prev) =>
//                 prev.map((m) => ({
//                     ...m,
//                     enable: Object.keys(aiSelectedModels).includes(m.model) ? true : m.enable
//                 }))
//             );
//             console.log("🔄 Models enabled based on aiSelectedModels:", Object.keys(aiSelectedModels));
//         }
//     }, [aiSelectedModels]);

//     const onToggleChange = async (model, value) => {
//         setAiModelList((prev) =>
//             prev.map((m) =>
//                 m.model === model ? { ...m, enable: value } : m
//             ),
//             setAiSelectedModels((prev) =>
//                 prev.map((m) => m.model === model ? { ...m, enable: value } : m))
//         );

//         // If disabling, remove from aiSelectedModels
//         if (!value) {
//             setAiSelectedModels(prev => {
//                 const updated = { ...prev };
//                 delete updated[model];
//                 return updated;
//             });

//             // Update Firebase
//             if (user) {
//                 const docRef = doc(db, "user", user?.primaryEmailAddress.emailAddress);
//                 await updateDoc(docRef, {
//                     selectedModelPref: { ...aiSelectedModels }
//                 }).catch(err => console.error("Firebase update error:", err));
//             }
//         } else {
//             // If enabling, add the default model to aiSelectedModels
//             const modelData = AiModelList.find(m => m.model === model);
//             const defaultSubModel = modelData?.subModel.find(sm => !sm.premium);

//             if (defaultSubModel) {
//                 setAiSelectedModels(prev => ({
//                     ...prev,
//                     [model]: { modelId: defaultSubModel.id }
//                 }));
//             }
//         }
//     }

//     const onSelectedValue = async (parentModel, value) => {
//         const updatedModels = {
//             ...aiSelectedModels,
//             [parentModel]: {
//                 modelId: value
//             }
//         };

//         setAiSelectedModels(updatedModels);

//         // Update Firebase
//         if (user) {
//             const docRef = doc(db, "user", user?.primaryEmailAddress.emailAddress);
//             await updateDoc(docRef, {
//                 selectedModelPref: updatedModels
//             }).catch(err => console.error("Firebase update error:", err));
//         }
//     }

//     return (
//         <div className='flex flex-1 h-[75vh] border-b bg-radial from-purple-500 to-indigo-950 rounded-lg overflow-x-auto'>
//             {aiModelList.map((model, index) => (
//                 <div key={index} className={`flex flex-col border-r h-full overflow-auto
//                 ${model.enable ? 'flex-1 min-w-[400px]' : "w-[100px] flex-none"}
//                 `}>
//                     <div className='flex w-full h-[70px] items-center justify-between border-b p-4 bg-radial from-purple-500 to-indigo-950 rounded-b-lg'>
//                         <div className='flex items-center gap-4'>
//                             <Image src={model.icon} alt='Logo' width={26} height={26} />
//                             {model.enable &&
//                                 <Select
//                                     disabled={model.premium}
//                                     onValueChange={(value) => onSelectedValue(model.model, value)}
//                                     defaultValue={aiSelectedModels?.[model.model]?.modelId ?? ""} >
//                                     <SelectTrigger className="w-[180px] text-black dark:text-white">
//                                         <SelectValue placeholder={aiSelectedModels?.[model.model]?.modelId ?? "Select a model"} />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectGroup className="px-3">
//                                             <SelectLabel>Free</SelectLabel>
//                                             {model.subModel.map((subModel, index) => subModel.premium === false && (
//                                                 <SelectItem key={index} value={subModel.id}>{subModel.name}</SelectItem>
//                                             ))}
//                                         </SelectGroup>
//                                         <SelectGroup className="px-3">
//                                             <SelectLabel>Premium</SelectLabel>
//                                             {model.subModel.map((subModel, index) => subModel.premium === true && (
//                                                 <SelectItem key={index} value={subModel.name} disabled={subModel.premium}>
//                                                     {subModel.name} {subModel.premium && <Lock className='h-4 w-4' />}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectGroup>
//                                     </SelectContent>
//                                 </Select>}
//                         </div>
//                         <div>
//                             {model.enable ?
//                                 <Switch
//                                     checked={model.enable}
//                                     onCheckedChange={(v) => onToggleChange(model.model, v)}
//                                 />
//                                 :
//                                 <MessageSquare
//                                     onClick={() => onToggleChange(model.model, true)}
//                                     className="cursor-pointer hover:text-blue-500"
//                                 />
//                             }
//                         </div>
//                     </div>

//                     {model.premium && model.enable && (
//                         <div className='flex items-center justify-center h-full'>
//                             <Button>
//                                 <LockIcon />
//                                 Upgrade to unlock
//                             </Button>
//                         </div>
//                     )}

//                     {model.enable && <div className='flex-1 p-4 overflow-y-auto'>
//                         <div className='space-y-2'>
//                             {messages[model.model]?.map((m, i) => (
//                                 <div key={i}
//                                     className={`p-3 rounded-md ${m.role === 'user'
//                                         ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
//                                         : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//                                         }`}>
//                                     {m.role === 'assistant' && (
//                                         <span className='text-xs text-gray-600 dark:text-gray-400 font-semibold block mb-1'>
//                                             {m.model ?? model.model}
//                                         </span>
//                                     )}
//                                     <div className='flex gap-3 items-center'>
//                                         {m.content === 'loading' ? (
//                                             <>
//                                                 <Loader className='animate-spin h-4 w-4' />
//                                                 <span className="text-sm">Thinking...</span>
//                                             </>
//                                         ) : (
//                                             <p className="whitespace-pre-wrap">{m.content}</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>}

//                 </div>
//             ))}
//         </div>
//     )
// }

// export default AiMultiModels




import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader, Lock, LockIcon, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import { useUser } from '@clerk/nextjs'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import { useSearchParams } from 'next/navigation'
import AiModelList from '@/shared/AiModelList'

function AiMultiModels() {
    const [aiModelList, setAiModelList] = useState(AiModelList)
    const { messages, setMessages, aiSelectedModels, setAiSelectedModels } = useContext(AiSelectedModelContext)
    const { user } = useUser()



    // ✅ Enable models that are in aiSelectedModels by default
    useEffect(() => {
        if (aiSelectedModels && Object.keys(aiSelectedModels).length > 0) {
            setAiModelList((prev) =>
                prev.map((m) => ({
                    ...m,
                    enable: Object.keys(aiSelectedModels).includes(m.model) ? true : m.enable
                }))
            );
            console.log("🔄 Models enabled based on aiSelectedModels:", Object.keys(aiSelectedModels));
        }
    }, [aiSelectedModels]);

    const onToggleChange = async (model, value) => {
        // Update aiModelList (array, so map is fine)
        setAiModelList((prev) =>
            prev.map((m) =>
                m.model === model ? { ...m, enable: value } : m
            )
        );

        if (!value) {
            // Disabling: Compute updated, delete key, then set state and update Firebase
            const updatedModels = { ...aiSelectedModels };
            delete updatedModels[model];
            setAiSelectedModels(updatedModels);

            // Update Firebase
            if (user) {
                const docRef = doc(db, "user", user?.primaryEmailAddress.emailAddress);
                await updateDoc(docRef, {
                    selectedModelPref: updatedModels
                }).catch(err => console.error("Firebase update error:", err));
            }
        } else {
            // Enabling: Add with default submodel and enable: true
            const modelData = AiModelList.find(m => m.model === model);
            const defaultSubModel = modelData?.subModel.find(sm => !sm.premium);

            if (defaultSubModel) {
                const updatedModels = {
                    ...aiSelectedModels,
                    [model]: { modelId: defaultSubModel.id, enable: true }
                };
                setAiSelectedModels(updatedModels);

                // Update Firebase
                if (user) {
                    const docRef = doc(db, "user", user?.primaryEmailAddress.emailAddress);
                    await updateDoc(docRef, {
                        selectedModelPref: updatedModels
                    }).catch(err => console.error("Firebase update error:", err));
                }
            }
        }
    }

    const onSelectedValue = async (parentModel, value) => {
        // Compute updated, preserve existing fields (e.g., enable)
        const updatedModels = {
            ...aiSelectedModels,
            [parentModel]: {
                ...aiSelectedModels[parentModel],
                modelId: value
            }
        };

        setAiSelectedModels(updatedModels);

        // Update Firebase
        if (user) {
            const docRef = doc(db, "user", user?.primaryEmailAddress.emailAddress);
            await updateDoc(docRef, {
                selectedModelPref: updatedModels
            }).catch(err => console.error("Firebase update error:", err));
        }
    }

    return (
        <div className='flex flex-1 h-[75vh] border-b bg-radial from-purple-500 to-indigo-950 rounded-lg overflow-x-auto'>
            {aiModelList.map((model, index) => (
                <div key={index} className={`flex flex-col border-r h-full overflow-auto
                ${model.enable ? 'flex-1 min-w-[400px]' : "w-[100px] flex-none"}
                `}>
                    <div className='flex w-full h-[70px] items-center justify-between border-b p-4 bg-radial from-purple-500 to-indigo-950 rounded-b-lg'>
                        <div className='flex items-center gap-4'>
                            <Image src={model.icon} alt='Logo' width={26} height={26} />
                            {model.enable &&
                                <Select
                                    disabled={model.premium}
                                    onValueChange={(value) => onSelectedValue(model.model, value)}
                                    defaultValue={aiSelectedModels?.[model.model]?.modelId ?? ""} >
                                    <SelectTrigger className="w-[180px] text-black dark:text-white">
                                        <SelectValue placeholder={aiSelectedModels?.[model.model]?.modelId ?? "Select a model"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup className="px-3">
                                            <SelectLabel>Free</SelectLabel>
                                            {model.subModel.map((subModel, index) => subModel.premium === false && (
                                                <SelectItem key={index} value={subModel.id}>{subModel.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                        <SelectGroup className="px-3">
                                            <SelectLabel>Premium</SelectLabel>
                                            {model.subModel.map((subModel, index) => subModel.premium === true && (
                                                <SelectItem key={index} value={subModel.name} disabled={subModel.premium}>
                                                    {subModel.name} {subModel.premium && <Lock className='h-4 w-4' />}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>}
                        </div>
                        <div>
                            {model.enable ?
                                <Switch
                                    checked={model.enable}
                                    onCheckedChange={(v) => onToggleChange(model.model, v)}
                                />
                                :
                                <MessageSquare
                                    onClick={() => onToggleChange(model.model, true)}
                                    className="cursor-pointer hover:text-blue-500"
                                />
                            }
                        </div>
                    </div>

                    {model.premium && model.enable && (
                        <div className='flex items-center justify-center h-full'>
                            <Button>
                                <LockIcon />
                                Upgrade to unlock
                            </Button>
                        </div>
                    )}

                    {model.enable && <div className='flex-1 p-4 overflow-y-auto'>
                        <div className='space-y-2'>
                            {messages[model.model]?.map((m, i) => (
                                <div key={i}
                                    className={`p-3 rounded-md ${m.role === 'user'
                                        ? "bg-blue-100 dark:bg-radial from-blue-900 to-indigo-900 text-blue-900 dark:text-blue-100"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        }`}>
                                    {m.role === 'assistant' && (
                                        <span className='text-xs text-gray-600 dark:text-gray-400 font-semibold block mb-1'>
                                            {m.model ?? model.model}
                                        </span>
                                    )}
                                    <div className='flex gap-3 items-center'>
                                        {m?.content === 'loading' ? (
                                            <>
                                                <Loader className='animate-spin h-4 w-4' />
                                                <span className="text-sm">Thinking...</span>
                                            </>
                                        ) : (
                                            <ReactMarkdown className='whitespace-pre-wrap' remarkPlugins={[remarkGfm]}>
                                                {m?.content}
                                            </ReactMarkdown>

                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>}

                </div>
            ))}
        </div>
    )
}

export default AiMultiModels