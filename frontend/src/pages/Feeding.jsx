import { useState } from "react";

export default function Feeding() {
  const [entries, setEntries] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Milk");

  function add() {
    if (!amount) return;
    setEntries(prev => [
      { id: crypto.randomUUID(), at: new Date().toISOString(), type, amount: Number(amount) },
      ...prev,
    ]);
    setAmount("");
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 max-w-md">
        <label className="grid gap-1 text-sm">
          Type
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option>Milk</option>
            <option>Formula</option>
            <option>Solid</option>
            <option>Water</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Amount (ml / g)
          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="border rounded px-3 py-2"
            placeholder="e.g., 120"
          />
        </label>
        <button onClick={add} className="bg-black text-white rounded py-2 hover:bg-gray-800">
          Add Feeding
        </button>
      </div>

      <div className="border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr key={e.id} className="border-t">
                <td className="p-2">{new Date(e.at).toLocaleString()}</td>
                <td className="p-2">{e.type}</td>
                <td className="p-2">{e.amount}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr><td className="p-3 text-gray-500" colSpan="3">No entries yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}