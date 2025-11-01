import { Button } from '@/components/ui/button'
import { Mic, Paperclip, Send } from 'lucide-react'
import React from 'react'
import AiMultiModel from './AiMultiModel'

const ChatInputBox = () => {
    return (
        <div className='relative min-h-screen'>
            {/* Page Content */}
            <div>
                <AiMultiModel/>
            </div>
            {/* Fixed Chat Input */}
            <div className='w-full flex fixed bottom-0 right-0 justify-center px-4 pb-4'>
                <div className='w-full border rounded-xl shadow-md max-w-2xl p-4'>
                    <input type="text" placeholder='Ask me anything...' className='border-0 outline-none' />
                    <div className='mt-3 flex items-center justify-between'>
                        <Button variant={'ghost'} size={'icon'}>
                            <Paperclip className='h-5 w-5' />
                        </Button>
                        <div className='flex gap-5'>
                            <Button variant={'ghost'} size={'icon'}><Mic/></Button>
                            <Button size={'icon'}><Send/></Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ChatInputBox
