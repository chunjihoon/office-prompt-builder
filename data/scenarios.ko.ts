export type EmailPurpose =
  | "진행상황 확인"
  | "업무 처리 요청"
  | "자료/정보 요청"
  | "일정 조율"
  | "결정/승인 요청"
  | "후속 조치 리마인드"
  | "지연 안내"
  | "사과 및 재발방지"
  | "회의 요청"
  | "공유/공지";

export type Tone =
  | "매우 공손"
  | "공손"
  | "중립"
  | "간결"
  | "단호하지만 예의있게";

export type Length = "짧게" | "보통" | "자세히";

export type Audience =
  | "동료"
  | "상사"
  | "타부서"
  | "외부고객/파트너"
  | "여러 명(To/CC 포함)";

export type SubjectStyle =
  | "요청"
  | "확인"
  | "공유"
  | "공지"
  | "회의"
  | "승인"
  | "후속"
  | "지연"
  | "사과";

export type RequirementKey =
  | "collaborative"
  | "noPressure"
  | "clearAsk"
  | "includeSubjectBody"
  | "includeDeadline"
  | "includeNextStep"
  | "includeThanks"
  | "includeBullets";

export const REQUIREMENTS: { key: RequirementKey; label: string; defaultOn: boolean }[] = [
  { key: "collaborative", label: "협업적인 톤을 유지", defaultOn: true },
  { key: "noPressure", label: "재촉/압박 표현은 피함", defaultOn: true },
  { key: "clearAsk", label: "핵심 요청/확인 사항이 분명하게", defaultOn: true },
  { key: "includeSubjectBody", label: "제목(Subject)과 본문 모두 작성", defaultOn: true },
  { key: "includeDeadline", label: "가능하면 희망 일정/마감 포함", defaultOn: true },
  { key: "includeNextStep", label: "다음 액션(Next step) 포함", defaultOn: true },
  { key: "includeThanks", label: "감사 표현 포함", defaultOn: true },
  { key: "includeBullets", label: "요청 사항은 불릿으로 정리", defaultOn: true },
];

export const PURPOSES: EmailPurpose[] = [
  "진행상황 확인",
  "업무 처리 요청",
  "자료/정보 요청",
  "일정 조율",
  "결정/승인 요청",
  "후속 조치 리마인드",
  "지연 안내",
  "사과 및 재발방지",
  "회의 요청",
  "공유/공지",
];

export const TONES: Tone[] = ["매우 공손", "공손", "중립", "간결", "단호하지만 예의있게"];
export const LENGTHS: Length[] = ["짧게", "보통", "자세히"];
export const AUDIENCES: Audience[] = ["동료", "상사", "타부서", "외부고객/파트너", "여러 명(To/CC 포함)"];
export const SUBJECT_STYLES: SubjectStyle[] = ["요청", "확인", "공유", "공지", "회의", "승인", "후속", "지연", "사과"];
