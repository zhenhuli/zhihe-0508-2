const API_URL = 'http://localhost:8000/api/analyze';
const SENSITIVE_WORDS_API = 'http://localhost:8000/api/sensitive-words';

let currentResult = null;
let currentText = null;
let charTypeChart = null;
let wordFrequencyChart = null;
let sensitiveWordData = null;

class TextAnalyzer {
    constructor() {
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.textInput = document.getElementById('textInput');
        this.customSensitiveWords = document.getElementById('customSensitiveWords');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.resultSection = document.getElementById('resultSection');
        this.rightSection = document.getElementById('rightSection');
        this.loading = document.getElementById('loading');
        this.wordCountSelect = document.getElementById('wordCountSelect');
        this.highlightedText = document.getElementById('highlightedText');
        this.highlightLegend = document.getElementById('highlightLegend');

        this.sensitiveWordModal = document.getElementById('sensitiveWordModal');
        this.showSensitiveListBtn = document.getElementById('showSensitiveListBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.closeModalBtn2 = document.getElementById('closeModalBtn2');
        this.searchSensitiveWords = document.getElementById('searchSensitiveWords');
        this.modalContent = document.getElementById('modalContent');
    }

    bindEvents() {
        this.analyzeBtn.addEventListener('click', () => this.analyzeText());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.wordCountSelect.addEventListener('change', () => this.updateWordFrequencyChart());

        this.textInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.analyzeText();
            }
        });

        this.showSensitiveListBtn.addEventListener('click', () => this.openSensitiveWordModal());
        this.closeModalBtn.addEventListener('click', () => this.closeSensitiveWordModal());
        this.closeModalBtn2.addEventListener('click', () => this.closeSensitiveWordModal());
        this.searchSensitiveWords.addEventListener('input', (e) => this.filterSensitiveWords(e.target.value));

        this.sensitiveWordModal.addEventListener('click', (e) => {
            if (e.target === this.sensitiveWordModal) {
                this.closeSensitiveWordModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.sensitiveWordModal.classList.contains('hidden')) {
                this.closeSensitiveWordModal();
            }
        });
    }

    showLoading(show) {
        this.loading.classList.toggle('hidden', !show);
    }

    showResults(show) {
        this.resultSection.classList.toggle('hidden', !show);
        this.rightSection.classList.toggle('hidden', !show);
    }

    async analyzeText() {
        const text = this.textInput.value;
        if (!text || !text.trim()) {
            alert('请输入要分析的文本内容');
            return;
        }

        currentText = text;

        const customWords = this.customSensitiveWords.value
            .split(',')
            .map(w => w.trim())
            .filter(w => w);

        this.showLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    custom_sensitive_words: customWords
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || '分析失败');
            }

            currentResult = await response.json();
            this.renderResults(currentResult, currentText);
            this.showResults(true);

        } catch (error) {
            console.error('Analysis error:', error);
            alert('分析失败: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    renderResults(result, text) {
        this.renderHighlightedText(text, result);
        this.renderOverview(result);
        this.renderCharacterStats(result);
        this.renderWordFrequencies(result);
        this.renderSensitiveWords(result);
    }

    renderHighlightedText(text, result) {
        const legend = document.getElementById('highlightLegend');

        if (!result.has_sensitive) {
            this.highlightedText.textContent = text;
            legend.classList.add('hidden');
            return;
        }

        const matches = result.sensitive_matches;
        let allPositions = [];

        matches.forEach(match => {
            const word = match.word;
            match.positions.forEach(pos => {
                allPositions.push({
                    start: pos,
                    end: pos + word.length,
                    word: word
                });
            });
        });

        allPositions.sort((a, b) => a.start - b.start);

        let merged = [];
        for (let i = 0; i < allPositions.length; i++) {
            const current = allPositions[i];
            if (merged.length === 0) {
                merged.push(current);
                continue;
            }
            const last = merged[merged.length - 1];
            if (current.start <= last.end) {
                last.end = Math.max(last.end, current.end);
            } else {
                merged.push(current);
            }
        }

        let html = '';
        let lastEnd = 0;

        merged.forEach((segment, index) => {
            if (segment.start > lastEnd) {
                html += this.escapeHtml(text.substring(lastEnd, segment.start));
            }
            const matchedText = text.substring(segment.start, segment.end);
            html += `<mark class="bg-yellow-200 border border-yellow-400 rounded px-0.5 text-red-700 font-medium" title="敏感词">${this.escapeHtml(matchedText)}</mark>`;
            lastEnd = segment.end;
        });

        if (lastEnd < text.length) {
            html += this.escapeHtml(text.substring(lastEnd));
        }

        this.highlightedText.innerHTML = html;
        legend.classList.remove('hidden');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    renderOverview(result) {
        document.getElementById('statWords').textContent = result.word_count;
        document.getElementById('statSentences').textContent = result.sentence_count;
        document.getElementById('statParagraphs').textContent = result.paragraph_count;
        document.getElementById('statChars').textContent = result.character_stats.total_chars;
    }

    renderCharacterStats(result) {
        const stats = result.character_stats;
        const total = stats.total_chars;

        const items = [
            { id: 'Chinese', value: stats.chinese_chars, color: 'bg-red-500' },
            { id: 'English', value: stats.english_chars, color: 'bg-blue-500' },
            { id: 'Numbers', value: stats.numbers, color: 'bg-green-500' },
            { id: 'Spaces', value: stats.spaces, color: 'bg-yellow-500' },
            { id: 'Punctuation', value: stats.punctuation, color: 'bg-purple-500' },
            { id: 'Other', value: stats.other_chars, color: 'bg-gray-500' }
        ];

        items.forEach(item => {
            document.getElementById('stat' + item.id).textContent = item.value;
            const percentage = total > 0 ? (item.value / total * 100).toFixed(1) : 0;
            document.getElementById('bar' + item.id).style.width = percentage + '%';
        });

        this.renderCharTypeChart(stats, total);
    }

    renderCharTypeChart(stats, total) {
        const ctx = document.getElementById('charTypeChart').getContext('2d');

        if (charTypeChart) {
            charTypeChart.destroy();
        }

        charTypeChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['中文', '英文', '数字', '空格', '标点', '其他'],
                datasets: [{
                    data: [
                        stats.chinese_chars,
                        stats.english_chars,
                        stats.numbers,
                        stats.spaces,
                        stats.punctuation,
                        stats.other_chars
                    ],
                    backgroundColor: [
                        '#ef4444',
                        '#3b82f6',
                        '#22c55e',
                        '#eab308',
                        '#a855f7',
                        '#6b7280'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    renderWordFrequencies(result) {
        this.renderWordList(result);
        this.renderWordFrequencyChart(result);
    }

    renderWordList(result) {
        const container = document.getElementById('wordList');
        const words = result.word_frequencies.slice(0, 20);

        container.innerHTML = words.map((item, index) => {
            const percentage = (item.frequency * 100).toFixed(2);
            return `
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span class="w-7 h-7 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                        ${index + 1}
                    </span>
                    <div class="flex-1">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-medium text-gray-800">"${item.word}"</span>
                            <span class="text-sm text-gray-500">${item.count} 次</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-1.5">
                            <div class="bg-primary-500 h-1.5 rounded-full" style="width: ${Math.min(percentage * 5, 100)}%"></div>
                        </div>
                    </div>
                    <span class="text-sm text-gray-400">${percentage}%</span>
                </div>
            `;
        }).join('');
    }

    renderWordFrequencyChart(result) {
        const count = parseInt(this.wordCountSelect.value);
        const words = result.word_frequencies.slice(0, count);
        
        const ctx = document.getElementById('wordFrequencyChart').getContext('2d');

        if (wordFrequencyChart) {
            wordFrequencyChart.destroy();
        }

        const colors = this.generateColors(words.length);

        wordFrequencyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: words.map(w => w.word),
                datasets: [{
                    label: '出现次数',
                    data: words.map(w => w.count),
                    backgroundColor: colors,
                    borderColor: colors.map(c => this.darkenColor(c, 20)),
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const word = words[context.dataIndex];
                                const percentage = (word.frequency * 100).toFixed(2);
                                return `出现 ${word.count} 次 (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    updateWordFrequencyChart() {
        if (currentResult) {
            this.renderWordFrequencyChart(currentResult);
        }
    }

    generateColors(count) {
        const baseColors = [
            '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7',
            '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
            '#14b8a6', '#eab308', '#8b5cf6', '#10b981', '#f43f5e',
            '#0ea5e9', '#84cc16', '#d946ef', '#f59e0b', '#22d3ee',
            '#4ade80', '#facc15', '#a78bfa', '#fb923c', '#f87171'
        ];
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(baseColors[i % baseColors.length]);
        }
        return colors;
    }

    darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }

    renderSensitiveWords(result) {
        const statusEl = document.getElementById('sensitiveStatus');
        const resultEl = document.getElementById('sensitiveResult');

        if (result.has_sensitive) {
            statusEl.textContent = '检测到敏感词';
            statusEl.className = 'px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700';

            const matches = result.sensitive_matches;
            resultEl.innerHTML = `
                <div class="mb-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p class="text-red-700 font-medium">
                        ⚠️ 检测到 <span class="font-bold">${matches.length}</span> 个敏感词，共出现 <span class="font-bold">${matches.reduce((sum, m) => sum + m.count, 0)}</span> 次
                    </p>
                </div>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                    ${matches.map(m => `
                        <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                            <div>
                                <span class="font-medium text-red-700">"${m.word}"</span>
                                <span class="text-sm text-red-500 ml-2">出现 ${m.count} 次</span>
                            </div>
                            <div class="text-xs text-gray-500">
                                位置: ${m.positions.slice(0, 5).join(', ')}${m.positions.length > 5 ? '...' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            statusEl.textContent = '未检测到敏感词';
            statusEl.className = 'px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700';

            resultEl.innerHTML = `
                <div class="p-6 bg-green-50 rounded-lg text-center">
                    <div class="text-4xl mb-3">✅</div>
                    <p class="text-green-700 font-medium">文本内容安全，未检测到敏感词</p>
                </div>
            `;
        }
    }

    clearAll() {
        this.textInput.value = '';
        this.customSensitiveWords.value = '';
        this.showResults(false);
        currentResult = null;
        currentText = null;

        if (this.highlightedText) {
            this.highlightedText.innerHTML = '';
        }

        if (charTypeChart) {
            charTypeChart.destroy();
            charTypeChart = null;
        }
        if (wordFrequencyChart) {
            wordFrequencyChart.destroy();
            wordFrequencyChart = null;
        }
    }

    async openSensitiveWordModal() {
        this.sensitiveWordModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        this.modalContent.innerHTML = `
            <div class="flex items-center justify-center h-32">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
            </div>
        `;

        if (!sensitiveWordData) {
            try {
                const response = await fetch(SENSITIVE_WORDS_API);
                if (!response.ok) {
                    throw new Error('获取敏感词库失败');
                }
                sensitiveWordData = await response.json();
            } catch (error) {
                console.error('Error fetching sensitive words:', error);
                this.modalContent.innerHTML = `
                    <div class="text-center py-12">
                        <div class="text-4xl mb-3">❌</div>
                        <p class="text-red-600 font-medium">获取敏感词库失败</p>
                        <p class="text-gray-500 text-sm mt-2">${error.message}</p>
                    </div>
                `;
                return;
            }
        }

        this.updateModalStats();
        this.renderSensitiveWords(sensitiveWordData);
    }

    closeSensitiveWordModal() {
        this.sensitiveWordModal.classList.add('hidden');
        document.body.style.overflow = '';
        this.searchSensitiveWords.value = '';
    }

    updateModalStats() {
        if (!sensitiveWordData) return;

        let totalWords = 0;
        sensitiveWordData.forEach(cat => {
            totalWords += cat.words.length;
        });

        document.getElementById('totalWordCount').textContent = totalWords;
        document.getElementById('categoryCount').textContent = sensitiveWordData.length;
    }

    renderSensitiveWords(data) {
        if (!data || data.length === 0) {
            this.modalContent.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-4xl mb-3">📭</div>
                    <p class="text-gray-600 font-medium">未找到匹配的敏感词</p>
                </div>
            `;
            return;
        }

        const categoryColors = [
            'bg-red-50 border-red-200 text-red-700',
            'bg-orange-50 border-orange-200 text-orange-700',
            'bg-yellow-50 border-yellow-200 text-yellow-700',
            'bg-green-50 border-green-200 text-green-700',
            'bg-blue-50 border-blue-200 text-blue-700',
            'bg-purple-50 border-purple-200 text-purple-700',
            'bg-pink-50 border-pink-200 text-pink-700',
        ];

        let html = '';
        data.forEach((category, index) => {
            const colorClass = categoryColors[index % categoryColors.length];
            html += `
                <div class="mb-6 last:mb-0">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="px-3 py-1 rounded-full text-sm font-medium border ${colorClass}">
                            ${category.category}
                        </span>
                        <span class="text-xs text-gray-500">(${category.words.length} 个)</span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        ${category.words.map(word => `
                            <button 
                                class="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all cursor-pointer group"
                                onclick="textAnalyzer.addToCustomWords('${this.escapeHtml(word)}')"
                                title="点击添加到自定义敏感词"
                            >
                                ${this.escapeHtml(word)}
                                <span class="ml-1 text-gray-300 group-hover:text-primary-400">+</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        this.modalContent.innerHTML = html;
    }

    filterSensitiveWords(query) {
        if (!sensitiveWordData) return;

        const searchQuery = query.trim().toLowerCase();

        if (!searchQuery) {
            this.renderSensitiveWords(sensitiveWordData);
            return;
        }

        const filteredData = sensitiveWordData.map(category => ({
            category: category.category,
            words: category.words.filter(word => 
                word.toLowerCase().includes(searchQuery)
            )
        })).filter(category => category.words.length > 0);

        this.renderSensitiveWords(filteredData);
    }

    addToCustomWords(word) {
        const currentValue = this.customSensitiveWords.value.trim();
        const words = currentValue 
            ? currentValue.split(',').map(w => w.trim()).filter(w => w)
            : [];

        if (words.includes(word)) {
            alert(`"${word}" 已在自定义敏感词列表中`);
            return;
        }

        words.push(word);
        this.customSensitiveWords.value = words.join(', ');
        
        this.customSensitiveWords.classList.add('ring-2', 'ring-primary-500', 'ring-opacity-50');
        setTimeout(() => {
            this.customSensitiveWords.classList.remove('ring-2', 'ring-primary-500', 'ring-opacity-50');
        }, 1000);

        console.log(`Added "${word}" to custom sensitive words`);
    }
}

let textAnalyzer = null;

document.addEventListener('DOMContentLoaded', () => {
    textAnalyzer = new TextAnalyzer();
    console.log('Text Analyzer initialized');
});
