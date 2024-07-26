'use client'

import React, { ComponentProps } from 'react'
import { Input } from '../ui/input'
import { LucideIcon, MapPinIcon } from 'lucide-react'
import { ClassNameValue } from 'tailwind-merge'

interface Props extends ComponentProps<'input'> {
  Icon: LucideIcon
  containerClassName?: ClassNameValue
}

export default function CustomizedInput({ Icon, containerClassName, ...rest }: Props) {
  return (
    <div className='flex w-full flex-row justify-start items-start'>
      <Icon className='text-muted mt-2' />
      <Input
        {...rest}
        className='bg-transparent text-lg text-muted placeholder:text-muted border-0 outline-none' />
    </div>
  )
}
