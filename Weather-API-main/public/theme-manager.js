/**
 * Enhanced Theme Manager for Weather API
 * Handles multiple themes (light, dark, blue, green, purple, orange, custom)
 * with system preference detection, persistent storage, and customization
 */

class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemPreference();
    this.customColors = this.getStoredCustomColors();
    this.availableThemes = ['light', 'dark', 'blue', 'green', 'purple', 'orange', 'custom'];
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupThemeSelector();
    this.setupCustomizationPanel();
    this.setupToggleButtons();
    this.setupEventListeners();
    this.listenForSystemChanges();
  }

  /**
   * Get system preference for dark mode
   */
  getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Get stored theme from localStorage
   */
  getStoredTheme() {
    try {
      return localStorage.getItem('weather-theme');
    } catch (e) {
      console.warn('localStorage not available, using system preference');
      return null;
    }
  }

  /**
   * Get stored custom colors
   */
  getStoredCustomColors() {
    try {
      const colors = localStorage.getItem('weather-custom-colors');
      return colors ? JSON.parse(colors) : {};
    } catch (e) {
      console.warn('Could not load custom colors');
      return {};
    }
  }

  /**
   * Store theme preference
   */
  setStoredTheme(theme) {
    try {
      localStorage.setItem('weather-theme', theme);
    } catch (e) {
      console.warn('Could not save theme preference');
    }
  }

  /**
   * Store custom colors
   */
  setStoredCustomColors(colors) {
    try {
      localStorage.setItem('weather-custom-colors', JSON.stringify(colors));
    } catch (e) {
      console.warn('Could not save custom colors');
    }
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;

    // Apply custom colors if theme is custom
    if (theme === 'custom') {
      this.applyCustomColors();
    }

    this.updateUI();
    this.setStoredTheme(theme);

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: theme }
    }));
  }

  /**
   * Apply custom colors to CSS variables
   */
  applyCustomColors() {
    const root = document.documentElement.style;
    Object.entries(this.customColors).forEach(([key, value]) => {
      root.setProperty(`--custom-${key}`, value);
    });
  }

  /**
   * Update UI elements
   */
  updateUI() {
    this.updateThemeSelector();
    this.updateToggleButton();
    this.updateCustomizationPanel();
  }

  /**
   * Setup theme selector dropdown
   */
  setupThemeSelector() {
    const selector = document.getElementById('theme-selector');
    if (!selector) return;

    // Populate options
    selector.innerHTML = '';
    this.availableThemes.forEach(theme => {
      const option = document.createElement('option');
      option.value = theme;
      option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
      if (theme === this.currentTheme) option.selected = true;
      selector.appendChild(option);
    });

    selector.addEventListener('change', (e) => {
      this.setTheme(e.target.value);
    });
  }

  /**
   * Setup customization panel
   */
  setupCustomizationPanel() {
    const panel = document.getElementById('customization-panel');
    if (!panel) return;

    // Populate color inputs
    const colorGroups = [
      { key: 'bg-primary', label: 'Background' },
      { key: 'bg-secondary', label: 'Card Background' },
      { key: 'text-primary', label: 'Primary Text' },
      { key: 'text-secondary', label: 'Secondary Text' },
      { key: 'accent-primary', label: 'Primary Accent' },
      { key: 'accent-secondary', label: 'Secondary Accent' },
      { key: 'border-color', label: 'Border Color' }
    ];

    const container = panel.querySelector('.color-groups') || panel;
    container.innerHTML = '';

    colorGroups.forEach(group => {
      const div = document.createElement('div');
      div.className = 'color-group';

      const label = document.createElement('label');
      label.textContent = group.label;

      const input = document.createElement('input');
      input.type = 'color';
      input.dataset.colorKey = group.key;
      input.value = this.customColors[group.key] || this.getDefaultColor(group.key);

      div.appendChild(label);
      div.appendChild(input);
      container.appendChild(div);
    });

    // Setup buttons
    const saveBtn = panel.querySelector('#save-custom-theme');
    const resetBtn = panel.querySelector('#reset-custom-theme');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveCustomColors());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetCustomColors());
    }
  }

  /**
   * Get default color for a key
   */
  getDefaultColor(key) {
    const defaults = {
      'bg-primary': '#f8f9fa',
      'bg-secondary': '#ffffff',
      'text-primary': '#202124',
      'text-secondary': '#5f6368',
      'accent-primary': '#1a73e8',
      'accent-secondary': '#4285f4',
      'border-color': '#dadce0'
    };
    return defaults[key] || '#000000';
  }

  /**
   * Save custom colors
   */
  saveCustomColors() {
    const inputs = document.querySelectorAll('#customization-panel input[type="color"]');
    const newColors = {};

    inputs.forEach(input => {
      newColors[input.dataset.colorKey] = input.value;
    });

    this.customColors = newColors;
    this.setStoredCustomColors(newColors);

    if (this.currentTheme === 'custom') {
      this.applyCustomColors();
    }

    // Show success feedback
    this.showNotification('Custom theme saved!', 'success');
  }

  /**
   * Reset custom colors
   */
  resetCustomColors() {
    this.customColors = {};
    this.setStoredCustomColors({});

    // Reset inputs to defaults
    const inputs = document.querySelectorAll('#customization-panel input[type="color"]');
    inputs.forEach(input => {
      input.value = this.getDefaultColor(input.dataset.colorKey);
    });

    if (this.currentTheme === 'custom') {
      this.applyCustomColors();
    }

    this.showNotification('Custom theme reset!', 'info');
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--bg-secondary);
      color: var(--text-primary);
      padding: 10px 20px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      box-shadow: 0 4px 12px var(--shadow-medium);
      z-index: 10000;
      font-size: 0.9rem;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Toggle between light and dark themes (legacy support)
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  /**
   * Setup existing theme toggle buttons
   */
  setupToggleButtons() {
    const toggleButtons = document.querySelectorAll('#theme-toggle');
    toggleButtons.forEach(button => {
      button.addEventListener('click', () => this.toggleTheme());
      this.updateToggleButton();
    });
  }

  /**
   * Update toggle button appearance
   */
  updateToggleButton() {
    const button = document.getElementById('theme-toggle');
    if (button) {
      const moonIcon = button.querySelector('.moon-icon');
      const sunIcon = button.querySelector('.sun-icon');

      if (moonIcon && sunIcon) {
        button.setAttribute('aria-label', `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} mode`);
      } else {
        button.innerHTML = this.getToggleIcon(this.currentTheme);
      }
      button.setAttribute('aria-label', `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  /**
   * Update theme selector
   */
  updateThemeSelector() {
    const selector = document.getElementById('theme-selector');
    if (selector) {
      selector.value = this.currentTheme;
    }
  }

  /**
   * Update customization panel
   */
  updateCustomizationPanel() {
    const panel = document.getElementById('customization-panel');
    if (panel) {
      const inputs = panel.querySelectorAll('input[type="color"]');
      inputs.forEach(input => {
        input.value = this.customColors[input.dataset.colorKey] || this.getDefaultColor(input.dataset.colorKey);
      });
    }
  }

  /**
   * Get toggle icon based on current theme
   */
  getToggleIcon(theme) {
    return theme === 'dark'
      ? '<i class="fas fa-sun" aria-hidden="true"></i>'
      : '<i class="fas fa-moon" aria-hidden="true"></i>';
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
      }
    });

    // Customization panel toggle
    const customizeBtn = document.getElementById('customize-theme-btn');
    if (customizeBtn) {
      customizeBtn.addEventListener('click', () => {
        const panel = document.getElementById('customization-panel');
        if (panel) {
          panel.classList.toggle('show');
        }
      });
    }
  }

  /**
   * Listen for system theme changes
   */
  listenForSystemChanges() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!this.getStoredTheme()) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(newTheme);
      }
    });
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Set specific theme
   */
  setTheme(theme) {
    if (this.availableThemes.includes(theme)) {
      this.applyTheme(theme);
    }
  }

  /**
   * Get available themes
   */
  getAvailableThemes() {
    return [...this.availableThemes];
  }
}

// Initialize theme manager when DOM is ready
if (typeof window !== 'undefined') {
  let themeManager;
  
  function initThemeManager() {
    themeManager = new ThemeManager();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeManager);
  } else {
    initThemeManager();
  }

  // Export for use in other modules
  window.ThemeManager = ThemeManager;
}