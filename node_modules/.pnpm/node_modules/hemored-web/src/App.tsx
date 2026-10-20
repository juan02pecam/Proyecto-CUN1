import { useEffect, useState } from "react";
import { getEvents, getRequests, getSummary } from "./lib/api";
import { Action, routeFor } from "./lib/routes";

type Page = "dashboard" | "inventory" | "new-unit" | "requests" | "donors";
const nav: [Action, string][] = [
  ["Resumen", "◈"],
  ["Inventario", "▦"],
  ["Solicitudes", "⌁"],
  ["Donantes", "♙"],
];
function pageFromPath(path: string): Page {
  if (path === "/inventario") return "inventory";
  if (path === "/inventario/nueva") return "new-unit";
  if (path === "/solicitudes") return "requests";
  if (path === "/donantes") return "donors";
  return "dashboard";
}

export function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [data, setData] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const navigate = (action: Action) => {
    const next = routeFor(action);
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    Promise.all([
      getSummary(),
      getRequests(),
      getEvents(),
      fetch("http://localhost:4000/api/blood-units").then((r) => r.json()),
      fetch("http://localhost:4000/api/donors").then((r) => r.json()),
    ])
      .then(([s, r, e, u, d]) => {
        setData(s);
        setRequests(r);
        setEvents(e);
        setUnits(u);
        setDonors(d);
      })
      .catch(() => setData({ offline: true }));
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  if (!data) return <div className="loading">Cargando HemoRed…</div>;
  const page = pageFromPath(path);
  const active =
    page === "dashboard"
      ? "Resumen"
      : page === "new-unit"
        ? "Inventario"
        : page[0].toUpperCase() + page.slice(1);
  return (
    <main>
      <aside>
        <button
          className="brand brand-button"
          onClick={() => navigate("Resumen")}
        >
          <span className="brand-mark">✚</span>
          <span>
            <strong>HemoRed</strong>
            <small>Red vital</small>
          </span>
        </button>
        <nav>
          {nav.map(([label, icon]) => (
            <button
              key={label}
              className={active === label ? "active" : ""}
              onClick={() => navigate(label)}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
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
            <p className="eyebrow">
              CENTRO DE OPERACIONES / {active.toUpperCase()}
            </p>
            <h1>
              {page === "dashboard"
                ? "Resumen general"
                : page === "inventory"
                  ? "Inventario sanguíneo"
                  : page === "new-unit"
                    ? "Registrar unidad"
                    : "Gestión de " + active.toLowerCase()}
            </h1>
            <p className="muted">
              {page === "dashboard"
                ? "Una vista clara para tomar decisiones vitales a tiempo."
                : "Consulta, organiza y actualiza la operación desde un solo lugar."}
            </p>
          </div>
          {page === "dashboard" || page === "inventory" ? (
            <button
              className="primary"
              onClick={() => navigate("Registrar unidad")}
            >
              + Registrar unidad
            </button>
          ) : (
            <button className="secondary" onClick={() => navigate("Resumen")}>
              ← Volver al resumen
            </button>
          )}
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
            {page === "dashboard" && (
              <Dashboard
                data={data}
                requests={requests}
                events={events}
                navigate={navigate}
              />
            )}
            {page === "inventory" && (
              <Inventory units={units} navigate={navigate} />
            )}
            {page === "new-unit" && <NewUnit navigate={navigate} />}
            {page === "requests" && (
              <Requests requests={requests} navigate={navigate} />
            )}
            {page === "donors" && (
              <Donors donors={donors} navigate={navigate} />
            )}
          </>
        )}
      </section>
    </main>
  );
}

function Dashboard({ data, requests, events, navigate }: any) {
  return (
    <>
      <div className="stats">
        <Metric
          icon="◉"
          tone="blue"
          label="Unidades disponibles"
          value={data.inventory.total}
          note="En inventario activo"
        />
        <Metric
          icon="!"
          tone="red"
          label="Alertas activas"
          value={data.alerts}
          note="Requieren atención"
          danger
        />
        <Metric
          icon="↗"
          tone="orange"
          label="Solicitudes pendientes"
          value={data.requests.pending}
          note="De instituciones"
        />
        <Metric
          icon="♙"
          tone="purple"
          label="Donantes registrados"
          value={data.donors}
          note="Red de donantes"
        />
      </div>
      <div className="grid">
        <article className="panel inventory">
          <PanelTitle
            title="Inventario por grupo"
            sub="Unidades disponibles ahora"
            action="Ver inventario"
            onClick={() => navigate("Ver inventario")}
          />
          {Object.entries(data.inventory.byGroup).map(([g, n]: any) => (
            <div className="bar-row" key={g}>
              <b>{g}</b>
              <div className="bar">
                <i style={{ width: `${Math.min(100, (n / 5) * 100)}%` }} />
              </div>
              <span>{n}</span>
            </div>
          ))}
        </article>
        <article className="panel">
          <PanelTitle
            title="Solicitudes recientes"
            sub="Seguimiento de requerimientos"
            action="Ver todas"
            onClick={() => navigate("Ver todas")}
          />
          {requests.map((r: any) => (
            <div className="request" key={r.id}>
              <span className={`priority ${r.priority}`} />
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
        <PanelTitle
          title="Actividad del sistema"
          sub="Últimos eventos registrados"
          action="Ver solicitudes"
          onClick={() => navigate("Solicitudes")}
        />
        {events.length ? (
          events.slice(0, 4).map((e: any) => (
            <div className="event" key={e.id}>
              <span>✓</span>
              <div>
                <b>{e.type}</b>
                <small>{new Date(e.occurredAt).toLocaleString("es-CO")}</small>
              </div>
            </div>
          ))
        ) : (
          <p className="muted">Aún no hay eventos.</p>
        )}
      </article>
    </>
  );
}
function Metric({ icon, tone, label, value, note, danger }: any) {
  return (
    <article className="metric">
      <span className={`icon ${tone}`}>{icon}</span>
      <div>
        <small>{label}</small>
        <strong className={danger ? "danger" : ""}>{value}</strong>
        <em>{note}</em>
      </div>
    </article>
  );
}
function PanelTitle({ title, sub, action, onClick }: any) {
  return (
    <div className="panel-title">
      <div>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
      <button className="link" onClick={onClick}>
        {action} →
      </button>
    </div>
  );
}
function Inventory({ units, navigate }: any) {
  return (
    <article className="panel full">
      <div className="table-head">
        <div>
          <h2>Unidades en inventario</h2>
          <p className="muted">
            Control de disponibilidad, ubicación y vencimiento.
          </p>
        </div>
        <button
          className="secondary"
          onClick={() => navigate("Registrar unidad")}
        >
          + Nueva unidad
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Grupo</th>
              <th>Componente</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Vence</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u: any) => (
              <tr key={u.id}>
                <td>
                  <b>{u.code}</b>
                </td>
                <td>
                  <span className="blood-chip">{u.bloodGroup}</span>
                </td>
                <td>{u.component}</td>
                <td>{u.location}</td>
                <td>
                  <span className={`status ${u.status}`}>
                    {u.status === "available" ? "Disponible" : "Reservada"}
                  </span>
                </td>
                <td>{new Date(u.expiresAt).toLocaleDateString("es-CO")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
function Requests({ requests, navigate }: any) {
  return (
    <article className="panel full">
      <div className="table-head">
        <div>
          <h2>Solicitudes transfusionales</h2>
          <p className="muted">
            Prioriza y da seguimiento a las instituciones.
          </p>
        </div>
        <button className="primary" onClick={() => navigate("Solicitudes")}>
          + Nueva solicitud
        </button>
      </div>
      {requests.map((r: any) => (
        <div className="request large" key={r.id}>
          <span className={`priority ${r.priority}`} />
          <div>
            <b>{r.institution}</b>
            <small>
              {r.quantity} unidades · {r.component} · Grupo {r.bloodGroup}
            </small>
          </div>
          <span className={`tag ${r.priority}`}>
            {r.priority === "critical"
              ? "Crítica"
              : r.priority === "urgent"
                ? "Urgente"
                : "Rutina"}
          </span>
          <button className="ghost" onClick={() => navigate("Solicitudes")}>
            Ver detalle
          </button>
        </div>
      ))}
    </article>
  );
}
function Donors({ donors, navigate }: any) {
  return (
    <article className="panel full">
      <div className="table-head">
        <div>
          <h2>Red de donantes</h2>
          <p className="muted">
            Personas registradas para futuras convocatorias.
          </p>
        </div>
        <button className="primary" onClick={() => navigate("Donantes")}>
          + Registrar donante
        </button>
      </div>
      <div className="donor-grid">
        {donors.map((d: any) => (
          <div className="donor" key={d.id}>
            <span className="avatar">
              {d.name
                .split(" ")
                .map((x: string) => x[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div>
              <b>{d.name}</b>
              <small>
                {d.bloodGroup} · {d.documentMasked}
              </small>
            </div>
            <button className="ghost" onClick={() => navigate("Donantes")}>
              Ver perfil
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}
function NewUnit({ navigate }: any) {
  return (
    <article className="panel form-card">
      <div className="form-intro">
        <span className="form-icon">✚</span>
        <div>
          <h2>Registrar una unidad</h2>
          <p className="muted">
            Completa los datos para agregar una unidad al inventario.
          </p>
        </div>
      </div>
      <div className="form-grid">
        <label>
          Código de unidad
          <input placeholder="Ej. HR-104" />
        </label>
        <label>
          Grupo sanguíneo
          <select defaultValue="O+">
            <option>O+</option>
            <option>O-</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>
        </label>
        <label>
          Componente
          <select defaultValue="Glóbulos rojos">
            <option>Glóbulos rojos</option>
            <option>Plaquetas</option>
            <option>Plasma</option>
          </select>
        </label>
        <label>
          Volumen (ml)
          <input type="number" defaultValue="450" />
        </label>
        <label>
          Ubicación
          <input placeholder="Ej. Nevera A · Estante 2" />
        </label>
        <label>
          Fecha de vencimiento
          <input type="date" />
        </label>
      </div>
      <div className="form-actions">
        <button className="secondary" onClick={() => navigate("Inventario")}>
          Cancelar
        </button>
        <button className="primary" onClick={() => navigate("Inventario")}>
          Guardar unidad
        </button>
      </div>
    </article>
  );
}
