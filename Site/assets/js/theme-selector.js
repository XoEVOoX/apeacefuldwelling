document.addEventListener('DOMContentLoaded', () => {
    const themeOptions = document.querySelectorAll('.theme-option');
    const activeName = document.getElementById('active-theme-name');
    
    // Fix active theme visualization
    function updateActiveTheme(theme) {
        themeOptions.forEach(opt => opt.classList.remove('active'));
        const activeOption = document.querySelector(`[data-theme="${theme}"]`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (activeName) {
            activeName.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        }
    }

    // Initialize with saved theme
    const savedTheme = localStorage.getItem('theme') || 'matrix';
    updateActiveTheme(savedTheme);
    
    // Update click handler
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            updateActiveTheme(option.dataset.theme);
        });
    });
});