export class EventBus {
    handlers = new Map();
    seen = new Set();
    history = [];
    subscribe(type, handler) { this.handlers.set(type, [...(this.handlers.get(type) || []), handler]); }
    publish(event) { if (this.seen.has(event.id))
        return; this.seen.add(event.id); this.history.push(event); for (const h of this.handlers.get(event.type) || [])
        h(event); }
    list() { return [...this.history].reverse(); }
}
