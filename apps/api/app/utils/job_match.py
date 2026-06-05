import re

STOPWORDS = {
    "the",
    "and",
    "for",
    "with",
    "from",
    "that",
    "this",
    "your",
    "will",
    "have",
    "team",
    "role",
    "years",
    "experience",
    "ability",
    "responsibilities",
    "requirements",
    "preferred",
    "required",
    "etc",
    "including",
    "across",
    "strong",
    "good",
}

PRIMARY_KEYWORDS = {
    "fastapi",
    "python",
    "typescript",
    "react",
    "next.js",
    "postgresql",
    "sql",
    "docker",
    "kubernetes",
    "aws",
    "gcp",
    "azure",
    "openai",
    "llm",
    "rest",
    "graphql",
    "testing",
    "ci/cd",
    "observability",
    "ml",
    "data",
    "security",
}


def tokenize(text: str) -> list[str]:
    tokens = re.findall(r"[a-zA-Z0-9+.#/\-]{3,}", text.lower())
    return [token for token in tokens if token not in STOPWORDS]


def extract_signals(text: str) -> list[str]:
    skills_database = {
        # Languages
        "python", "javascript", "typescript", "golang", "go", "java", "c++", "c#", "ruby", "rust", "kotlin", "scala", "html", "css",
        # Frameworks & Libraries
        "fastapi", "react", "next.js", "nextjs", "vue", "angular", "django", "flask", "express", "nodejs", "node.js",
        # Databases & Cache
        "postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite", "sql", "nosql", "dynamodb", "elasticsearch",
        # DevOps & Cloud
        "docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "terraform", "nginx", "git", "github",
        # AI / ML
        "openai", "llm", "rag", "pytorch", "tensorflow", "ml", "nlp", "ai", "deep learning", "machine learning",
        # Concepts & Tools
        "rest", "graphql", "testing", "observability", "monitoring", "security", "microservices", "system design"
    }
    
    text_lower = text.lower()
    signals: list[str] = []
    seen: set[str] = set()
    
    # Extract exact matches of known skills from the text
    for skill in sorted(skills_database):
        # Use regex to find clean word boundaries for short keywords like 'go', 'ml', 'ai'
        if len(skill) <= 3:
            pattern = rf"\b{re.escape(skill)}\b"
            if re.search(pattern, text_lower) and skill not in seen:
                seen.add(skill)
                signals.append(skill)
        else:
            if skill in text_lower and skill not in seen:
                seen.add(skill)
                signals.append(skill)
                
    return [s.upper() for s in signals[:16]]


def compare_job_description(resume_text: str, job_description_text: str) -> tuple[int, list[str], list[str]]:
    jd_signals = extract_signals(job_description_text)
    resume_text_lower = resume_text.lower()
    matched = [signal for signal in jd_signals if signal.lower() in resume_text_lower]
    missing = [signal for signal in jd_signals if signal.lower() not in resume_text_lower]
    universe = max(len(jd_signals), 1)
    score = int(round((len(matched) / universe) * 100))
    # Cap score between 35 and 97
    score = min(max(score, 35), 97)
    return score, matched, missing