from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Tuple
import re
from collections import Counter
from sensitive_words import get_all_sensitive_words, get_sensitive_words_by_category

app = FastAPI(title="文本分析 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextRequest(BaseModel):
    text: str
    custom_sensitive_words: List[str] = []


class CharacterStats(BaseModel):
    total_chars: int
    chinese_chars: int
    english_chars: int
    numbers: int
    spaces: int
    punctuation: int
    other_chars: int


class WordFrequency(BaseModel):
    word: str
    count: int
    frequency: float


class SensitiveMatch(BaseModel):
    word: str
    positions: List[int]
    count: int


class AnalysisResult(BaseModel):
    character_stats: CharacterStats
    word_count: int
    sentence_count: int
    paragraph_count: int
    word_frequencies: List[WordFrequency]
    sensitive_matches: List[SensitiveMatch]
    has_sensitive: bool


class SensitiveWordCategory(BaseModel):
    category: str
    words: List[str]


def count_characters(text: str) -> CharacterStats:
    total = len(text)
    chinese = len(re.findall(r'[\u4e00-\u9fff]', text))
    english = len(re.findall(r'[a-zA-Z]', text))
    numbers = len(re.findall(r'[0-9]', text))
    spaces = len(re.findall(r'\s', text))
    punctuation = len(re.findall(r'[^\u4e00-\u9fff\sa-zA-Z0-9]', text))
    other = total - chinese - english - numbers - spaces - punctuation

    return CharacterStats(
        total_chars=total,
        chinese_chars=chinese,
        english_chars=english,
        numbers=numbers,
        spaces=spaces,
        punctuation=punctuation,
        other_chars=other
    )


def count_words(text: str) -> Tuple[int, List[Tuple[str, int]]]:
    chinese_text = ''.join(re.findall(r'[\u4e00-\u9fff]', text))
    english_text = ' '.join(re.findall(r'[a-zA-Z]+', text.lower()))

    word_list = []

    if chinese_text:
        for char in chinese_text:
            word_list.append(char)

    if english_text:
        word_list.extend(english_text.split())

    word_count = len(word_list)
    word_counter = Counter(word_list)
    sorted_words = sorted(word_counter.items(), key=lambda x: (-x[1], x[0]))

    return word_count, sorted_words


def count_sentences(text: str) -> int:
    sentences = re.split(r'[。！？.!?]+', text)
    sentences = [s for s in sentences if s.strip()]
    return len(sentences)


def count_paragraphs(text: str) -> int:
    paragraphs = re.split(r'\n\s*\n', text)
    paragraphs = [p for p in paragraphs if p.strip()]
    return max(1, len(paragraphs)) if text else 0


def find_sensitive_words(text: str, custom_words: List[str] = None) -> Tuple[List[SensitiveMatch], bool]:
    all_sensitive = set(get_all_sensitive_words())
    if custom_words:
        all_sensitive.update([w.strip() for w in custom_words if w.strip()])

    matches: Dict[str, List[int]] = {}

    for word in all_sensitive:
        if not word:
            continue

        positions = []
        start = 0
        text_lower = text.lower()
        word_lower = word.lower()

        while True:
            idx = text_lower.find(word_lower, start)
            if idx == -1:
                break
            positions.append(idx)
            start = idx + 1

        if positions:
            matches[word] = positions

    sensitive_matches = [
        SensitiveMatch(word=word, positions=positions, count=len(positions))
        for word, positions in sorted(matches.items(), key=lambda x: (-len(x[1]), x[0]))
    ]

    return sensitive_matches, len(sensitive_matches) > 0


@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze_text(request: TextRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="文本内容不能为空")

    text = request.text

    char_stats = count_characters(text)
    word_count, word_freq_list = count_words(text)
    sentence_count = count_sentences(text)
    paragraph_count = count_paragraphs(text)

    total_word_count = max(1, word_count)
    word_frequencies = [
        WordFrequency(
            word=word,
            count=count,
            frequency=round(count / total_word_count, 6)
        )
        for word, count in word_freq_list[:50]
    ]

    sensitive_matches, has_sensitive = find_sensitive_words(
        text,
        request.custom_sensitive_words
    )

    return AnalysisResult(
        character_stats=char_stats,
        word_count=word_count,
        sentence_count=sentence_count,
        paragraph_count=paragraph_count,
        word_frequencies=word_frequencies,
        sensitive_matches=sensitive_matches,
        has_sensitive=has_sensitive
    )


@app.get("/api/sensitive-words", response_model=List[SensitiveWordCategory])
async def get_sensitive_words_list():
    categories = get_sensitive_words_by_category()
    return [
        SensitiveWordCategory(category=cat, words=words)
        for cat, words in categories.items()
    ]


@app.get("/")
async def root():
    return {"message": "文本分析 API", "status": "running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
