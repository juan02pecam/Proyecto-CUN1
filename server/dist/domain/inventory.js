export function validateUnit(input) { const e = []; if (!input.code?.trim())
    e.push('code'); if (!['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].includes(input.bloodGroup))
    e.push('bloodGroup'); if (!['Glóbulos rojos', 'Plaquetas', 'Plasma'].includes(input.component))
    e.push('component'); if (!input.expiresAt)
    e.push('expiresAt'); return e; }
export function calculateInventorySummary(units) { const today = Date.now(); const available = units.filter(u => u.status === 'available' && Date.parse(u.expiresAt) >= today); const byGroup = available.reduce((a, u) => (a[u.bloodGroup] = (a[u.bloodGroup] || 0) + 1, a), {}); return { total: available.length, byGroup, expiringSoon: available.filter(u => Date.parse(u.expiresAt) - today < 7 * 86400000).length }; }
