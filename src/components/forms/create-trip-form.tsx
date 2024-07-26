'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { createTripDtoSchema } from '@/model/trip'
import { useEffect, useState } from 'react'
import CustomizedInput from './customized-input'
import { ArrowRightIcon, AtSignIcon, CalendarIcon, MapPinIcon, PlusIcon, Settings2Icon, UserRoundPlusIcon, XIcon } from 'lucide-react'
import { Card } from '../ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { cn } from '@/lib/utils'
import { addDays, format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import { z } from '@/lib/pt-zod'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import Divider from '../divider'
import { Input } from '../ui/input'

export default function CreateTripForm() {
	const form = useForm<z.infer<typeof createTripDtoSchema>>({
		resolver: zodResolver(createTripDtoSchema),
		defaultValues: {
			destination: undefined,
			startAt: undefined,
			endsAt: undefined,
			ownerName: 'undefined',
			ownerEmail: 'undefined@email.com',
			guestToInvite: [],
		},
	})

	const [date, setDate] = useState<DateRange | undefined>(undefined)
	const [showPart2, setShowPart2] = useState(false)
	const [guestName, setGuestName] = useState('')
	const [guestEmail, setGuestEmail] = useState('')

	async function onSubmit(values: z.infer<typeof createTripDtoSchema>) {
		try {
			console.log(values)
			// form.reset()
		} catch (error) {
			throw error
		}
	}

	useEffect(() => {
		console.log(form.formState.errors)
	}, [form.formState.errors])

	useEffect(() => {
		if (date?.from && date?.to) {
			form.setValue('startAt', date.from)
			form.setValue('endsAt', date.to)
		}
	}, [date])

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className='w-full flex flex-col justify-center items-center gap-4'>
					<Card className='pl-6 pr-4 py-5 flex flex-col w-full gap-2'>
						<FormField
							control={form.control}
							name="destination"
							render={({ field }) => (
								<FormItem className=''>
									<FormControl>
										<CustomizedInput
											Icon={MapPinIcon}
											disabled={showPart2}
											placeholder='Para onde você vai?'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="endsAt"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													disabled={showPart2}
													className={cn(
														"w-full flex flex-row justify-start items-center px-0 gap-4 text-muted bg-transparent hover:bg-transparent text-lg disabled:opacity-100 disabled:cursor-not-allowed",)}
												>
													<CalendarIcon className="" />
													{date?.from ? (
														date.to ? (
															<>
																{format(date.from, "dd 'de' LLL y", { locale: ptBR })} a{" "}
																{format(date.to, "dd 'de' LLL y", { locale: ptBR })}
															</>
														) : (
															format(date.from, "dd 'de' LLL y")
														)
													) : (
														<span className='font-normal'>Quando?</span>
													)}
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												locale={ptBR}
												mode="range"
												selected={date}
												onSelect={setDate}
												fromDate={new Date()}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
						{!showPart2 ? (
							<Button
								type='button'
								className='w-full space-x-2'
								onClick={() => setShowPart2(true)}
							>
								<span>Continuar</span>
								<ArrowRightIcon size={18} />
							</Button>
						) : (
							<Button
								type='button'
								variant='secondary'
								onClick={() => setShowPart2(false)}
							>
								<span>Alterar local/data</span>
								<Settings2Icon size={18} />
							</Button>
						)}
					</Card>
					{showPart2 && (
						<Card className='w-full pl-6 pr-4 py-5'>
							<Dialog>
								<DialogTrigger asChild>
									<Button className='bg-transparent hover:bg-transparent text-muted text-lg flex flex-row justify-start items-center gap-4 font-normal px-1'>
										<UserRoundPlusIcon size={18} />
										{form.getValues('guestToInvite')?.length === 0 ? (
											<span>Quem estará na viagem?</span>) : (
											<span>{form.getValues('guestToInvite')?.length} pessoa(s) convidada(s)</span>
										)}
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Selecionar convidados</DialogTitle>
										<DialogDescription>
											Os convidados irão receber e-mails para confirmar a participação na viagem.
										</DialogDescription>
									</DialogHeader>

									<div className='w-full flex justify-start items-center flex-wrap gap-2'>
										{form.getValues('guestToInvite')?.map((guest, index) => (
											<div key={index} className='bg-popover text-popover-foreground flex px-2.5 py-1.5 justify-start items-center gap-2.5 rounded-md'>
												<p>{guest.email}</p>
												<XIcon
													className='h-4 w-4 text-zinc-400 cursor-pointer'
													onClick={() => form.setValue('guestToInvite', form.getValues('guestToInvite')?.filter(u => u.email !== guest.email))}
												/>
											</div>
										))}
									</div>

									<Divider />

									<div className='w-full flex flex-col justify-start items-center gap-5 pl-6 pr-4 py-4 bg-black rounded-xl shadow-shape'>
										<div className='w-full flex flex-1 justify-start items-center gap-2'>
											<UserRoundPlusIcon className='h-5 w-5 text-zinc-400' />
											<Input
												className='bg-transparent placeholder:text-zinc-400 outline-none border-0'
												type="text"
												value={guestName}
												onChange={(e) => setGuestName(e.target.value)}
												placeholder="Digite o nome do convidado" />
										</div>
										<div className='w-full flex flex-1 justify-start items-center gap-2'>
											<AtSignIcon className='h-5 w-5 text-zinc-400' />
											<Input
												className='bg-transparent placeholder:text-zinc-400 outline-none border-0'
												value={guestEmail}
												onChange={(e) => setGuestEmail(e.target.value)}
												type="text"
												placeholder="Digite o email do convidado" />
										</div>
										<Button
											type='button'
											className='w-full'
											onClick={() => {
												const currentGuests = form.getValues('guestToInvite') as []
												form.setValue('guestToInvite', [...currentGuests, { name: guestName || "", email: guestEmail }])
												setGuestName('')
												setGuestEmail('')
											}}
										>
											<p>Convidar</p>
											<PlusIcon className='h-5 w-5' />
										</Button>
									</div>
								</DialogContent>
							</Dialog>
							<Button type='submit' className='w-full mt-4 space-x-2'>
								<span>Confirmar Viagem</span>
								<ArrowRightIcon size={18} />
							</Button>
						</Card>
					)}

				</div>
			</form>
		</Form>
	)
}