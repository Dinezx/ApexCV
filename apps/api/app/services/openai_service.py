# pyrefly: ignore [missing-import]
from openai import AsyncOpenAI

from app.core.config import settings


class OpenAIService:
    def __init__(self) -> None:
        api_key = settings.openai_api_key
        if not api_key:
            self.client = None
            self.model = settings.openai_model
            return

        # Auto-detect Gemini API key (Google keys don't start with 'sk-')
        if not api_key.startswith("sk-"):
            self.client = AsyncOpenAI(
                api_key=api_key,
                base_url="https://generativelanguage.googleapis.com/v1beta/"
            )
            # Default model to gemini-1.5-flash if set to default openai placeholder
            self.model = "gemini-1.5-flash" if settings.openai_model == "gpt-4.1-mini" else settings.openai_model
        else:
            self.client = AsyncOpenAI(api_key=api_key)
            self.model = settings.openai_model

    async def generate_resume_summary(self, text: str, target_role: str, present: list[str], missing: list[str]) -> str:
        if not self.client:
            present_txt = ", ".join(present[:4]).upper() if present else "basic engineering tools"
            missing_txt = ", ".join(missing[:4]).upper() if missing else "none"
            
            summary = f"The candidate's profile demonstrates core familiarity with {present_txt}, showing initial alignment with software engineering workflows. "
            if missing:
                summary += f"However, to fully meet expectations for a {target_role} position, the resume should be optimized to address critical technology gaps in {missing_txt}. "
            else:
                summary += f"The resume matches the core keyword requirements for the {target_role} position well. "
                
            if len(text) < 1500:
                summary += "Expanding on professional achievements and quantifying outcomes would make the profile significantly more competitive."
            else:
                summary += "Focus on highlighting leadership achievements to strengthen recruiter appeal."
            return summary

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert recruiter and ATS coach. Return one concise paragraph.",
                },
                {
                    "role": "user",
                    "content": f"Target role: {target_role}\nResume text:\n{text[:5000]}",
                },
            ],
        )
        return response.choices[0].message.content.strip()

    async def chat_assistant(self, message: str, resume_context: str | None = None) -> str:
        if not self.client:
            return "Include measurable metrics (e.g. +20% output boost), highlight missing technical requirements naturally, and keep summaries under 3 experience lines."

        prompt = f"Context: {resume_context[:3000] if resume_context else 'No resume context.'}\nUser message: {message}"
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI resume assistant. Be direct and practical.",
                },
                {"role": "user", "content": prompt},
            ],
        )
        return response.choices[0].message.content.strip()


    async def generate_job_vacancies(self, target_role: str, keywords: list[str]) -> list[dict]:
        import json
        
        fallback_jobs = [
            {
                "title": f"Senior {target_role or 'Software Engineer'}",
                "company": "TechCorp Solutions",
                "location": "San Francisco, CA (Hybrid)",
                "salary": "$130,000 - $160,000",
                "description": f"Looking for a skilled professional with expertise in {', '.join(keywords[:3]) if keywords else 'modern technologies'} to join our core team and scale our products.",
                "match_rate": 92
            },
            {
                "title": f"{target_role or 'Software Engineer'} II",
                "company": "Innovate Analytics",
                "location": "Austin, TX (Remote)",
                "salary": "$110,000 - $135,000",
                "description": f"Apply your skills in {', '.join(keywords[:2]) if len(keywords) >= 2 else 'software design'} to build robust systems, collaborate across teams, and drive business growth.",
                "match_rate": 85
            },
            {
                "title": f"Lead {target_role or 'Software Engineer'}",
                "company": "Quantum Leap Technologies",
                "location": "New York, NY (On-site)",
                "salary": "$150,000 - $180,000",
                "description": f"Lead our tech stack optimization and system architecture. Experience with {keywords[0] if keywords else 'industry best practices'} is highly preferred.",
                "match_rate": 78
            }
        ]

        if not self.client:
            return fallback_jobs

        prompt = f"""You are an ATS job matcher. Based on the target role "{target_role}" and matching keywords: {keywords[:8]}, generate a list of exactly 3 realistic, current job vacancies.
Return ONLY a valid JSON array of objects. Do not include markdown code block syntax (like ```json). Each object must have these exact keys:
- "title": Job title (string)
- "company": Company name (string)
- "location": Job location (string)
- "salary": Salary range (string)
- "description": 1-2 sentence description of the role (string)
- "match_rate": A numeric match percentage between 50 and 99 (integer)
"""
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional system that only outputs raw JSON. Do not return conversational text.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
            )
            content = response.choices[0].message.content.strip()
            if content.startswith("```"):
                lines = content.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                content = "\n".join(lines).strip()
            
            jobs = json.loads(content)
            if isinstance(jobs, list) and len(jobs) > 0:
                cleaned_jobs = []
                for item in jobs[:3]:
                    cleaned_jobs.append({
                        "title": str(item.get("title", f"Role in {target_role}")),
                        "company": str(item.get("company", "Tech Enterprise")),
                        "location": str(item.get("location", "Remote")),
                        "salary": str(item.get("salary", "Competitive")),
                        "description": str(item.get("description", "A matching role for your background.")),
                        "match_rate": int(item.get("match_rate", 80))
                    })
                return cleaned_jobs
        except Exception:
            pass
        
        return fallback_jobs

    async def match_resume_to_jd(self, resume_text: str, jd_text: str, target_role: str) -> dict | None:
        if not self.client:
            return None

        import json

        prompt = f"""You are an ATS Match Engine. Compare the candidate's Resume Text against the Job Description Text.
Extract the exact professional and technical skills (programming languages, libraries, tools, frameworks) requested in the Job Description. 
DO NOT extract generic dictionary words (such as 'looking', 'owns', 'are', 'ideal', 'candidate', 'experience', 'senior', 'about', 'for', 'with'). Only extract real skills/competencies.

Determine:
1. "matched_keywords": Skills requested in the Job Description that ARE present in the Resume Text.
2. "missing_keywords": Skills requested in the Job Description that ARE NOT present in the Resume Text.
3. "match_percentage": A numeric percentage score between 35 and 99 reflecting how well the resume matches the job requirements.
4. "summary": A 2-3 sentence professional summary explaining the match alignment.
5. "suggestions": A list of exactly 3 actionable recommendations to improve the resume for this job description.

Return ONLY a valid JSON object with the following keys:
- "matched_keywords": list of strings
- "missing_keywords": list of strings
- "match_percentage": integer
- "summary": string
- "suggestions": list of strings

Resume Text:
{resume_text[:4000]}

Job Description Text:
{jd_text[:4000]}
"""
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional system that only outputs raw JSON. Do not return conversational text.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
            )
            content = response.choices[0].message.content.strip()
            if content.startswith("```"):
                lines = content.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                content = "\n".join(lines).strip()
            
            data = json.loads(content)
            if isinstance(data, dict) and "matched_keywords" in data and "missing_keywords" in data:
                def clean_keyword_list(kw_list):
                    generic_words = {"are", "owns", "ideal", "candidate", "looking", "experience", "senior", "product", "engineer", "owns", "about", "for", "with", "work", "role"}
                    return [k.strip().upper() for k in kw_list if k.strip().lower() not in generic_words]

                data["matched_keywords"] = clean_keyword_list(data.get("matched_keywords", []))
                data["missing_keywords"] = clean_keyword_list(data.get("missing_keywords", []))
                data["match_percentage"] = int(data.get("match_percentage", 65))
                data["summary"] = str(data.get("summary", "Resume matched against target job requirements."))
                data["suggestions"] = [str(s) for s in data.get("suggestions", [])[:3]]
                return data
        except Exception:
            pass
        
    async def generate_job_description(self, target_role: str) -> str:
        if not self.client:
            return f"We are looking for a skilled {target_role} with experience in design, development, and team collaboration. The ideal candidate owns deployment, reliability, and modern software engineering practices."

        prompt = f"Generate a realistic, ATS-friendly, professional job description for the target role: \"{target_role}\". Include key responsibilities, required skills (programming languages, libraries, databases), and certifications/education if appropriate. Keep it concise, around 100-150 words. Do not use generic filler text."
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert technical recruiter. Write a clear, concise, and realistic job description. Return ONLY the job description text with no introductory or concluding remarks.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
            )
            return response.choices[0].message.content.strip()
        except Exception:
            return f"We are looking for a skilled {target_role} with experience in design, development, and team collaboration. The ideal candidate owns deployment, reliability, and modern software engineering practices."


openai_service = OpenAIService()


