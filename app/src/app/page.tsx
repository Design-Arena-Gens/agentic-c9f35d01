"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./page.module.css";

type CargoEntry = {
  id: string;
  plateNumber: string;
  yukBilanKg: number;
  yuksizKg: number;
  sofVazinKg: number;
  date: string;
  summa: number;
  checkNumber: string;
};

const initialEntries: CargoEntry[] = [
  {
    id: "entry-1",
    plateNumber: "01 A 123 BC",
    yukBilanKg: 30000,
    yuksizKg: 18000,
    sofVazinKg: 12000,
    date: new Date().toISOString().split("T")[0],
    summa: 30000,
    checkNumber: "CHK-1001",
  },
  {
    id: "entry-2",
    plateNumber: "01 B 456 DE",
    yukBilanKg: 40000,
    yuksizKg: 19000,
    sofVazinKg: 21000,
    date: new Date().toISOString().split("T")[0],
    summa: 40000,
    checkNumber: "CHK-1002",
  },
];

type FormState = {
  plateNumber: string;
  yukBilanKg: string;
  yuksizKg: string;
  date: string;
  summa: string;
  checkNumber: string;
};

const createDefaultFormState = (): FormState => ({
  plateNumber: "",
  yukBilanKg: "",
  yuksizKg: "",
  date: new Date().toISOString().split("T")[0],
  summa: "",
  checkNumber: "",
});

export default function Home() {
  const [entries, setEntries] = useState<CargoEntry[]>(initialEntries);
  const [form, setForm] = useState<FormState>(createDefaultFormState);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const softWeight = useMemo(() => {
    const yukBilan = Number(form.yukBilanKg) || 0;
    const yuksiz = Number(form.yuksizKg) || 0;
    return Math.max(yukBilan - yuksiz, 0);
  }, [form.yukBilanKg, form.yuksizKg]);

  const matchesQuery = (entry: CargoEntry) => {
    if (!searchQuery.trim()) {
      return false;
    }
    const target = searchQuery.trim().toLowerCase();
    return [
      entry.plateNumber,
      entry.yukBilanKg,
      entry.yuksizKg,
      entry.sofVazinKg,
      entry.date,
      entry.summa,
      entry.checkNumber,
    ]
      .join(" ")
      .toLowerCase()
      .includes(target);
  };

  const filteredEntries = !searchQuery.trim()
    ? entries
    : entries.filter((entry) => matchesQuery(entry));

  const resetForm = () => {
    setForm(createDefaultFormState());
    setSelectedId(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAdd();
  };

  const buildEntry = (id: string): CargoEntry => {
    const yukBilan = Number(form.yukBilanKg) || 0;
    const yuksiz = Number(form.yuksizKg) || 0;
    const sofVazin = Math.max(yukBilan - yuksiz, 0);
    return {
      id,
      plateNumber: form.plateNumber.trim() || "N/A",
      yukBilanKg: yukBilan,
      yuksizKg: yuksiz,
      sofVazinKg: sofVazin,
      date: form.date,
      summa: Number(form.summa) || 0,
      checkNumber: form.checkNumber.trim() || "N/A",
    };
  };

  const handleAdd = () => {
    const payload = buildEntry(crypto.randomUUID());
    setEntries((prev) => [payload, ...prev]);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedId) {
      return;
    }
    const payload = buildEntry(selectedId);
    setEntries((prev) => {
      return prev.map((entry) => (entry.id === selectedId ? payload : entry));
    });
    setForm({
      plateNumber: payload.plateNumber,
      yukBilanKg: payload.yukBilanKg.toString(),
      yuksizKg: payload.yuksizKg.toString(),
      date: payload.date,
      summa: payload.summa.toString(),
      checkNumber: payload.checkNumber,
    });
  };

  const handleDelete = () => {
    if (!selectedId) {
      return;
    }
    setEntries((prev) => prev.filter((entry) => entry.id !== selectedId));
    resetForm();
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleRowSelect = (entry: CargoEntry) => {
    setSelectedId(entry.id);
    setForm({
      plateNumber: entry.plateNumber,
      yukBilanKg: entry.yukBilanKg.toString(),
      yuksizKg: entry.yuksizKg.toString(),
      date: entry.date,
      summa: entry.summa.toString(),
      checkNumber: entry.checkNumber,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.overlay}>
        <header className={styles.topBar}>
          <div className={styles.logoArea}>
            <span className={styles.logoIcon}>🐪🐪</span>
            <div className={styles.branding}>
              <span className={styles.brandTitle}>Caravan Cargo Console</span>
              <span className={styles.brandTagline}>Precision Desert Weighbridge</span>
            </div>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={handleAdd}>
              Add
            </button>
            <button type="button" onClick={handleEdit} disabled={!selectedId}>
              Edit
            </button>
            <button type="button" onClick={handleDelete} disabled={!selectedId}>
              Delete
            </button>
            <button type="button" onClick={() => window.print()}>
              Print
            </button>
            <button type="button" onClick={handleReload}>
              Reload
            </button>
          </div>
          <div className={styles.alarmWrapper}>
            <span className={styles.alarmLight} />
            <span className={styles.alarmText}>Alarm Active</span>
          </div>
        </header>

        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🌙</span>
          <input
            type="search"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="plateNumber">Plate Number</label>
            <input
              id="plateNumber"
              value={form.plateNumber}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, plateNumber: event.target.value }))
              }
              placeholder="Enter plate number"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="yukBilan">Yuk bilan (Kg)</label>
            <input
              id="yukBilan"
              type="number"
              inputMode="numeric"
              value={form.yukBilanKg}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, yukBilanKg: event.target.value }))
              }
              placeholder="0"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="yuksiz">Yuksiz (Kg)</label>
            <input
              id="yuksiz"
              type="number"
              inputMode="numeric"
              value={form.yuksizKg}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, yuksizKg: event.target.value }))
              }
              placeholder="0"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="sofVazin">Sof Vazin (Kg)</label>
            <input id="sofVazin" value={softWeight} readOnly />
          </div>
          <div className={styles.field}>
            <label htmlFor="date">Sana (Date)</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, date: event.target.value }))
              }
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="summa">Summa</label>
            <input
              id="summa"
              type="number"
              inputMode="numeric"
              value={form.summa}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, summa: event.target.value }))
              }
              placeholder="0"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="checkNumber">Check Number</label>
            <input
              id="checkNumber"
              value={form.checkNumber}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, checkNumber: event.target.value }))
              }
              placeholder="Enter check number"
            />
          </div>
        </form>

        <section className={styles.tableSection}>
          <div className={styles.tableHeader}>Live Cargo Ledger</div>
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Plate_Number</th>
                  <th>Yuk_bilan</th>
                  <th>Sana (Date)</th>
                  <th>Yuksiz</th>
                  <th>Sof_Vazin</th>
                  <th>Price</th>
                  <th>Check Number</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => {
                  const highlight = matchesQuery(entry);
                  const isSelected = selectedId === entry.id;
                  return (
                    <tr
                      key={entry.id}
                      className={`${highlight ? styles.match : ""} ${
                        isSelected ? styles.selected : ""
                      }`}
                      onClick={() => handleRowSelect(entry)}
                    >
                      <td>{entry.plateNumber}</td>
                      <td>{entry.yukBilanKg.toLocaleString()}</td>
                      <td>{entry.date}</td>
                      <td>{entry.yuksizKg.toLocaleString()}</td>
                      <td>{entry.sofVazinKg.toLocaleString()}</td>
                      <td>{entry.summa.toLocaleString()}</td>
                      <td>{entry.checkNumber}</td>
                    </tr>
                  );
                })}
                {filteredEntries.length === 0 && (
                  <tr>
                    <td colSpan={7} className={styles.emptyState}>
                      No records match the current search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
