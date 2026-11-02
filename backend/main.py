
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# --------------------------------------------------
# Configuration
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

PROFILE_PATH = BASE_DIR / "profile.json"

app = FastAPI(
    title="Gowtham Portfolio API",
    description="Local portfolio assistant API",
    version="4.0.0",
)


# --------------------------------------------------
# CORS Configuration
# --------------------------------------------------

default_origins = (
    "http://localhost:5173,"
    "http://127.0.0.1:5173,"
    "http://localhost:5174,"
    "http://127.0.0.1:5174"
)

origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        default_origins
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


# --------------------------------------------------
# Load Portfolio Profile
# --------------------------------------------------

def load_profile() -> dict:
    try:
        return json.loads(
            PROFILE_PATH.read_text(encoding="utf-8")
        )
    except (OSError, json.JSONDecodeError) as exc:
        raise HTTPException(
            status_code=500,
            detail="Portfolio profile could not be loaded."
        ) from exc


# --------------------------------------------------
# Request and Response Models
# --------------------------------------------------

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=2000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    history: list[ChatMessage] = Field(
        default_factory=list,
        max_length=12
    )


class ChatResponse(BaseModel):
    answer: str


# --------------------------------------------------
# Helper Functions
# --------------------------------------------------

def has_any(text: str, words: tuple[str, ...]) -> bool:
    return any(word in text for word in words)


def get_list(data: dict, key: str) -> list:
    value = data.get(key, [])
    return value if isinstance(value, list) else []


def bullet_list(items: list) -> str:
    if not items:
        return "• Information not listed."

    return "\n".join(f"• {item}" for item in items)


def format_experience(experience: list) -> str:
    if not experience:
        return (
            "**Professional Experience**\n\n"
            "Work experience is not currently listed "
            "in the portfolio."
        )

    answers = []

    for item in experience:
        answers.append(
            f"**{item.get('role', 'Role not specified')}**\n\n"
            f"**Organization:** "
            f"{item.get('organization', 'Not specified')}\n\n"
            f"**Duration:** "
            f"{item.get('period', 'Not specified')}\n\n"
            f"**Responsibilities:**\n"
            f"{item.get('description', 'Not specified')}"
        )

    return (
        "**Professional Experience**\n\n"
        + "\n\n".join(answers)
    )


def format_projects(projects: list) -> str:
    if not projects:
        return "No projects are currently listed in the portfolio."

    answers = []

    for project in projects:
        stack = get_list(project, "stack")
        features = get_list(project, "features")

        answer = (
            f"**{project.get('name', 'Project')}**\n\n"
            f"**Type:** {project.get('type', 'Project')}\n\n"
            f"**Description:** "
            f"{project.get('description', 'Not specified')}\n\n"
            f"**Technology Stack:**\n"
            f"{bullet_list(stack)}"
        )

        if features:
            answer += (
                "\n\n**Key Features:**\n"
                f"{bullet_list(features)}"
            )

        answers.append(answer)

    return "**Projects**\n\n" + "\n\n".join(answers)


# --------------------------------------------------
# Local Answer Generator
# No External AI API Required
# --------------------------------------------------

def generate_local_answer(message: str, profile: dict) -> str:

    q = " ".join(message.lower().strip().split())

    name = profile.get("name", "Gowtham")
    headline = profile.get("headline", "Full Stack Developer")
    summary = profile.get("summary", "")

    skills = profile.get("skills", {})
    education = profile.get("education", {})
    experience = profile.get("experience", [])
    projects = profile.get("projects", [])
    availability = profile.get("availability", "")

    contact = profile.get("contact", {})
    links = profile.get("links", {})

    email = contact.get("email") or links.get("email", "")
    phone = contact.get("phone", "")
    location = contact.get("location") or profile.get("location", "")
    linkedin = contact.get("linkedin") or links.get("linkedin", "")

    # --------------------------------------------------
    # 1. Resume Download
    # --------------------------------------------------

    if has_any(q, (
        "resume", "cv", "curriculum vitae",
        "download my resume", "download resume",
        "share resume", "send resume"
    )):
        return (
            "You can download Gowtham's resume using the link below:\n\n"
            "[Download Resume](https://gowtham-portfolio-swart.vercel.app/Gowtham_GB_Resume.pdf)\n\n"
            "The resume includes his education, technical skills, "
            "professional experience and projects."
        )

    # --------------------------------------------------
    # 2. Internship Opportunities He Is Looking For
    # Keep this BEFORE general internship experience.
    # --------------------------------------------------

    if has_any(q, (
        "what internship is he looking for",
        "what internship is gowtham looking for",
        "what kind of internship",
        "which internship",
        "internship opportunities",
        "looking for internship",
        "looking for an internship",
        "internship he is looking for",
        "internship is he looking",
        "what role is he looking for",
        "which role is he looking for",
        "what job is he looking for",
        "career opportunities",
        "internship preference"
    )):
        return (
            "**Internship Opportunities**\n\n"
            "Gowtham is currently looking for Software Development "
            "Internship opportunities, particularly in **Full Stack "
            "Development** and **Backend Development**.\n\n"
            "**Preferred Technologies:**\n"
            "• React.js\n"
            "• Node.js and Express.js\n"
            "• MySQL\n"
            "• Python and FastAPI (currently learning)\n\n"
            "He is interested in working on real-world projects, "
            "contributing to development teams, improving his technical "
            "skills and gaining practical industry experience. "
            "He is also interested in opportunities that may lead "
            "to a full-time position."
        )

    # --------------------------------------------------
    # 3. Professional Experience / Internship Experience
    # --------------------------------------------------

    if has_any(q, (
        "professional experience",
        "internship experience",
        "internship details",
        "tell me about his internship",
        "tell me about the internship",
        "work experience",
        "where has he worked",
        "which company has he worked",
        "muthu soft labs",
        "responsibilities",
        "what has he done at his internship",
        "previous experience",
        "employment history",
        "designation",
        "job role"
    )):
        return format_experience(experience)

    # A general question about "internship" defaults to experience.
    if q in ("internship", "intern", "his internship"):
        return format_experience(experience)

    # --------------------------------------------------
    # 4. Contact Information
    # --------------------------------------------------

    if has_any(q, (
        "contact", "email", "e-mail", "mail id",
        "phone", "mobile", "telephone", "phone number",
        "linkedin", "connect", "reach him",
        "reach gowtham", "professional profile"
    )):
        details = ["**Gowtham G B - Contact Information**"]

        if email:
            details.append(
                f"- **Email:** [{email}](mailto:{email})"
            )

        if phone:
            details.append(
                f"- **Phone:** [{phone}](tel:{phone})"
            )

        if linkedin:
            details.append(
                f"- **LinkedIn:** [View LinkedIn Profile]({linkedin})"
            )

        if location:
            details.append(f"- **Location:** {location}")

        details.append(
            "\nRecruiters can contact Gowtham through email or LinkedIn."
        )

        return "\n".join(details)

    # --------------------------------------------------
    # 5. Introduction
    # --------------------------------------------------

    if has_any(q, (
        "tell me about", "about gowtham", "who is gowtham",
        "introduce", "self introduction", "profile summary",
        "brief introduction", "describe gowtham"
    )):
        return (
            f"**{name}**\n\n"
            f"{headline} based in {location}. {summary}"
        )

    # --------------------------------------------------
    # 6. Education
    # --------------------------------------------------

    if has_any(q, (
        "education", "college", "university", "degree",
        "studying", "study", "qualification", "course",
        "academic background", "graduation"
    )):
        return (
            f"**Education**\n\n"
            f"{name} is {education.get('status', 'a student')} "
            f"pursuing {education.get('degree', 'a degree')} "
            f"at {education.get('institution', 'the listed institution')}.\n\n"
            f"**Expected Course Completion:** "
            f"{education.get('expected_course_end', 'Not specified')}."
        )

    # --------------------------------------------------
    # 7. Specific Project: BookOrder
    # --------------------------------------------------

    if has_any(q, ("bookorder", "book ordering", "book order")):
        for project in projects:
            if "bookorder" in project.get("name", "").lower():
                stack = get_list(project, "stack")
                features = get_list(project, "features")

                return (
                    f"**{project.get('name', 'BookOrder')}**\n\n"
                    f"{project.get('description', '')}\n\n"
                    f"**Technology Stack:**\n{bullet_list(stack)}\n\n"
                    f"**Key Features:**\n{bullet_list(features)}"
                )

    # --------------------------------------------------
    # 8. Specific Project: Academic Assistant
    # --------------------------------------------------

    if has_any(q, (
        "academic assistant", "student assistant",
        "focus monitoring", "esp32", "mediapipe",
        "opencv", "buzzer"
    )):
        for project in projects:
            if "academic" in project.get("name", "").lower():
                stack = get_list(project, "stack")
                features = get_list(project, "features")

                return (
                    f"**{project.get('name')}**\n\n"
                    f"{project.get('description', '')}\n\n"
                    f"**Technology Stack:**\n{bullet_list(stack)}\n\n"
                    f"**Key Features:**\n{bullet_list(features)}"
                )

    # --------------------------------------------------
    # 9. General Projects
    # --------------------------------------------------

    if has_any(q, (
        "projects", "project", "built", "developed",
        "applications", "portfolio work"
    )):
        return format_projects(projects)

    # --------------------------------------------------
    # 10. Frontend Skills
    # --------------------------------------------------

    if has_any(q, (
        "frontend", "front end", "ui skills",
        "react", "javascript", "html", "css",
        "tailwind", "vite"
    )):
        return (
            "**Frontend Skills:**\n"
            + bullet_list(get_list(skills, "frontend"))
        )

    # --------------------------------------------------
    # 11. Backend Skills
    # --------------------------------------------------

    if has_any(q, (
        "backend", "back end", "server side",
        "node", "express", "fastapi", "python",
        "api", "jwt"
    )):
        return (
            "**Backend Skills:**\n"
            + bullet_list(get_list(skills, "backend"))
            + "\n\nPython and FastAPI are currently learning skills."
        )

    # --------------------------------------------------
    # 12. Database Skills
    # --------------------------------------------------

    if has_any(q, (
        "database", "databases", "mysql", "sql",
        "data storage"
    )):
        return (
            "**Database Skills:**\n"
            + bullet_list(get_list(skills, "database"))
        )

    # --------------------------------------------------
    # 13. Overall Technical Skills / Tech Stack
    # --------------------------------------------------

    if has_any(q, (
        "skills", "skill set", "tech stack",
        "technology stack", "technologies",
        "technical knowledge", "technical skills",
        "programming languages"
    )):
        return (
            "**Technical Skills**\n\n"
            "**Frontend:**\n"
            + bullet_list(get_list(skills, "frontend"))
            + "\n\n**Backend:**\n"
            + bullet_list(get_list(skills, "backend"))
            + "\n\n**Databases:**\n"
            + bullet_list(get_list(skills, "database"))
            + "\n\n**Tools:**\n"
            + bullet_list(get_list(skills, "tools"))
            + "\n\nPython and FastAPI are currently learning skills."
        )

    # --------------------------------------------------
    # 14. Availability
    # --------------------------------------------------

    if has_any(q, (
        "availability", "available for work",
        "is he available", "job search",
        "open to work", "is he open to work",
        "is he currently available"
    )):
        return (
            availability
            or "Gowtham is interested in software development "
               "internship opportunities."
        )

    # --------------------------------------------------
    # 15. Location
    # --------------------------------------------------

    if has_any(q, (
        "location", "located", "based",
        "which city", "where is he",
        "where does he live"
    )):
        return f"{name} is based in {location}."

    # --------------------------------------------------
    # 16. Greeting
    # --------------------------------------------------

    if q in (
        "hi", "hello", "hey", "good morning",
        "good afternoon", "good evening"
    ):
        return (
            f"Hello! I'm {name}'s Portfolio Assistant. "
            "I can help you explore his education, technical skills, "
            "professional experience, projects, resume and contact details."
        )

    # --------------------------------------------------
    # 17. Unknown Question
    # --------------------------------------------------

    return (
        "I can help you with information about Gowtham's:\n\n"
        "• Professional introduction\n"
        "• Education\n"
        "• Technical skills and tech stack\n"
        "• Internship experience\n"
        "• Internship opportunities he is looking for\n"
        "• Projects\n"
        "• Resume and contact information\n\n"
        "Please ask me about one of these topics."
    )


# --------------------------------------------------
# API Endpoints
# --------------------------------------------------

@app.get("/")
async def root():
    return {
        "message": "Gowtham Portfolio API",
        "status": "running",
        "chat_mode": "local",
        "version": "4.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "chat_mode": "local"
    }


@app.get("/api/profile")
async def profile():
    return load_profile()


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    profile_data = load_profile()

    answer = generate_local_answer(
        request.message,
        profile_data
    )

    return ChatResponse(answer=answer)
