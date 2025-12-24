"use client";

import { useMemo, useState } from "react";
import { buildEmailPrompt } from "@/lib/buildPrompt";
import {
  PURPOSES,
  TONES,
  LENGTHS,
  AUDIENCES,
  SUBJECT_STYLES,
  REQUIREMENTS,
  type RequirementKey,
  type EmailPurpose,
  type Tone,
  type Length,
  type Audience,
  type SubjectStyle,
} from "@/data/scenarios.ko";

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-medium text-slate-700">{children}</div>;
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[15px] text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
    >
      {options.map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  );
}

export default function Home() {
  const [purpose, setPurpose] = useState<EmailPurpose>(PURPOSES[0] ?? "진행상황 확인");
  const [tone, setTone] = useState<Tone>(TONES[0]);
  const [length, setLength] = useState<Length>(LENGTHS[1] ?? LENGTHS[0]); // 보통이 2번째면
  const [audience, setAudience] = useState<Audience>(AUDIENCES[0]);
  const [subjectStyle, setSubjectStyle] = useState<SubjectStyle>(SUBJECT_STYLES[0]);

  const [context, setContext] = useState("");
  const [copied, setCopied] = useState(false);

  const [recipientName, setRecipientName] = useState("");
  const [recipientTitle, setRecipientTitle] = useState("");

  const [deadline, setDeadline] = useState("");
  const [deliverable, setDeliverable] = useState("");

  // 요구사항 체크 상태
  const [requirements, setRequirements] = useState<Record<RequirementKey, boolean>>(() => {
    const initial = {} as Record<RequirementKey, boolean>;
    for (const r of REQUIREMENTS) initial[r.key] = r.defaultOn;
    return initial;
  });

  const [customReqInput, setCustomReqInput] = useState("");
  const [customRequirements, setCustomRequirements] = useState<string[]>([]);

  const selectAllRequirements = () => {
    setRequirements((prev) => {
      const next = { ...prev };
      for (const r of REQUIREMENTS) next[r.key] = true;
      return next;
    });
  };
  
  const clearAllRequirements = () => {
    setRequirements((prev) => {
      const next = { ...prev };
      for (const r of REQUIREMENTS) next[r.key] = false;
      return next;
    });
    setCustomRequirements([]); // ✅ 커스텀도 같이 비우는 게 “전체해제” 의미에 맞음
  };

  const addCustomRequirement = () => {
    const text = customReqInput.trim();
    if (!text) return;
    setCustomRequirements((prev) => [...prev, text]);
    setCustomReqInput("");
  };
  
  const prompt = useMemo(
    () =>
      buildEmailPrompt({
        purpose,
        tone,
        length,
        audience,
        recipientName,
        recipientTitle,
        subjectStyle,
        deadline,
        deliverable,
        context,
        requirements,
        customRequirements, // 👈 추가
      }),
    [
      purpose,
      tone,
      length,
      audience,
      recipientName,
      recipientTitle,
      subjectStyle,
      deadline,
      deliverable,
      context,
      requirements,
      customRequirements, // 👈 추가
    ]
  );

  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex flex-col">
            <h1 className="text-base font-semibold tracking-tight">Office Prompt Builder</h1>
            <p className="text-xs text-slate-500">사무직 업무용 프롬프트 생성기 (MVP)</p>
          </div>

          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            {copied ? "복사됨" : "프롬프트 복사"}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-2 md:gap-6">
        {/* Left: Controls */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">이메일 작성</h2>
            <p className="mt-1 text-sm text-slate-500">
              옵션을 선택하고 상황을 입력하면, 바로 붙여넣어 쓸 프롬프트가 생성됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>목적</Label>
              <Select value={purpose} onChange={(v) => setPurpose(v as EmailPurpose)} options={PURPOSES} />
            </div>
            <div>
              <Label>대상</Label>
              <Select value={audience} onChange={(v) => setAudience(v as Audience)} options={AUDIENCES} />
            </div>
            <div>
              <Label>톤</Label>
              <Select value={tone} onChange={(v) => setTone(v as Tone)} options={TONES} />
            </div>
            <div>
              <Label>길이</Label>
              <Select value={length} onChange={(v) => setLength(v as Length)} options={LENGTHS} />
            </div>

            {/* 메타 옵션: Subject / 마감 / 산출물 */}
            <div className="mt-3">
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                {/* Subject */}
                <div className="md:col-span-4">
                  <Label>Subject 유형</Label>
                  <Select
                    value={subjectStyle}
                    onChange={(v) => setSubjectStyle(v as SubjectStyle)}
                    options={SUBJECT_STYLES}
                  />
                </div>

                <div>
                  <Label>수신인 이름 + 직급/호칭</Label>
                  <input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="예: 김민수 매니저님/과장님"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[15px] text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                {/* Deadline */}
                <div className="md:col-span-8">
                  <Label>희망 일정/마감 (선택)</Label>
                  <input
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="예: 오늘 5시 / 이번 주 금요일"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[15px] text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                {/* Deliverable */}
                <div className="md:col-span-12">
                  <Label>요청 산출물/자료 (선택)</Label>
                  <input
                    value={deliverable}
                    onChange={(e) => setDeliverable(e.target.value)}
                    placeholder="예: 빌드 완료 예상 시간 / 검토 의견 / 첨부 자료"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[15px] text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <Label>요구사항(선택)</Label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllRequirements}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                  >
                    전체선택
                  </button>
                  <button
                    type="button"
                    onClick={clearAllRequirements}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                  >
                    전체해제
                  </button>
                </div>
              </div>

              <div className="mt-2 grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                {REQUIREMENTS.map((r) => (
                  <label key={r.key} className="flex items-start gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={requirements[r.key]}
                      onChange={(e) => setRequirements((prev) => ({ ...prev, [r.key]: e.target.checked }))}
                      className="mt-1 h-4 w-4 rounded border-slate-300"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}

                {/* ✅ 직접 추가 */}
                <div className="mt-2 p-3">
                  <div className="text-xs font-semibold text-slate-700">직접추가하기</div>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={customReqInput}
                      onChange={(e) => setCustomReqInput(e.target.value)}
                      placeholder="예: 가능한 경우 오늘 안에 회신 부탁드립니다 (압박 표현은 피해서 작성)"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[13px] leading-5 text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                      />
                    <button
                      type="button"
                      onClick={addCustomRequirement}
                      className="shrink-0 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
                    >
                      +
                    </button>
                  </div>

                  {customRequirements.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-semibold text-slate-600">추가된 항목</div>
                      <ul className="space-y-2">
                        {customRequirements.map((t, idx) => (
                          <li key={`${t}-${idx}`} className="flex items-start justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                            <span className="leading-5">- {t}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setCustomRequirements((prev) => prev.filter((_, i) => i !== idx))
                              }
                              className="shrink-0 text-xs font-semibold text-slate-500 hover:text-slate-800"
                            >
                              삭제
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          <div className="mt-4">
            <Label>상황</Label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="예: 통합 빌드 작업이 언제까지 완료될지 확인하고, 가능하면 일정에 맞춰 진행 요청"
              rows={6}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-[15px] text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            />
            <div className="mt-2 text-xs text-slate-500">
              팁: “누가/무엇을/언제까지/어떤 산출물” 4가지만 써도 결과가 좋아집니다.
            </div>
          </div>

          {/* Mobile copy button (secondary) */}
          <button
            onClick={copy}
            className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 md:hidden"
          >
            {copied ? "복사됨" : "프롬프트 복사"}
          </button>
        </section>

        {/* Right: Output */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">생성된 프롬프트</h3>
              <p className="mt-1 text-xs text-slate-500">ChatGPT/Claude/Gemini 등에 그대로 붙여넣기</p>
            </div>
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 md:inline">
              자동 업데이트
            </span>
          </div>

          <pre className="min-h-[360px] whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[13px] leading-6 text-slate-900">
            {prompt}
          </pre>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={copy}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              {copied ? "복사됨" : "프롬프트 복사"}
            </button>
            <button
              onClick={() => setContext("")}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
            >
              상황 초기화
            </button>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs text-slate-500">
        © {new Date().getFullYear()} Office Prompt Builder — MVP
      </footer>
    </div>
  );
}
