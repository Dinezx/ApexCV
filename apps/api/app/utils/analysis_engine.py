import re

CORE_KEYWORDS = {
    "fastapi",
    "typescript",
    "python",
    "sql",
    "docker",
    "postgresql",
    "ci/cd",
    "aws",
    "render",
    "vercel",
    "openai",
    "react",
}


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def detect_keywords(text: str, target_role: str) -> tuple[list[str], list[str]]:
    normalized = normalize_text(text)
    role_tokens = {t for t in re.split(r"[^a-z0-9+/]+", target_role.lower()) if len(t) > 2}
    expected = CORE_KEYWORDS | role_tokens
    present = sorted([k for k in expected if k in normalized])
    missing = sorted([k for k in expected if k not in normalized])
    return present, missing


def compute_ats_score(present_count: int, missing_count: int) -> int:
    total = max(present_count + missing_count, 1)
    ratio = present_count / total
    return int(min(max(round(ratio * 100), 35), 97))


def derive_skill_gap(missing_keywords: list[str]) -> list[str]:
    return missing_keywords[:5]


def generate_smart_suggestions(text: str, present: list[str], missing: list[str], target_role: str) -> list[str]:
    suggestions = []
    normalized = normalize_text(text)

    # 1. Section Checks
    if not any(x in normalized for x in ["experience", "work history", "employment", "professional history"]):
        suggestions.append("Structure a clear 'Experience' section to organize your career timeline for ATS parsing.")
    if not any(x in normalized for x in ["education", "degree", "university", "college"]):
        suggestions.append("Ensure your 'Education' section is clearly visible with your degree and graduation details.")
    if not any(x in normalized for x in ["skills", "technologies", "core expertise"]):
        suggestions.append("Create a dedicated 'Skills' or 'Technologies' section to help index your technical expertise.")

    # 2. Metric / Quantification check
    metrics_count = len(re.findall(r"\d+%", text)) + len(re.findall(r"\$\d+", text)) + len(re.findall(r"\b\d+x\b", text))
    if metrics_count < 2:
        suggestions.append("Quantify your achievements (e.g. 'improved efficiency by 30%', 'saved $10k') to highlight direct business outcomes.")

    # 3. Missing Keywords
    if missing:
        top_missing = [m.upper() for m in missing[:3]]
        suggestions.append(f"Incorporate missing core tech skills like {', '.join(top_missing)} naturally into your experience bullets.")

    # 4. Action verbs check
    action_verbs = ["led", "managed", "designed", "built", "implemented", "developed", "orchestrated", "engineered", "spearheaded", "optimized"]
    verb_count = sum(len(re.findall(rf"\b{v}\b", normalized)) for v in action_verbs)
    if verb_count < 3:
        suggestions.append("Start your achievement bullets with strong active verbs (e.g., 'spearheaded', 'orchestrated') instead of passive phrasing.")

    # 5. Length Check
    if len(text) < 1000:
        suggestions.append("Expand on your project scopes and technical ownership. A detailed resume should generally be between 1,500 and 4,000 characters.")
    elif len(text) > 8000:
        suggestions.append("Condense your content to a focused 1-2 page layout. Resumes over 8,000 characters can degrade recruiter engagement.")

    # Fallback to standard high-impact suggestions
    fallbacks = [
        "Align your resume summary directly with key responsibilities described in the target job description.",
        "Ensure consistent date formatting (e.g. MM/YYYY) to facilitate timeline indexing.",
        "Avoid using nested tables or charts in the PDF layout as they can interfere with ATS text extraction."
    ]

    for f in fallbacks:
        if len(suggestions) >= 3:
            break
        if f not in suggestions:
            suggestions.append(f)

    return suggestions[:3]
