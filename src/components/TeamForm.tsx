import React, { useState } from "react";
import { useData } from "../context/DataContext";

const TeamForm: React.FC = () => {
  const { addTeam } = useData();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addTeam({ name, description });
    setName("");
    setDescription("");
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-xl font-semibold">Ekip Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Ekip Adı
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Açıklama
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Ekip Oluştur
        </button>
      </form>
    </div>
  );
};

export default TeamForm;
