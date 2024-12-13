import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Event } from '../types/event'

interface EventListProps {
    events: Event[]
    onClose: () => void
    onEditEvent: (event: Event) => void
    onDeleteEvent: (eventId: string) => void
}

const EventList: React.FC<EventListProps> = ({
    events,
    onClose,
    onEditEvent,
    onDeleteEvent,
}) => {
    const [filter, setFilter] = useState('')

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(filter.toLowerCase()) ||
        event.description.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>All Events</DialogTitle>
                </DialogHeader>
                <div className="mb-4">
                    <Input
                        placeholder="Filter events..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredEvents.map((event) => (
                        <div key={event.id} className="p-4 bg-gray-100 rounded">
                            <h3 className="font-semibold">{event.name}</h3>
                            <p className="text-sm">
                                {new Date(event.startTime).toLocaleString()} -{' '}
                                {new Date(event.endTime).toLocaleString()}
                            </p>
                            <p className="text-sm mt-2">{event.description}</p>
                            <div className="mt-2 space-x-2">
                                <Button
                                    size="sm"
                                    onClick={() => onEditEvent(event)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => onDeleteEvent(event.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EventList

