"use client";

import { useState } from "react";

export default function VerificationPage() {

  const [file, setFile] = useState<File | null>(null);

  const [result, setResult] = useState("");

  const handleVerify = async () => {

    if (!file) return;

    const formData = new FormData();

    formData.append("bill", file);

    const res = await fetch(
      "/api/verify-bill",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    setResult(data.status);
  };

  return (
    <div className="p-10">

      <h1 className="text-5xl font-bold">
        Bill Verification
      </h1>

      <input
        type="file"
        className="mt-10"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <button
        onClick={handleVerify}
        className="mt-6 rounded bg-blue-600 px-6 py-3 text-white"
      >
        Verify Bill
      </button>

      {result && (
        <p className="mt-10 text-3xl">
          {result}
        </p>
      )}

    </div>
  );
}