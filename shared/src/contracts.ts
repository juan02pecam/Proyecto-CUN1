export type BloodGroup='O+'|'O-'|'A+'|'A-'|'B+'|'B-'|'AB+'|'AB-';
export type BloodComponent='Glóbulos rojos'|'Plaquetas'|'Plasma';
export interface BloodUnit{id:string;code:string;bloodGroup:BloodGroup;component:BloodComponent;volume:number;status:string;location:string;expiresAt:string;}
export interface Donor{id:string;name:string;documentMasked:string;bloodGroup:BloodGroup;phone:string;}
export interface TransfusionRequest{id:string;institution:string;component:BloodComponent;bloodGroup:BloodGroup;quantity:number;priority:string;status:string;createdAt:string;}
export interface DashboardSummary{inventory:{total:number;byGroup:Record<string,number>;expiringSoon:number};requests:{pending:number};donors:number;alerts:number;}
