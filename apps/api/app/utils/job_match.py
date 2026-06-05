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
        "python", "javascript", "typescript", "golang", "go", "java", "c++", "c#", "ruby", "rust", "kotlin", "scala", "html", "css", "php", "swift", "objective-c", "bash", "shell", "powershell", "r", "sql", "pl/sql",
        # Frameworks & Libraries
        "fastapi", "react", "next.js", "nextjs", "vue", "angular", "django", "flask", "express", "nodejs", "node.js", "spring", "spring boot", "laravel", "rails", "jquery", "bootstrap", "tailwind", "tailwindcss", "redux", "graphql", "apollo", "prisma", "hibernate", "pandas", "numpy", "scikit-learn", "keras", "pytorch", "tensorflow", "opencv", "gemini",
        # Databases & Cache
        "postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite", "nosql", "dynamodb", "elasticsearch", "cassandra", "mariadb", "oracle", "mssql", "sql server", "firebase", "firestore", "supabase",
        # DevOps & Cloud
        "docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "terraform", "nginx", "git", "github", "gitlab", "jenkins", "ansible", "docker-compose", "helm", "prometheus", "grafana", "elk", "datadog", "sentry",
        # AI / ML / Data
        "openai", "llm", "rag", "pytorch", "tensorflow", "ml", "nlp", "ai", "deep learning", "machine learning", "computer vision", "neural networks", "data analytics", "data science", "big data", "hadoop", "spark", "kafka", "airflow",
        # Concepts & Tools
        "rest", "graphql", "testing", "observability", "monitoring", "security", "microservices", "system design", "agile", "scrum", "kanban", "jira", "confluence", "gitflow", "tdd", "bdd", "ci", "cd", "devops", "qa", "frontend", "backend", "fullstack", "full stack", "cloud native", "serverless", "apis", "api design", "web scraping"
    }
    
    text_lower = text.lower()
    signals = []
    seen = set()
    
    # 1. First add exact matches of predefined skills from database
    for skill in sorted(skills_database):
        if len(skill) <= 3:
            pattern = rf"\b{re.escape(skill)}\b"
            if re.search(pattern, text_lower) and skill not in seen:
                seen.add(skill)
                signals.append(skill.upper())
        else:
            if skill in text_lower and skill not in seen:
                seen.add(skill)
                signals.append(skill.upper())
                
    # 2. Add dynamic technical keywords (capitalized words and acronyms)
    common_cap_words = {
        "we", "the", "our", "you", "your", "this", "that", "with", "from", "senior", "junior", "lead", "manager",
        "director", "engineer", "developer", "designer", "analyst", "work", "team", "company", "candidate", 
        "requirements", "responsibilities", "experience", "education", "degree", "skills", "technologies",
        "ability", "strong", "good", "excellent", "position", "role", "highly", "preferred", "required", 
        "looking", "join", "help", "build", "design", "develop", "manage", "collaborate", "deliver", "support",
        "system", "systems", "product", "products", "project", "projects", "business", "technical", "professional",
        "years", "month", "months", "salary", "job", "description", "apply", "contact", "location", "hybrid", "remote",
        "office", "benefits", "equal", "opportunity", "employer", "race", "color", "religion", "sex", "national", "origin",
        "about", "for", "and", "but", "are", "have", "will", "ideal"
    }
    
    # Find capitalized words and acronyms
    words = re.findall(r"\b[A-Z][a-zA-Z0-9+#.\-/]*\b", text)
    for w in words:
        w_clean = w.strip(".,;:!?()\"'")
        w_lower = w_clean.lower()
        if len(w_clean) >= 2 and w_lower not in common_cap_words and w_clean.upper() not in seen:
            if not w_clean.isdigit():
                seen.add(w_clean.upper())
                signals.append(w_clean.upper())
                
    return [s.upper() for s in signals[:16]]


def compare_job_description(resume_text: str, job_description_text: str) -> tuple[int, list[str], list[str]]:
    jd_signals = extract_signals(job_description_text)
    resume_text_lower = resume_text.lower()
    
    matched = []
    missing = []
    
    for signal in jd_signals:
        sig_lower = signal.lower()
        # Handle variations like "next.js" / "nextjs" or "node.js" / "nodejs"
        variations = {sig_lower, sig_lower.replace(".", ""), sig_lower.replace("-", ""), sig_lower.replace("/", "")}
        if any(var in resume_text_lower for var in variations):
            matched.append(signal)
        else:
            missing.append(signal)
            
    universe = max(len(jd_signals), 1)
    score = int(round((len(matched) / universe) * 100))
    # Cap score between 35 and 97
    score = min(max(score, 35), 97)
    return score, matched, missing