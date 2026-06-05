from pathlib import Path

import fitz
import pdfplumber
from docx import Document


class UnsupportedFileTypeError(ValueError):
    pass


def extract_text_from_resume(file_path: Path) -> str:
    suffix = file_path.suffix.lower()
    if suffix == ".pdf":
        extracted_text = []
        with pdfplumber.open(str(file_path)) as document:
            for page in document.pages:
                extracted_text.append(page.extract_text() or "")
        text = "\n".join(extracted_text).strip()
        if text:
            return text

        document = fitz.open(str(file_path))
        return "\n".join(page.get_text().strip() for page in document).strip()
    if suffix == ".docx":
        document = Document(str(file_path))
        return "\n".join(p.text for p in document.paragraphs).strip()
    raise UnsupportedFileTypeError("Only PDF and DOCX files are supported")
