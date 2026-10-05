import { useEffect, useState } from "react";
import { getEvents, getRequests, getSummary } from "./lib/api";
export function App() {
  const [data, setData] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    Promise.all([getSummary(), getRequests(), getEvents()])
      .then(([s, r, e]) => {
        setData(s);
        setRequests(r);
        setEvents(e);
      })
      .catch(() => setData({ offline: true }));
  }, []);
  if (!data) return <div className="loading">Cargando HemoRed…</div>;
  return (
    <main>
      <aside>
        <div className="brand">
          <span className="brand-mark">✚</span>
          <div>
            <strong>HemoRed</strong>
            <small>Red vital</small>
          </div>
        </div>
        <nav>
          <a className="active">Resumen</a>
          <a>Inventario</a>
          <a>Solicitudes</a>
          <a>Donantes</a>
        </nav>
        <div className="side-note">
          <span>●</span> Sistema operativo
          <br />
          <small>Actualizado hace 2 min</small>
        </div>
      </aside>
      <section className="content">
        <header>
          <div>
            <p className="eyebrow">CENTRO DE OPERACIONES</p>
            <h1>Resumen general</h1>
            <p className="muted">
              Monitorea la disponibilidad y el flujo de sangre en tiempo real.
            </p>
          </div>
          <button className="primary">+ Registrar unidad</button>
        </header>
        {data.offline ? (
          <div className="error">
            No se pudo conectar con la API. Inicia el servidor para ver los
            datos.
          </div>
        ) : (
          <>
            <div className="mode">
              ● Modo demo · Datos sintéticos para demostración
            </div>
            <div className="stats">
              <article>
                <span className="icon blue">◉</span>
                <div>
                  <small>Unidades disponibles</small>
                  <strong>{data.inventory.total}</strong>
                  <em>En inventario activo</em>
                </div>
              </article>
              <article>
                <span className="icon red">!</span>
                <div>
                  <small>Alertas activas</small>
                  <strong className="danger">{data.alerts}</strong>
                  <em>Requieren atención</em>
                </div>
              </article>
              <article>
                <span className="icon orange">↗</span>
                <div>
                  <small>Solicitudes pendientes</small>
                  <strong>{data.requests.pending}</strong>
                  <em>De instituciones</em>
                </div>
              </article>
              <article>
                <span className="icon purple">♙</span>
                <div>
                  <small>Donantes registrados</small>
                  <strong>{data.donors}</strong>
                  <em>Red de donantes</em>
                </div>
              </article>
            </div>
            <div className="grid">
              <article className="panel inventory">
                <div className="panel-title">
                  <div>
                    <h2>Inventario por grupo</h2>
                    <p>Unidades disponibles ahora</p>
                  </div>
                  <button className="link">Ver inventario →</button>
                </div>
                {Object.entries(data.inventory.byGroup).map(([g, n]: any) => (
                  <div className="bar-row" key={g}>
                    <b>{g}</b>
                    <div className="bar">
                      <i
                        style={{ width: `${Math.min(100, (n / 5) * 100)}%` }}
                      />
                    </div>
                    <span>{n}</span>
                  </div>
                ))}
              </article>
              <article className="panel">
                <div className="panel-title">
                  <div>
                    <h2>Solicitudes recientes</h2>
                    <p>Seguimiento de requerimientos</p>
                  </div>
                  <button className="link">Ver todas →</button>
                </div>
                {requests.map((r) => (
                  <div className="request" key={r.id}>
                    <span className={`priority ${r.priority}`}></span>
                    <div>
                      <b>{r.institution}</b>
                      <small>
                        {r.quantity} × {r.component} · {r.bloodGroup}
                      </small>
                    </div>
                    <span className={`tag ${r.priority}`}>
                      {r.priority === "critical"
                        ? "Crítica"
                        : r.priority === "urgent"
                          ? "Urgente"
                          : "Rutina"}
                    </span>
                  </div>
                ))}
              </article>
            </div>
            <article className="panel activity">
              <div className="panel-title">
                <div>
                  <h2>Actividad del sistema</h2>
                  <p>Últimos eventos registrados</p>
                </div>
                <span className="live">● En vivo</span>
              </div>
              {events.length ? (
                events.slice(0, 4).map((e) => (
                  <div className="event" key={e.id}>
                    <span>✓</span>
                    <div>
                      <b>{e.type}</b>
                      <small>
                        {new Date(e.occurredAt).toLocaleString("es-CO")}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="muted">Aún no hay eventos.</p>
              )}
            </article>
          </>
        )}
      </section>
    </main>
  );
}
