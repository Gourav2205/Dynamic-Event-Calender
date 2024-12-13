'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import EventModal from './EventModal'
import EventList from './EventList'
import { Event } from '../types/event'

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [events, setEvents] = useState<Event[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEventListOpen, setIsEventListOpen] = useState(false)

    useEffect(() => {
        const storedEvents = localStorage.getItem('events')
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('events', JSON.stringify(events))
    }, [events])

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const days = new Date(year, month + 1, 0).getDate()
        return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1))
    }

    const addDays = (date: Date, days: number) => {
        const result = new Date(date)
        result.setDate(result.getDate() + days)
        return result
    }

    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
    const daysInMonth = getDaysInMonth(currentDate)

    const handlePrevMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1))
    }

    const handleDateClick = (date: Date) => {
        setSelectedDate(date)
        setIsModalOpen(true)
    }

    const handleAddEvent = (newEvent: Event) => {
        setEvents(prevEvents => [...prevEvents, newEvent])
        setIsModalOpen(false)
    }

    const handleEditEvent = (editedEvent: Event) => {
        setEvents(prevEvents => prevEvents.map(event =>
            event.id === editedEvent.id ? editedEvent : event
        ))
        setIsModalOpen(false)
    }

    const handleDeleteEvent = (eventId: string) => {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId))
    }

    const getDayEvents = (date: Date) => {
        return events.filter(event =>
            new Date(event.startTime).toDateString() === date.toDateString()
        )
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div>
                    <Button onClick={handlePrevMonth} variant="outline" size="icon" className="mr-2">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleNextMonth} variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold p-2">{day}</div>
                ))}
                {Array.from({ length: startDay }).map((_, index) => (
                    <div key={`empty-${index}`} className="p-2"></div>
                ))}
                {daysInMonth.map((date, index) => {
                    const dayEvents = getDayEvents(date)
                    const isToday = date.toDateString() === new Date().toDateString()
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6

                    return (
                        <div
                            key={index}
                            onClick={() => handleDateClick(date)}
                            className={`p-2 border cursor-pointer transition-colors duration-200 ${isToday ? 'bg-blue-100' : ''
                                } ${isSelected ? 'bg-blue-200' : ''} ${isWeekend ? 'bg-gray-100' : ''
                                } hover:bg-blue-50`}
                        >
                            <div className="font-semibold">{date.getDate()}</div>
                            {dayEvents.length > 0 && (
                                <div className="text-xs text-blue-600">{dayEvents.length} event(s)</div>
                            )}
                        </div>
                    )
                })}
            </div>
            {isModalOpen && selectedDate && (
                <EventModal
                    date={selectedDate}
                    onClose={() => setIsModalOpen(false)}
                    onAddEvent={handleAddEvent}
                    onEditEvent={handleEditEvent}
                    onDeleteEvent={handleDeleteEvent}
                    events={getDayEvents(selectedDate)}
                />
            )}
            <Button onClick={() => setIsEventListOpen(true)} className="mt-4">
                View All Events
            </Button>
            {isEventListOpen && (
                <EventList
                    events={events}
                    onClose={() => setIsEventListOpen(false)}
                    onEditEvent={handleEditEvent}
                    onDeleteEvent={handleDeleteEvent}
                />
            )}
        </div>
    )
}

export default Calendar

