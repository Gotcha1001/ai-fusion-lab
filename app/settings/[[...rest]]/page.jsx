"use client"
import React, { useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useAuth, UserProfile } from '@clerk/nextjs';
import { Lock, Zap } from 'lucide-react';
import Image from 'next/image';
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import AiModelList from '@/shared/AiModelList';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';
import { toast } from 'sonner';
import PricingModal from '../../_components/PricingModal';


export default function SettingsPage() {
    const { user } = useUser();
    const { has } = useAuth();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { aiSelectedModels, setAiSelectedModels } = useContext(AiSelectedModelContext);
    const [aiModelList, setAiModelList] = useState(AiModelList);
    const [profileData, setProfileData] = useState({
        email: '',
        fullName: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                email: user.primaryEmailAddress?.emailAddress || '',
                fullName: user.fullName || ''
            });
        }
    }, [user]);

    // Enable models that are in aiSelectedModels by default
    useEffect(() => {
        if (aiSelectedModels && Object.keys(aiSelectedModels).length > 0) {
            setAiModelList((prev) =>
                prev.map((m) => ({
                    ...m,
                    enable: Object.keys(aiSelectedModels).includes(m.model) ? true : m.enable
                }))
            );
        }
    }, [aiSelectedModels]);

    const handleProfileUpdate = async () => {
        if (!user) return;

        // Note: Clerk handles profile updates through its own API
        // This is just a UI placeholder - you'd need to implement Clerk's user update
        toast.success('Profile information is managed by your account provider');
    };

    const onToggleChange = async (model, value) => {
        // Update aiModelList
        setAiModelList((prev) =>
            prev.map((m) =>
                m.model === model ? { ...m, enable: value } : m
            )
        );

        if (!value) {
            // Disabling: Remove from selected models
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
            // Enabling: Add with default submodel
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
    };

    const remainingMessages = userDetail?.remainingMsg || 0;
    const totalMessages = 5;
    const usedMessages = totalMessages - remainingMessages;
    const progressValue = 100 - ((usedMessages / totalMessages) * 100);

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Manage your profile information and AI model preferences.
                </p>
            </div>

            {/* Profile Information Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border p-6 mb-6">
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-1">Profile information</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage your basic profile details.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            disabled
                            className="bg-gray-50 dark:bg-gray-800"
                        />
                    </div>

                    <div>
                        <Label htmlFor="fullName" className="text-sm font-medium mb-2 block">
                            Full name
                        </Label>
                        <Input
                            id="fullName"
                            type="text"
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                            className="bg-gray-50 dark:bg-gray-800"
                        />
                    </div>

                    <Button
                        onClick={handleProfileUpdate}
                        className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                    >
                        Update profile
                    </Button>
                </div>
            </div>

            {/* AI Model Preferences Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border p-6 mb-6">
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-1">Customize your chat AI model preferences</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Easily update your selections anytime in the settings
                    </p>
                </div>

                <div className="space-y-3">
                    {aiModelList.map((model, index) => {
                        const isModelEnabled = aiSelectedModels?.[model.model]?.enable;
                        const isPremium = model.premium || model.subModel.some(sm => sm.premium);
                        const isLocked = isPremium && !has?.({ plan: 'unlimited_plan' });

                        return (
                            <div
                                key={index}
                                className={`flex items-center justify-between p-4 rounded-lg border ${isLocked ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={model.icon}
                                        alt={model.model}
                                        width={32}
                                        height={32}
                                        className="rounded"
                                    />
                                    <span className="font-medium">{model.model}</span>
                                    {isLocked && (
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    )}
                                </div>

                                <Switch
                                    checked={isModelEnabled || false}
                                    onCheckedChange={(value) => onToggleChange(model.model, value)}
                                    disabled={isLocked}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                        <strong>Upgrade and Unlock Premium AI Models</strong>
                        <br />
                        <span className="text-xs mt-1 inline-block">
                            Tips: Try not to use every AI model for similar queries - this helps conserve tokens and ensures more meaningful results.
                        </span>
                    </p>
                </div>
            </div>

            {/* Subscription Information Section */}
            {!has?.({ plan: 'unlimited_plan' }) && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
                    <h2 className="text-xl font-bold mb-4">Subscription information</h2>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                        <h3 className="text-lg font-bold mb-2">Free Plan</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {usedMessages}/{totalMessages} message Used
                        </p>
                        <Progress value={progressValue} className="mb-4 h-2" />

                        <PricingModal>
                            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                                <Zap className="mr-2 h-4 w-4" />
                                Upgrade for unlimited messages
                            </Button>
                        </PricingModal>
                    </div>
                </div>
            )}
            <UserProfile />
        </div>
    );
}