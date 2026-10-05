export function createDomainEvent(type, aggregateId, payload) { return { id: crypto.randomUUID(), type, aggregateId, occurredAt: new Date().toISOString(), payload }; }
