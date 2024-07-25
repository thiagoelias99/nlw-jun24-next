'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { createTripDtoSchema } from '@/model/trip'
import { useEffect, useState } from 'react'
import CustomizedInput from './customized-input'
import { ArrowRightIcon, CalendarIcon, MapPinIcon } from 'lucide-react'
import { Card } from '../ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { cn } from '@/lib/utils'
import { addDays, format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import { z } from '@/lib/pt-zod'

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
				<Card className='pl-6 pr-4 py-5 flex flex-col w-full gap-2'>
					<FormField
						control={form.control}
						name="destination"
						render={({ field }) => (
							<FormItem className=''>
								<FormControl>
									<CustomizedInput
										Icon={MapPinIcon}
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
												className={cn(
													"w-full flex flex-row justify-start items-center px-0 gap-4 text-muted bg-transparent hover:bg-transparent text-lg",)}
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
											// disabled={(date) =>
											// 	date > new Date() || date < new Date("1900-01-01")
											// }
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type='button'>
						<span>Continuar</span>
						<ArrowRightIcon size={18} />
					</Button>
				</Card>
				<Button type='submit' className='w-full mt-4'>Criar</Button>
			</form>
		</Form>
	)
}