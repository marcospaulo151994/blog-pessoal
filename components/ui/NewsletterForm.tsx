'use client';

import { useState, type FormEvent } from 'react';

interface NewsletterFormProps {
  placeholder: string;
  submitLabel: string;
  successLabel: string;
}

export function NewsletterForm({ placeholder, submitLabel, successLabel }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Stub: integration comes in v0.2. For now, just acknowledge.
    if (email.trim()) setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="font-mono text-[13px] text-[var(--text)]">{successLabel}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="flex-1 font-mono bg-[var(--surface)] border border-[var(--border)] rounded-md px-4 py-3 text-[14px] text-[var(--text)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
        aria-label={placeholder}
      />
      <button
        type="submit"
        className="font-medium rounded-md transition-opacity hover:opacity-85"
        style={{
          background: 'var(--text)',
          color: 'var(--bg)',
          padding: '12px 24px',
          fontSize: 14,
          borderRadius: 6,
        }}
      >
        {submitLabel}
      </button>
    </form>
  );
}
