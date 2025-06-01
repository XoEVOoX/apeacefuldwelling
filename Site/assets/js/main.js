document.addEventListener('DOMContentLoaded', function() {
  // Initialize clock
  function updateClock() {
    const now = new Date();
    document.getElementById('clock-time').textContent = now.toLocaleTimeString();
    document.getElementById('clock-date').textContent = now.toLocaleDateString();
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const leftSidebar = document.querySelector('.left-sidebar');
  
  if (mobileMenuToggle && leftSidebar) {
    mobileMenuToggle.addEventListener('click', function() {
      leftSidebar.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }

  // Theme selector functionality
  const themeOptions = document.querySelectorAll('.theme-option');
  
  themeOptions.forEach(option => {
    option.addEventListener('click', function() {
      const theme = this.dataset.theme;
      document.documentElement.setAttribute('data-theme', theme);
      document.getElementById('active-theme-name').textContent = this.querySelector('.theme-label').textContent;
      
      themeOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// Starfield initialization (compatible with your starfield.js)
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const stars = [];
  const starCount = Math.floor(window.innerWidth * window.innerHeight / 1000);
  
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      vx: Math.floor(Math.random() * 50) - 25,
      vy: Math.floor(Math.random() * 50) - 25
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      
      star.x += star.vx / 100;
      star.y += star.vy / 100;
      
      if (star.x < 0 || star.x > canvas.width) star.vx = -star.vx;
      if (star.y < 0 || star.y > canvas.height) star.vy = -star.vy;
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Initialize starfield when DOM is loaded
document.addEventListener('DOMContentLoaded', initStarfield);

// Update the attack types array with varying severity levels
const attackTypes = [
    { type: "Port Scan", critical: false, threatValue: 3 },
    { type: "SQL Injection", critical: true, threatValue: 8 },
    { type: "Brute Force", critical: true, threatValue: 8 },
    { type: "XSS Attempt", critical: true, threatValue: 8 },
    { type: "DDoS Attack", critical: true, threatValue: 12 },
    { type: "File Inclusion", critical: false, threatValue: 3 },
    { type: "Command Injection", critical: true, threatValue: 8 },
    { type: "Directory Traversal", critical: false, threatValue: 3 },
    { type: "Critical Infrastructure Breach", critical: true, threatValue: 25 } // The "jackpot" attack
];

// Add these assessment messages at the top with attackTypes
const assessmentMessages = [
    "Running neural pattern analysis...",
    "Scanning quantum signatures...",
    "Analyzing biometric data...",
    "Checking security clearance...",
    "Verifying user credentials...",
    "Processing temporal anomalies...",
    "Calculating threat vectors..."
];

// Replace the existing IDS code with this updated version
function initIDS() {
    const attackLog = document.querySelector('.log-container');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const progressBar = document.querySelector('.progress');
    const threatCount = document.getElementById('threatCount');
    
    if (!attackLog || !analyzeBtn || !progressBar || !threatCount) return;

    let currentThreatLevel = 0;

    function generateIP() {
        return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
    }

    function addLogEntry(entry) {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry${entry.critical ? ' critical' : ''}`;
        
        // Get EST timestamp
        const timestamp = new Date().toLocaleTimeString('en-US', {
            timeZone: 'America/New_York',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // Create timestamp span with click handler
        const timestampSpan = document.createElement('span');
        timestampSpan.className = 'timestamp';
        timestampSpan.innerHTML = '[🕐]';
        timestampSpan.dataset.time = timestamp;  // Store timestamp in data attribute
        
        timestampSpan.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = `[${this.dataset.time}]`;
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 3000);
        });

        // Create rest of the entry content
        const ipSpan = document.createElement('span');
        ipSpan.className = 'ip-address';
        ipSpan.textContent = entry.ip;

        const typeSpan = document.createElement('span');
        typeSpan.className = 'attack-type';
        typeSpan.textContent = `${entry.type}:`;

        const targetSpan = document.createElement('span');
        targetSpan.className = 'attack-target';
        targetSpan.textContent = entry.target;

        // Append all elements
        logEntry.appendChild(timestampSpan);
        logEntry.appendChild(ipSpan);
        logEntry.appendChild(typeSpan);
        logEntry.appendChild(targetSpan);

        attackLog.appendChild(logEntry);
        
        // Keep only last 15 entries
        while (attackLog.childNodes.length > 15) {
            attackLog.removeChild(attackLog.firstChild);
        }

        // Smooth scroll to bottom
        attackLog.scrollTo({
            top: attackLog.scrollHeight,
            behavior: 'smooth'
        });
    }

    function updateThreatLevel() {
        // Cap threat level between 0-100
        currentThreatLevel = Math.max(0, Math.min(100, currentThreatLevel));
        
        // Update the display
        progressBar.style.width = `${currentThreatLevel}%`;
        threatCount.textContent = `[${Math.round(currentThreatLevel)}]`;

        // Update critical state
        if (currentThreatLevel > 70) {
            progressBar.classList.add('critical');
        } else {
            progressBar.classList.remove('critical');
        }
    }

    // Add analyze button click handler
    // Add a flag to track if assessment is in progress
    let isAssessing = false;

    analyzeBtn.addEventListener('click', () => {
        // Prevent multiple simultaneous assessments
        if (isAssessing) {
            addLogEntry({
                ip: "127.0.0.1",
                type: "ERROR",
                critical: true,
                target: "Assessment already in progress. Please wait..."
            });
            return;
        }

        isAssessing = true;
        analyzeBtn.disabled = true;
        let messageIndex = 0;

        // Initial delay before starting
        setTimeout(() => {
            const messageInterval = setInterval(() => {
                if (messageIndex < assessmentMessages.length) {
                    addLogEntry({
                        ip: "127.0.0.1",
                        type: "SCAN",
                        critical: false,
                        target: assessmentMessages[messageIndex]
                    });
                    messageIndex++;
                } else {
                    clearInterval(messageInterval);
                    
                    // Add longer delay for "processing" feel
                    setTimeout(() => {
                        addLogEntry({
                            ip: "127.0.0.1",
                            type: "SYSTEM",
                            critical: false,
                            target: "Compiling threat analysis data..."
                        });

                        // Final assessment with dramatic pause
                        setTimeout(() => {
                            const assessmentResult = currentThreatLevel > 70 
                                ? "ALERT: Critical system compromise detected!"
                                : currentThreatLevel > 40
                                    ? "WARNING: Elevated threat patterns identified."
                                    : "Status: System integrity confirmed.";
                            
                            addLogEntry({
                                ip: "127.0.0.1",
                                type: "SYSTEM",
                                critical: currentThreatLevel > 70,
                                target: assessmentResult
                            });
                            
                            // Reduce threat level after analysis
                            currentThreatLevel = Math.max(0, currentThreatLevel - 15); // Reduced from 30
                            updateThreatLevel();

                            // Reset assessment state
                            isAssessing = false;
                            analyzeBtn.disabled = false;
                        }, 4000); // Increased to 4 seconds before final result
                    }, 3000); // Increased to 3 seconds for "compiling" message
                }
            }, 2000); // Increased to 2 seconds between scan messages
        }, 1000); // Increased to 1 second initial delay
    });

    // Replace the existing decay interval with this:
    function startDecayInterval() {
        const minDelay = 500;  // 0.5 seconds
        const maxDelay = 1000; // 1 second
        
        function decay() {
            if (currentThreatLevel > 0) {
                currentThreatLevel = Math.max(0, currentThreatLevel - 1);
                updateThreatLevel();
            }
            
            // Schedule next decay with random delay
            setTimeout(decay, Math.random() * (maxDelay - minDelay) + minDelay);
        }
        
        // Start the first decay
        decay();
    }

    // Replace the old decay interval with the new function call
    startDecayInterval();

    // Update the attack interval section
    const updateInterval = setInterval(() => {
        const attack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
        const entry = {
            ip: generateIP(),
            type: attack.type,
            critical: attack.critical,
            target: `/api/${Math.random().toString(36).substring(7)}`
        };

        addLogEntry(entry);

        // Use the new threatValue property
        currentThreatLevel += attack.threatValue;
        updateThreatLevel();
    }, 3000 + Math.random() * 2000);

    // Update cleanup to use a flag to stop the decay
    let isRunning = true;
    window.addEventListener('unload', () => {
        isRunning = false;
        clearInterval(updateInterval);
    });

    // Initial state
    updateThreatLevel();
}

// Make sure to call initIDS when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initIDS();
    initStarfield();
});