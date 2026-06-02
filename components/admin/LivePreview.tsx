'use client';

import type { CV } from '@/types/cv';

export function LivePreview({ cv }: { cv: CV }) {
  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="min-h-screen bg-white text-slate-900 p-4 text-xs">
        <PreviewHeader cv={cv} />
        <PreviewSummary cv={cv} />
        <PreviewSkills cv={cv} />
        <PreviewExperience cv={cv} />
        <PreviewEducation cv={cv} />
      </div>
    </div>
  );
}

function PreviewHeader({ cv }: { cv: CV }) {
  return (
    <div className="border-b border-slate-200 pb-3 mb-3">
      <h1 className="text-2xl font-bold text-slate-900">{cv.personal.name}</h1>
      <p className="text-blue-600 font-semibold">{cv.personal.title}</p>
      <p className="text-xs text-slate-500 mt-1">
        {cv.personal.contacts.email} • {cv.personal.contacts.phone} • {cv.personal.contacts.telegram}
      </p>
      <p className="text-xs text-slate-500">
        {cv.personal.location.city}, {cv.personal.location.country}
      </p>
    </div>
  );
}

function PreviewSummary({ cv }: { cv: CV }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-bold text-slate-700 mb-1">PROFESSIONAL SUMMARY</h2>
      <p className="text-xs text-slate-600 leading-relaxed">{cv.summary}</p>
    </div>
  );
}

function PreviewSkills({ cv }: { cv: CV }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-bold text-slate-700 mb-1">SKILLS</h2>
      {cv.skillGroups.map((group) => (
        <div key={group.category} className="mb-1">
          <p className="text-xs font-semibold text-slate-700">{group.category}</p>
          <p className="text-xs text-slate-600">
            {group.skills.map((s) => `${s.name} (${s.level}%)`).join(', ')}
          </p>
        </div>
      ))}
    </div>
  );
}

function PreviewExperience({ cv }: { cv: CV }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-bold text-slate-700 mb-2">WORK EXPERIENCE</h2>
      {cv.experiences.map((exp) => (
        <div key={exp.id} className="mb-3 border-l-2 border-blue-500 pl-2">
          <h3 className="text-sm font-bold text-slate-900">{exp.position}</h3>
          <p className="text-xs text-blue-600">{exp.company} — {exp.project}</p>
          <p className="text-xs text-slate-500">{exp.period} • {exp.domain}</p>
          <ul className="mt-1 text-xs text-slate-700 space-y-0.5">
            {exp.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-1">
                <span>•</span><span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function PreviewEducation({ cv }: { cv: CV }) {
  return (
    <div>
      <h2 className="text-sm font-bold text-slate-700 mb-1">EDUCATION</h2>
      {cv.education.map((edu, i) => (
        <div key={i} className="mb-1 text-xs text-slate-700">
          <span className="font-semibold">{edu.period}</span> — {edu.institution}
          {edu.specialty && <span className="text-slate-500"> ({edu.specialty})</span>}
        </div>
      ))}
    </div>
  );
}
