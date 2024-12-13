import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Event } from '../types/event'

interface EventModalProps {
    date: Date
    onClose: () => void
    onAddEvent: (event: Event) => void
    onEditEvent: (event: Event) => void
    onDeleteEvent: (eventId: string) => void
    events: Event[]
}

const EventModal: React.FC<EventModalProps> = ({
    date,
    onClose,
    onAddEvent,
    onEditEvent,
    onDeleteEvent,
    events,
}) => {
    const [name, setName] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [description, setDescription] = useState('')
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)

    useEffect(() => {
        if (editingEvent) {
            setName(editingEvent.name)
            setStartTime(editingEvent.startTime.slice(0, 16))
            setEndTime(editingEvent.endTime.slice(0, 16))
            setDescription(editingEvent.description)
        }
    }, [editingEvent])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name && startTime && endTime) {
            const eventData: Event = {
                id: editingEvent ? editingEvent.id : Date.now().toString(),
                name,
                startTime,
                endTime,
                description,
            }
            if (editingEvent) {
                onEditEvent(eventData)
            } else {
                onAddEvent(eventData)
            }
            resetForm()
        }
    }

    const resetForm = () => {
        setName('')
        setStartTime('')
        setEndTime('')
        setDescription('')
        setEditingEvent(null)
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Event Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                            id="startTime"
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                            id="endTime"
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between">
                        <Button type="submit">{editingEvent ? 'Update' : 'Add'} Event</Button>
                        {editingEvent && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                    onDeleteEvent(editingEvent.id)
                                    resetForm()
                                }}
                            >
                                Delete Event
                            </Button>
                        )}
                    </div>
                </form>
                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Events for {date.toDateString()}</h3>
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="p-2 bg-gray-100 mb-2 rounded cursor-pointer"
                            onClick={() => setEditingEvent(event)}
                        >
                            <div className="font-semibold">{event.name}</div>
                            <div className="text-sm">
                                {new Date(event.startTime).toLocaleTimeString()} -{' '}
                                {new Date(event.endTime).toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EventModal

