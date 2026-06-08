'use client'

import { useState } from 'react'

export function RejectForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
      >
        Respinge
      </button>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-2 mt-2">
      <textarea
        name="comment"
        required
        placeholder="Motivul respingerii..."
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
        rows={3}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Confirma respingerea
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Anuleaza
        </button>
      </div>
    </form>
  )
}
