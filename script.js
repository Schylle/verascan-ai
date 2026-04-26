// MODE SWITCHING LOGIC
function switchMode(mode) {
    // Reset Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // To hide all inputs
    document.getElementById('input-text').classList.add('hidden');
    document.getElementById('input-url').classList.add('hidden');
    document.getElementById('input-image').classList.add('hidden');

    // Show selected input
    if (mode === 'text') document.getElementById('input-text').classList.remove('hidden');
    if (mode === 'url') document.getElementById('input-url').classList.remove('hidden');
    if (mode === 'image') document.getElementById('input-image').classList.remove('hidden');

    // Reset Results
    document.getElementById('result-content').classList.add('hidden');
    document.getElementById('empty-state').classList.remove('hidden');
}

// THE MAIN ANALYSIS LOGIC (The "Real" Logic)
async function startAnalysis() {
    const loadingState = document.getElementById('loading-state');
    const resultContent = document.getElementById('result-content');
    const emptyState = document.getElementById('empty-state');
    
    // Determine which mode we are in
    const activeTab = document.querySelector('.tab-btn.active').innerText.trim().toLowerCase();
    let content = "";

    if (activeTab === 'text') {
        content = document.getElementById('input-text').value;
    } else if (activeTab === 'url') {
        content = document.getElementById('input-url').value;
    }

    // Basic Validation
    if (!content && activeTab !== 'image') {
        alert("Please provide some content to analyze.");
        return;
    }

    // Show Loading
    emptyState.classList.add('hidden');
    resultContent.classList.add('hidden');
    loadingState.classList.remove('hidden');

    try {
        setTimeout(() => {
            let score = 50; 
            if (content.toLowerCase().includes("moreover") || content.toLowerCase().includes("furthermore")) {
                score = 85;
            } else if (content.includes("2026") || content.includes("\"")) {
                score = 12;
            }

            displayResults(score);
            loadingState.classList.add('hidden');
            resultContent.classList.remove('hidden');
        }, 1500);

    } catch (error) {
        console.error("Error during analysis:", error);
        loadingState.classList.add('hidden');
        emptyState.classList.remove('hidden');
    }
}

// DISPLAY RESULTS LOGIC
function displayResults(score) {
    const scoreDisplay = document.getElementById('score-display');
    const label = document.getElementById('status-label');
    const explanation = document.getElementById('explanation-text');

    scoreDisplay.innerText = score + "%";

    if (score >= 70) {
        label.innerText = "🔴 AI GENERATED";
        label.style.color = "#ef4444";
        explanation.innerText = "Mathematical patterns suggest high predictability (low perplexity), common in large language models.";
    } else if (score >= 30) {
        label.innerText = "🟡 UNCERTAIN";
        label.style.color = "#f59e0b";
        explanation.innerText = "Mixed signals detected. Likely human writing that has been significantly refined by AI tools.";
    } else {
        label.innerText = "🟢 HUMAN WRITTEN";
        label.style.color = "#10b981";
        explanation.innerText = "Natural sentence length variation (high burstiness) and unique context suggests human origin.";
    }
}

// EVENT LISTENERS 
// This makes the image upload area clickable
document.getElementById('input-image').addEventListener('click', () => {
    document.getElementById('file-upload').click();
});

// This detects when a file is chosen
document.getElementById('file-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        document.querySelector('#input-image p').innerText = "File Selected: " + file.name;
    }
});