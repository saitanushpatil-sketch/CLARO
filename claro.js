// Implements the core logic of the system using rule-based analysis.

// Main functionalities:

// Loads sample fake and real crisis messages

// Analyzes text using predefined credibility rules

// Calculates a credibility score

// Highlights risky words and phrases

// Displays explainable reasons for score changes

// Provides user guidance without enforcing censorship

// Acts as the decision-support engine of the application.

function loadFake() {
  document.getElementById("newsInput").value =
    "URGENT!!! Government hiding earthquake data. Share immediately before internet shutdown!!!";
}

function loadReal() {
  document.getElementById("newsInput").value =
    "According to WHO and BBC reports, mild tremors were recorded. No casualties reported. Authorities advised citizens to remain calm.";
}

function verify() {
  const input = document.getElementById("newsInput").value;
  const text = input.toLowerCase();
  const crisis = document.getElementById("crisisType").value;

  const fill = document.getElementById("fill");
  const tag = document.getElementById("tag");
  const note = document.getElementById("note");
  const confidence = document.getElementById("confidence");
  const ruleList = document.getElementById("ruleList");
  const highlightBox = document.getElementById("highlightBox");
  const sound = document.getElementById("alertSound");

  ruleList.innerHTML = "";
  highlightBox.innerHTML = "";
  sound.pause();
  sound.currentTime = 0;

  if (!text) return;

  let score = 50;
  let highlighted = input;

  const panicWords = ["urgent", "share immediately", "breaking", "!!!"];

  panicWords.forEach(word => {
    if (text.includes(word)) {
      score -= 35;
      highlighted = highlighted.replace(
        new RegExp(word, "gi"),
        `<span class="highlight">${word}</span>`
      );
      ruleList.innerHTML += `<li>❌ Panic language detected: "${word}" (-35)</li>`;
    }
  });

  if (text.includes("bbc") || text.includes("who") || text.includes("reuters") || text.includes("government")) {
    score += 35;
    ruleList.innerHTML += `<li>✅ Trusted source detected (+35)</li>`;
  } else {
    ruleList.innerHTML += `<li>❌ No trusted source mentioned</li>`;
  }

  if (text.length < 40) {
    score -= 20;
    ruleList.innerHTML += `<li>❌ Message too short (-20)</li>`;
  } else {
    ruleList.innerHTML += `<li>✅ Sufficient context provided</li>`;
  }

  if (crisis !== "general" && !text.includes(crisis)) {
    score -= 10;
    ruleList.innerHTML += `<li>⚠️ Crisis mismatch (-10)</li>`;
  }

  score = Math.max(0, Math.min(100, score));
  fill.style.width = score + "%";
  confidence.innerText = `Confidence Score: ${score}%`;
  highlightBox.innerHTML = `<strong>🔍 Highlighted Analysis:</strong><br>${highlighted}`;

  if (score <= 35) {
    fill.className = "fill low";
    tag.innerHTML = `<span class="tag low">🚨 LOW CREDIBILITY</span>`;
    note.innerText = "High risk of misinformation. Do NOT share.";
    sound.play();
  } else if (score <= 70) {
    fill.className = "fill medium";
    tag.innerHTML = `<span class="tag medium">⚠️ MEDIUM CREDIBILITY</span>`;
    note.innerText = "Some warning signs. Verify with official sources.";
  } else {
    fill.className = "fill high";
    tag.innerHTML = `<span class="tag high">✅ HIGH CREDIBILITY</span>`;
    note.innerText = "Content appears reliable and well-verified.";
  }
}
