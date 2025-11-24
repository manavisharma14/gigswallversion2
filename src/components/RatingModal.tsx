'use client'
import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'

type ReviewModalProps = {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  freelancerName: string
  gigTitle: string
  onSubmitted?: () => void
}

export default function RatingModal({
  isOpen,
  onClose,
  applicationId,
  freelancerName,
  gigTitle,
  onSubmitted
}: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState<number | null>(null)
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const submit = async () => {
    if (!rating) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/reviews', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, rating, reviewText: text })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.error ?? "Failed to submit review")
      } else {
        onSubmitted?.()
        onClose()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-scaleIn relative">

        {/* Close button */}
        <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600" onClick={onClose}>
          <XMarkIcon className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-gray-900 mb-1">Rate {freelancerName}</h3>
        <p className="text-xs text-gray-500 mb-5">{gigTitle}</p>

        {/* Rating */}
        <div className="flex gap-2 justify-center mb-4">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(n)}
              className={`text-3xl transition ${
                (hover ?? rating) >= n ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Feedback */}
        <textarea
          className="w-full resize-none border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl p-3 text-sm bg-gray-50"
          rows={4}
          placeholder="Share your feedback (optional)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* CTA */}
        <button
          onClick={submit}
          disabled={submitting}
          className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review ⭐"}
        </button>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          0% { transform: scale(.95); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }
        .animate-scaleIn {
          animation: scaleIn .2s ease-out;
        }
      `}</style>
    </div>
  )
}