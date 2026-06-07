import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  BrewMethod, ProcessingMethod, RoastLevel,
  BREW_METHODS, PROCESSING_METHODS, ROAST_LEVELS, AROMA_NOTES,
} from '../types';

interface FormData {
  coffeeName: string;
  roastery: string;
  origin: string;
  processing: ProcessingMethod;
  roastLevel: RoastLevel;
  brewMethod: BrewMethod | '';
  rating: number;
  aromaProfile: string[];
  notes: string;
}

const INIT: FormData = {
  coffeeName: '',
  roastery: '',
  origin: '',
  processing: 'washed',
  roastLevel: 'medium',
  brewMethod: '',
  rating: 0,
  aromaProfile: [],
  notes: '',
};

const STEP_LABELS = ['Bean', 'Brew', 'Taste'];

export function NewCheckIn() {
  const navigate = useNavigate();
  const addCheckIn = useStore(s => s.addCheckIn);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INIT);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function toggleAroma(aroma: string) {
    setForm(f => ({
      ...f,
      aromaProfile: f.aromaProfile.includes(aroma)
        ? f.aromaProfile.filter(a => a !== aroma)
        : [...f.aromaProfile, aroma],
    }));
  }

  function canNext() {
    if (step === 0) return form.coffeeName.trim().length > 0 && form.roastery.trim().length > 0;
    if (step === 1) return form.brewMethod !== '';
    if (step === 2) return form.rating > 0;
    return true;
  }

  async function submit() {
    if (!form.brewMethod) return;
    setSubmitting(true);
    setSubmitError(null);
    const { error } = await addCheckIn({
      coffee: {
        name: form.coffeeName.trim(),
        roastery: form.roastery.trim(),
        origin: form.origin.trim() || 'Unknown',
        processing: form.processing,
        roastLevel: form.roastLevel,
      },
      brewMethod: form.brewMethod as BrewMethod,
      rating: form.rating,
      aromaProfile: form.aromaProfile,
      notes: form.notes.trim(),
    });
    if (error) {
      setSubmitError(error);
      setSubmitting(false);
    } else {
      navigate('/');
    }
  }

  const isLast = step === STEP_LABELS.length - 1;

  return (
    <div className="fixed inset-0 flex flex-col bg-espresso-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-safe pb-4 text-white flex-shrink-0">
        <button
          onClick={() => (step === 0 ? navigate('/') : setStep(s => s - 1))}
          className="p-2 -ml-2 transition-opacity active:opacity-60"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-lg leading-none">Log a Coffee</h1>
          <p className="text-espresso-300 text-xs mt-0.5">{STEP_LABELS[step]}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="p-2 -mr-2 transition-opacity active:opacity-60"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5 px-4 pb-5 flex-shrink-0">
        {STEP_LABELS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? 'bg-caramel-400' : 'bg-espresso-700'
            }`}
          />
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 bg-cream-50 rounded-t-3xl overflow-y-auto">
        <div className="px-4 pt-6 pb-8">
          {step === 0 && <StepBean form={form} set={set} />}
          {step === 1 && <StepBrew form={form} set={set} />}
          {step === 2 && <StepTaste form={form} set={set} toggleAroma={toggleAroma} />}
        </div>
        {/* Spacer for the fixed button */}
        <div className="h-24" />
      </div>

      {/* CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-cream-200 px-4 pb-safe pt-3 space-y-2">
        {submitError && (
          <p className="text-red-500 text-sm text-center">{submitError}</p>
        )}
        <button
          onClick={() => (isLast ? submit() : setStep(s => s + 1))}
          disabled={!canNext() || submitting}
          className="btn-primary w-full text-base"
        >
          {submitting ? 'Saving…' : isLast ? (
            <>Log Coffee <Check size={18} /></>
          ) : (
            <>Next <ArrowRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
}

/* ── Step 1: Bean info ─────────────────────────────────────────────────── */

function StepBean({
  form,
  set,
}: {
  form: FormData;
  set: <K extends keyof FormData>(key: K, v: FormData[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-espresso-900">What are you drinking?</h2>
        <p className="text-gray-500 text-sm mt-1">Tell us about the bean</p>
      </div>

      <Field label="Coffee / Bean Name" required>
        <input
          type="text"
          placeholder="e.g. Kenya Gichathaini AA"
          value={form.coffeeName}
          onChange={e => set('coffeeName', e.target.value)}
          className="input-field"
          autoFocus
        />
      </Field>

      <Field label="Roastery" required>
        <input
          type="text"
          placeholder="e.g. The Barn"
          value={form.roastery}
          onChange={e => set('roastery', e.target.value)}
          className="input-field"
        />
      </Field>

      <Field label="Origin">
        <input
          type="text"
          placeholder="e.g. Kenya, Ethiopia, Colombia"
          value={form.origin}
          onChange={e => set('origin', e.target.value)}
          className="input-field"
        />
      </Field>

      <Field label="Processing">
        <div className="grid grid-cols-3 gap-2">
          {PROCESSING_METHODS.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => set('processing', m.id)}
              className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                form.processing === m.id
                  ? 'bg-espresso-800 border-espresso-800 text-white'
                  : 'bg-white border-gray-200 text-gray-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Roast Level">
        <div className="flex gap-1.5">
          {ROAST_LEVELS.map(l => (
            <button
              key={l.id}
              type="button"
              onClick={() => set('roastLevel', l.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                form.roastLevel === l.id
                  ? 'border-transparent text-white'
                  : 'border-transparent bg-gray-100 text-gray-500'
              }`}
              style={form.roastLevel === l.id ? { backgroundColor: l.color } : undefined}
            >
              {l.label}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

/* ── Step 2: Brew method ───────────────────────────────────────────────── */

function StepBrew({
  form,
  set,
}: {
  form: FormData;
  set: <K extends keyof FormData>(key: K, v: FormData[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-espresso-900">How did you brew it?</h2>
        <p className="text-gray-500 text-sm mt-1">Choose your brew method</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {BREW_METHODS.map(m => (
          <button
            key={m.id}
            type="button"
            onClick={() => set('brewMethod', m.id)}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
              form.brewMethod === m.id
                ? 'border-espresso-800 bg-espresso-800 text-white shadow-lg'
                : 'border-gray-200 bg-white text-gray-700'
            }`}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="font-semibold text-sm leading-tight">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Step 3: Taste & Rating ────────────────────────────────────────────── */

const RATING_LABELS = ['', 'Not great', 'Below average', 'Good', 'Very good', 'Outstanding! ✨'];

function StepTaste({
  form,
  set,
  toggleAroma,
}: {
  form: FormData;
  set: <K extends keyof FormData>(key: K, v: FormData[K]) => void;
  toggleAroma: (a: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-espresso-900">How was it?</h2>
        <p className="text-gray-500 text-sm mt-1">Rate your experience</p>
      </div>

      {/* Star rating */}
      <div className="bg-white rounded-2xl p-5 border border-cream-200">
        <p className="text-sm font-bold text-espresso-800 mb-3 text-center">Overall Rating</p>
        <div className="flex items-center justify-center gap-3">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => set('rating', star)}
              className="transition-transform active:scale-75"
            >
              <svg width={40} height={40} viewBox="0 0 24 24">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={star <= form.rating ? '#C67B2A' : '#E5E7EB'}
                />
              </svg>
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-2 h-5">
          {RATING_LABELS[form.rating] ?? ''}
        </p>
      </div>

      {/* Aroma notes */}
      <div>
        <p className="text-sm font-bold text-espresso-800 mb-3">Aroma & Flavor Notes</p>
        <div className="flex flex-wrap gap-2">
          {AROMA_NOTES.map(aroma => (
            <button
              key={aroma}
              type="button"
              onClick={() => toggleAroma(aroma)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                form.aromaProfile.includes(aroma)
                  ? 'bg-espresso-800 border-espresso-800 text-white'
                  : 'bg-white border-gray-200 text-gray-700'
              }`}
            >
              {aroma}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <Field label="Tasting Notes">
        <textarea
          placeholder="What did you taste? Body, acidity, aftertaste, special impressions..."
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          rows={4}
          className="input-field resize-none"
        />
      </Field>
    </div>
  );
}

/* ── Helper ────────────────────────────────────────────────────────────── */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-espresso-800 mb-2">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
