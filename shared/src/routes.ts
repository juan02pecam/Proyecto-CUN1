export type Action='Resumen'|'Inventario'|'Registrar unidad'|'Solicitudes'|'Donantes';
export function routeFor(action:Action){const routes:Record<Action,string>={Resumen:'/',Inventario:'/inventory','Registrar unidad':'/inventory/new',Solicitudes:'/requests',Donantes:'/donors'};return routes[action];}
