"use client";

import { useState, useEffect } from "react";

interface Recipient {
  id: string;
  name: string;
  address: string;
}

interface RecipientManagerProps {
  onSelect: (recipient: Recipient) => void;
}

export default function RecipientManager({ onSelect }: RecipientManagerProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("intenton_recipients");
    if (saved) {
      setRecipients(JSON.parse(saved));
    } else {
      // Default placeholder for demo
      const defaults = [
        { id: "1", name: "Ahmed", address: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c" },
        { id: "2", name: "Sara", address: "UQCc-73n... (Demo Address)" }
      ];
      setRecipients(defaults);
      localStorage.setItem("intenton_recipients", JSON.stringify(defaults));
    }
  }, []);

  const addRecipient = () => {
    if (!name || !address) return;
    const newRecipient = { id: Date.now().toString(), name, address };
    const updated = [...recipients, newRecipient];
    setRecipients(updated);
    localStorage.setItem("intenton_recipients", JSON.stringify(updated));
    setName("");
    setAddress("");
    setShowAdd(false);
  };

  const deleteRecipient = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recipients.filter((r) => r.id !== id);
    setRecipients(updated);
    localStorage.setItem("intenton_recipients", JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-widest text-neutral-400">Address Book</h3>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="text-[10px] text-black border border-neutral-200 px-2 py-1 rounded hover:bg-neutral-50 transition-colors"
        >
          {showAdd ? "Cancel" : "+ Add Friend"}
        </button>
      </div>

      {showAdd && (
        <div className="flex flex-col gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-100 animate-fade-in">
          <input 
            type="text" 
            placeholder="Friend Name" 
            className="text-xs p-2 rounded border border-neutral-200 focus:outline-none focus:border-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="TON Address" 
            className="text-xs p-2 rounded border border-neutral-200 focus:outline-none focus:border-black font-archivo"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button 
            onClick={addRecipient}
            className="text-xs bg-black text-white px-3 py-2 rounded hover:bg-neutral-800 transition-colors"
          >
            Save Friend
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {recipients.map((r) => (
          <div 
            key={r.id}
            onClick={() => onSelect(r)}
            className="group flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-xl hover:border-black cursor-pointer transition-all hover:shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] text-neutral-500">
              {r.name[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-black">{r.name}</span>
              <span className="text-[10px] text-neutral-400 truncate w-16">{r.address}</span>
            </div>
            <button 
              onClick={(e) => deleteRecipient(r.id, e)}
              className="opacity-0 group-hover:opacity-100 text-neutral-300 hover:text-red-500 transition-all p-1"
            >
              ×
            </button>
          </div>
        ))}

        {recipients.length === 0 && (
        <p className="text-[10px] text-neutral-400 font-bold px-1">No friends saved yet.</p>
      )}
      </div>
    </div>
  );
}
