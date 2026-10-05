export type BloodGroup = 'O+'|'O-'|'A+'|'A-'|'B+'|'B-'|'AB+'|'AB-';
export type BloodComponent = 'Glóbulos rojos'|'Plaquetas'|'Plasma';
export type BloodUnitStatus = 'available'|'reserved'|'used'|'expired';
export type RequestPriority = 'critical'|'urgent'|'routine';
export interface BloodUnit { id:string; code:string; bloodGroup:BloodGroup; component:BloodComponent; volume:number; status:BloodUnitStatus; location:string; expiresAt:string; }
export interface Donor { id:string; name:string; documentMasked:string; bloodGroup:BloodGroup; phone:string; lastDonation?:string; }
export interface TransfusionRequest { id:string; institution:string; component:BloodComponent; bloodGroup:BloodGroup; quantity:number; priority:RequestPriority; status:'pending'|'fulfilled'|'cancelled'; createdAt:string; }
export type DomainEvent = { id:string; type:string; aggregateId:string; occurredAt:string; payload:Record<string,unknown> };
export function createDomainEvent(type:string, aggregateId:string, payload:Record<string,unknown>):DomainEvent { return {id:crypto.randomUUID(), type, aggregateId, occurredAt:new Date().toISOString(), payload}; }
