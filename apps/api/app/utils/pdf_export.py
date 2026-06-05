import base64
from io import BytesIO

from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas

from app.schemas.analysis import AnalysisResponse


def export_analysis_pdf(analysis: AnalysisResponse) -> tuple[str, str]:
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=LETTER)
    y = 760

    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, "AI Resume Analyzer Report")
    y -= 30

    pdf.setFont("Helvetica", 11)
    lines = [
        f"ATS Score: {analysis.ats_score}",
        f"Role Match: {analysis.role_match}",
        f"Summary: {analysis.summary}",
        "Suggestions:",
        *[f"- {item}" for item in analysis.suggestions],
        "Missing Keywords:",
        *[f"- {item}" for item in analysis.missing_keywords],
        "Skill Gap:",
        *[f"- {item}" for item in analysis.skill_gap],
    ]

    for line in lines:
        if y < 60:
            pdf.showPage()
            pdf.setFont("Helvetica", 11)
            y = 760
        pdf.drawString(50, y, line[:110])
        y -= 18

    pdf.save()
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"analysis-{analysis.id}.pdf", encoded
