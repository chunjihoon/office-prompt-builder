import type {
    Audience,
    EmailPurpose,
    Length,
    Tone,
    SubjectStyle,
    RequirementKey,
  } from "@/data/scenarios.ko";
  
  type BuildEmailPromptArgs = {
    purpose: EmailPurpose;
    tone: Tone;
    length: Length;
    audience: Audience;
  
    recipientName?: string;   // 새로 추가
    recipientTitle?: string;  // 새로 추가
  
    subjectStyle: SubjectStyle; // 새로 추가
    deadline?: string;          // 새로 추가 (예: "오늘 5시", "이번 주 금요일")
    deliverable?: string;       // 새로 추가 (예: "빌드 결과", "첨부 자료", "검토 의견")
    context: string;
  
    requirements: Record<RequirementKey, boolean>; // 체크박스 결과

    customRequirements: string[];
  };
  
  function formatRecipient(name?: string, title?: string) {
    const n = (name || "").trim();
    const t = (title || "").trim();
    if (!n && !t) return "{수신자}";
    if (n && t) return `${n} ${t}`;
    return n || t;
  }
  
  function requirementsToText(
    req: BuildEmailPromptArgs["requirements"],
    customRequirements: string[]
  ) {
    const lines: string[] = [];
    if (req.collaborative) lines.push("- 협업적인 톤을 유지할 것");
    if (req.noPressure) lines.push("- 상대를 압박하거나 재촉하는 표현은 피할 것");
    if (req.clearAsk) lines.push("- 핵심 요청/확인 사항이 분명히 드러나게 할 것");
    if (req.includeDeadline) lines.push("- 가능하다면 희망 일정/마감을 자연스럽게 포함할 것");
    if (req.includeNextStep) lines.push("- 다음 액션(누가 무엇을 할지)을 포함할 것");
    if (req.includeThanks) lines.push("- 감사 표현을 자연스럽게 포함할 것");
    if (req.includeBullets) lines.push("- 요청/확인 항목은 불릿으로 정리할 것");
    if (req.includeSubjectBody) lines.push("- 이메일 제목(Subject)과 본문을 모두 작성할 것");
  
    // ✅ 커스텀 요구사항 추가
    for (const t of customRequirements) {
      const s = t.trim();
      if (s) lines.push(`- ${s}`);
    }
  
    return lines.length ? lines.join("\n") : "- 별도 요구사항 없음";
  }
  
  
  export function buildEmailPrompt(args: BuildEmailPromptArgs) {
    const safeContext = args.context?.trim() || "(상황을 입력해 주세요)";
    const recipient = formatRecipient(args.recipientName, args.recipientTitle);
    const reqText = requirementsToText(args.requirements, args.customRequirements);
  
    return `당신은 회사에서 일하는 사무직 직원입니다.
  
    아래 상황을 바탕으로, ${recipient}에게 보내는 이메일을 한국어로 작성해 주세요.
    
    [작성 옵션]
    - 목적: ${args.purpose}
    - 대상 유형: ${args.audience}
    - 톤: ${args.tone}
    - 길이: ${args.length}
    - Subject 유형: ${args.subjectStyle}
    ${args.deadline?.trim() ? `- 희망 일정/마감: ${args.deadline.trim()}\n` : ""}${args.deliverable?.trim() ? `- 요청 산출물/자료: ${args.deliverable.trim()}\n` : ""}
    
    [상황]
    ${safeContext}
    
    [요구사항]
    ${reqText}
    
    [출력 형식]
    1) Subject: (한 줄)
    2) 본문: 인사 → 배경/현재상황 → 요청/확인사항 → 다음 단계 → 마무리
    `;
  }
  