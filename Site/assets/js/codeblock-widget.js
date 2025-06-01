class CodeBlockWidget {
    constructor(element) {
        this.options = {
            language: element.dataset.language || 'plaintext',
            title: element.dataset.title || 'Code',
            theme: element.dataset.theme || 'matrix',
            showLineNumbers: element.dataset.showLineNumbers !== 'false',
            showCopyButton: element.dataset.showCopyButton !== 'false',
            showExpandButton: element.dataset.showExpandButton !== 'false',
            code: element.querySelector('pre code')?.textContent.trim() || '' // Get code from inner pre>code
        };
        this.element = element;
    }

    render(targetElement) {
        // Clear existing content
        targetElement.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'code-container';
        
        // Build the widget HTML
        container.innerHTML = `
            ${this.options.showFileTabs ? this.createFileTabs() : ''}
            <div class="code-header">
                <div class="terminal-controls">
                    <div class="terminal-dots">
                        <div class="dot close"></div>
                        <div class="dot minimize"></div>
                        <div class="dot maximize"></div>
                    </div>
                    <div class="terminal-title">${this.options.title}</div>
                </div>
                <div class="code-actions">
                    ${this.options.showCopyButton ? '<button class="copy-button">Copy</button>' : ''}
                    ${this.options.showExpandButton ? '<button class="expand-button">⛶</button>' : ''}
                </div>
            </div>
            <pre class="code-block"><code>${this.formatCode(this.options.code)}</code></pre>
            <div class="status-bar">
                <div class="status-left">
                    <div class="status-item">
                        <div class="status-indicator"></div>
                        <span>${this.options.language}</span>
                    </div>
                    <div class="status-item">
                        <span>UTF-8</span>
                    </div>
                </div>
                <div class="status-right">
                    <span>Lines: ${this.countLines()}</span>
                </div>
            </div>
        `;

        // Attach event listeners
        this.attachEventListeners(container);
        
        // Replace the original content instead of appending
        targetElement.replaceChildren(container);
        return container;
    }

    formatCode(code) {
        // Add line numbers and syntax highlighting
        return code.split('\n')
            .map((line, index) => `<span class="code-line">${this.highlightSyntax(line)}</span>`)
            .join('\n');
    }

    highlightSyntax(line) {
        // Basic syntax highlighting - expand this based on language
        return line
            .replace(/(".*?")/g, '<span class="string">$1</span>')
            .replace(/\b(function|return|if|else|while|for|class)\b/g, '<span class="keyword">$1</span>')
            .replace(/(#.*$)|(\/\/.*$)/gm, '<span class="comment">$1$2</span>');
    }

    countLines() {
        return this.options.code.split('\n').length;
    }

    createFileTabs() {
        if (!this.options.fileTabs.length) return '';
        
        const tabs = this.options.fileTabs
            .map((tab, index) => `
                <div class="file-tab ${index === 0 ? 'active' : ''}" data-tab="${tab}">
                    ${tab}
                </div>
            `).join('');

        return `<div class="file-tabs">${tabs}</div>`;
    }

    attachEventListeners(container) {
        // Copy button functionality
        const copyBtn = container.querySelector('.copy-button');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyCode(container));
        }

        // Expand button functionality
        const expandBtn = container.querySelector('.expand-button');
        if (expandBtn) {
            expandBtn.addEventListener('click', () => this.toggleExpand(container));
        }

        // File tabs functionality
        const fileTabs = container.querySelectorAll('.file-tab');
        fileTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    }

    copyCode(container) {
        const code = container.querySelector('.code-block').textContent;
        navigator.clipboard.writeText(code).then(() => {
            const button = container.querySelector('.copy-button');
            button.textContent = 'Copied!';
            button.classList.add('copied');
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('copied');
            }, 2000);
        });
    }

    toggleExpand(container) {
        const isExpanded = container.classList.contains('expanded');
        container.classList.toggle('expanded');
        
        if (!isExpanded) {
            container.style.position = 'fixed';
            container.style.top = '2rem';
            container.style.left = '2rem';
            container.style.width = 'calc(100vw - 4rem)';
            container.style.height = 'calc(100vh - 4rem)';
            container.style.zIndex = '1000';
        } else {
            container.style.position = '';
            container.style.top = '';
            container.style.left = '';
            container.style.width = '';
            container.style.height = '';
            container.style.zIndex = '';
        }
    }

    switchTab(tab) {
        const container = tab.closest('.code-container');
        container.querySelectorAll('.file-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // Here you would typically load different code content
        // This is where you'd implement tab-specific content switching
    }

    // Add new method to insert at cursor position or specific element
    insertAt(targetElement) {
        if (this.container) {
            if (typeof targetElement === 'string') {
                // Insert after element with given ID
                const target = document.getElementById(targetElement);
                if (target) {
                    target.parentNode.insertBefore(this.container, target.nextSibling);
                }
            } else {
                // Insert at specified element
                targetElement.appendChild(this.container);
            }
            this.render(this.container);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all code blocks with data-code-block attribute
    document.querySelectorAll('[data-code-block]').forEach(element => {
        const widget = new CodeBlockWidget(element);
        widget.render(element);
    });
});
