"use client"
import AiModelList from '@/shared/AiModelList';
import Image from 'next/image';
import React, { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Lock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AiMultiModel = () => {
    const [aiModelList, setAiModelList] = useState(AiModelList);
    const onToggleChange = (model, value) => {
        setAiModelList((prev) => prev.map((m) => m.model === model.model ? { ...m, enable: value } : m));
    }
    return (
        <div className='flex flex-1 h-[70vh] border-b'>
            {aiModelList.map((model, index) => (
                <div key={index} className={`flex flex-col border-r h-full  px-4 ${model.enable ? 'flex-1 min-w-[400px]' : 'w-[100px] flex-none'}`}>
                    <div className='flex w-full items-center justify-between h-[50px] border-b'>
                        <div className='flex gap-4 items-center'>
                            <Image src={model.icon} alt={model.model} width={24} height={24} />
                            {model.enable && <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={model.subModel[0].name} />
                                </SelectTrigger>
                                <SelectContent>
                                    {model.subModel.map((submodel, idx) => (
                                        <SelectItem key={idx} value={submodel.name}>{submodel.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>}
                        </div>
                        <div >
                            {model.enable ? <Switch className='mr-2' checked={model.enable} onCheckedChange={(v) => onToggleChange(model, v)} /> : <MessageSquare onClick={(v) => onToggleChange(model, true)} />}
                        </div>
                    </div>
                    <div className='flex items-center justify-center h-full'>
                        {model.premium && model.enable &&
                            <Button className='cursor-pointer'><Lock/>Upgrade to Unlock</Button>}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AiMultiModel
