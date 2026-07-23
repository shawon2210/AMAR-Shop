'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';

const subjects = [
  { value: '', label: 'Select a subject' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'order_support', label: 'Order Support' },
  { value: 'business', label: 'Business Partnership' },
  { value: 'press', label: 'Press / Media' },
  { value: 'report', label: 'Report Issue' },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialForm: FormData = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Invalid email format';
    }
    if (!form.subject) errs.subject = 'Please select a subject';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccess(false);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.post('/support/tickets', form);
      setSuccess(true);
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  return (
    <div className="app-container py-6 space-y-6 pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Contact Us</span>
      </nav>

      <h1 className="text-responsive-subheading font-bold">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {success && (
            <div className="bg-green-50 text-green-700 rounded-lg p-4 text-sm border border-green-200 flex items-start gap-3 mb-6">
              <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">check_circle</span>
              <div>
                <p className="font-medium">Message sent successfully!</p>
                <p className="mt-0.5">Our team will get back to you within 24 hours.</p>
              </div>
            </div>
          )}

          {serverError && (
            <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-on-surface mb-1.5">
                  Name <span className="text-error">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 h-11 min-h-[44px] text-sm outline-none transition-colors ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-[#ddd]'
                  }`}
                  placeholder="Your full name"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-1.5">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 h-11 min-h-[44px] text-sm outline-none transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-[#ddd]'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-on-surface mb-1.5">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="w-full border border-[#ddd] rounded-lg px-3 py-2.5 h-11 min-h-[44px] text-sm outline-none"
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-on-surface mb-1.5">
                  Subject <span className="text-error">*</span>
                </label>
                <select
                  id="subject"
                  value={form.subject}
                  onChange={(e) => update('subject', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 h-11 min-h-[44px] text-sm outline-none transition-colors ${
                    errors.subject ? 'border-red-300 bg-red-50' : 'border-[#ddd]'
                  }`}
                >
                  {subjects.map((s) => (
                    <option key={s.value} value={s.value} disabled={!s.value}>{s.label}</option>
                  ))}
                </select>
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-on-surface mb-1.5">
                Message <span className="text-error">*</span>
              </label>
              <textarea
                id="message"
                rows={6}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none resize-none transition-colors ${
                  errors.message ? 'border-red-300 bg-red-50' : 'border-[#ddd]'
                }`}
                placeholder="How can we help you?"
              />
              {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 h-11 min-h-[44px] bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {submitting && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#eee] p-5 space-y-5">
            <h2 className="font-semibold text-on-surface">Contact Information</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">location_on</span>
                <div>
                  <p className="text-sm font-medium text-on-surface">Address</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    123 Gulshan Avenue<br />
                    Dhaka 1212, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">call</span>
                <div>
                  <p className="text-sm font-medium text-on-surface">Phone</p>
                  <a href="tel:+8801700000000" className="text-sm text-primary hover:underline">+880 1700-000000</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">mail</span>
                <div>
                  <p className="text-sm font-medium text-on-surface">Email</p>
                  <a href="mailto:support@amarshop.com" className="text-sm text-primary hover:underline">support@amarshop.com</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">schedule</span>
                <div>
                  <p className="text-sm font-medium text-on-surface">Business Hours</p>
                  <p className="text-sm text-on-surface-variant">Sat - Thu: 9:00 AM - 6:00 PM</p>
                  <p className="text-sm text-on-surface-variant">Friday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="font-semibold text-on-surface mb-4">Follow Us</h2>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Facebook">
                <span className="material-symbols-outlined text-[20px]">facebook</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Instagram">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors" aria-label="YouTube">
                <span className="material-symbols-outlined text-[20px]">play_circle</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors" aria-label="LinkedIn">
                <span className="material-symbols-outlined text-[20px]">linked_camera</span>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="font-semibold text-on-surface mb-2">Quick Help</h2>
            <p className="text-sm text-on-surface-variant mb-3">
              Check our FAQ page for instant answers to common questions.
            </p>
            <Link href="/help" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
              Visit FAQ
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}