"use client"
import AiModelList from '@/shared/AiModelList';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Lock, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectGroup, SelectLabel } from '@radix-ui/react-select';
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';
import { useUser } from '@clerk/nextjs';

const AiMultiModel = () => {
    const {user} = useUser();
    const [aiModelList, setAiModelList] = useState(AiModelList);
    const {aiSelectedModel, setAiSelectedModel} = useContext(AiSelectedModelContext);
    const onToggleChange = (model, value) => {
        setAiModelList((prev) => prev.map((m) => m.model === model.model ? { ...m, enable: value } : m));
    }
    const onSelectValueChange = async(parentModel, value) => {
        setAiSelectedModel((prev) => ({
            ...prev,
            [parentModel]: {
                modelId: value
            }
        }))
        // update to firebase store
        const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
        await updateDoc(userRef, {
            selectedModelPref: aiSelectedModel
        })
    }
    return (
        <div className='flex flex-1 h-[70vh] border-b'>
            {aiModelList.map((model, index) => (
                <div key={index} className={`flex flex-col border-r h-full  px-4 ${model.enable ? 'flex-1 min-w-[400px]' : 'w-[100px] flex-none'}`}>
                    <div className='flex w-full items-center justify-between h-[50px] border-b'>
                        <div className='flex gap-4 items-center'>
                            <Image src={model.icon} alt={model.model} width={24} height={24} />
                            {model.enable && <Select disabled={model.premium} defaultValue={aiSelectedModel[model.model].modelId} onValueChange={(value) => onSelectValueChange(model.model, value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={aiSelectedModel[model.model].modelId} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel className='text-center text-sm'>Free</SelectLabel>
                                        {model.subModel.map((submodel, idx) => submodel.premium == false && (
                                            <SelectItem key={idx} value={submodel.id}>{submodel.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel className='flex gap-1 justify-center text-center text-sm'><Star color='white' fill='purple'/>Premium</SelectLabel>
                                        {model.subModel.map((submodel, idx) => submodel.premium == true && (
                                            <SelectItem key={idx} value={submodel.id} disabled={true}>{submodel.name} {submodel.premium && <Lock className='h-4 w-4'/>}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>}
                        </div>
                        <div >
                            {model.enable ? <Switch className='mr-2' checked={model.enable} onCheckedChange={(v) => onToggleChange(model, v)} /> : <MessageSquare onClick={(v) => onToggleChange(model, true)} />}
                        </div>
                    </div>
                    <div className='flex items-center justify-center h-full'>
                        {model.premium && model.enable &&
                            <Button className='cursor-pointer'><Lock />Upgrade to Unlock</Button>}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AiMultiModel
