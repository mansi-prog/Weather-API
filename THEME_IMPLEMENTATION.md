# Enhanced Theme Implementation Guide

## Overview

The Weather API now supports multiple themes (light, dark, blue, green, purple, orange, custom) with comprehensive theming capabilities including user customization.

## Features

### Available Themes
- **Light Theme**: Clean, bright interface with high contrast
- **Dark Theme**: Easy on the eyes with dark backgrounds
- **Blue Theme**: Ocean-inspired colors with calming blue tones
- **Green Theme**: Nature-inspired with fresh green palettes
- **Purple Theme**: Royal purple with elegant color combinations
- **Orange Theme**: Warm sunset colors with energetic feel
- **Custom Theme**: User-defined colors with full customization

### Theme Customization
- **Color Picker Interface**: Visual color selection for key theme elements
- **Persistent Storage**: Custom themes saved in localStorage
- **Real-time Preview**: Instant theme changes as you customize
- **Reset Functionality**: Easy return to default colors

## Technical Implementation

### CSS Variables Structure
```css
:root {
  /* Base theme variables */
  --bg-primary: #f8f9fa;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f3f4;

  --text-primary: #202124;
  --text-secondary: #5f6368;
  --text-muted: #9aa0a6;

  --accent-primary: #1a73e8;
  --accent-secondary: #4285f4;
  --accent-hover: #1557b0;

  --border-color: #dadce0;
  --border-hover: #bdc1c6;

  --shadow-light: rgba(0, 0, 0, 0.1);
  --shadow-medium: rgba(0, 0, 0, 0.15);
  --shadow-heavy: rgba(0, 0, 0, 0.2);

  --error-color: #d93025;
  --success-color: #137333;
  --warning-color: #f29900;

  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

  --transition-speed: 0.3s;
  --transition-easing: ease-in-out;
}
```

### Theme-Specific Variables
Each theme extends the base variables with theme-specific colors:

```css
[data-theme="blue"] {
  --bg-primary: #e3f2fd;
  --accent-primary: #1565c0;
  /* ... other blue theme variables */
}
```

### Custom Theme Implementation
Custom themes use CSS custom properties that can be dynamically set:

```css
[data-theme="custom"] {
  --bg-primary: var(--custom-bg-primary, #f8f9fa);
  --accent-primary: var(--custom-accent-primary, #1a73e8);
  /* ... */
}
```

## JavaScript API

### ThemeManager Class

#### Constructor
```javascript
const themeManager = new ThemeManager();
```

#### Methods

**getCurrentTheme()**
Returns the currently active theme name.
```javascript
const currentTheme = themeManager.getCurrentTheme();
// Returns: "light", "dark", "blue", "green", "purple", "orange", or "custom"
```

**setTheme(themeName)**
Switches to the specified theme.
```javascript
themeManager.setTheme('blue'); // Switches to blue theme
themeManager.setTheme('custom'); // Switches to custom theme
```

**getAvailableThemes()**
Returns array of all available theme names.
```javascript
const themes = themeManager.getAvailableThemes();
// Returns: ["light", "dark", "blue", "green", "purple", "orange", "custom"]
```

**toggleTheme()**
Toggles between light and dark themes (legacy support).
```javascript
themeManager.toggleTheme();
```

#### Events

**themeChanged**
Fired when the theme changes.
```javascript
window.addEventListener('themeChanged', (event) => {
  console.log('Theme changed to:', event.detail.theme);
});
```

## UI Components

### Theme Selector
A dropdown that allows users to choose from available themes.

```html
<div class="theme-selector">
  <i class="fas fa-palette"></i>
  <select id="theme-selector">
    <!-- Options populated by JavaScript -->
  </select>
</div>
```

### Theme Toggle Button
Quick toggle between light and dark themes.

```html
<button class="theme-toggle" id="theme-toggle">
  <span class="toggle-icon moon-icon">🌙</span>
  <span class="toggle-icon sun-icon">☀️</span>
</button>
```

### Customization Panel
Advanced customization interface with color pickers.

```html
<div class="customization-panel" id="customization-panel">
  <h3>Customize Theme</h3>
  <div class="color-groups">
    <!-- Color inputs populated by JavaScript -->
  </div>
  <div class="button-group">
    <button class="save-btn">Save</button>
    <button class="reset-btn">Reset</button>
  </div>
</div>
```

## Storage

### localStorage Keys

**weather-theme**
Stores the currently selected theme name.
```javascript
localStorage.getItem('weather-theme'); // "blue", "custom", etc.
```

**weather-custom-colors**
Stores custom color definitions as JSON string.
```javascript
const customColors = {
  'bg-primary': '#f8f9fa',
  'accent-primary': '#1a73e8',
  // ...
};
localStorage.setItem('weather-custom-colors', JSON.stringify(customColors));
```

## Accessibility

### Keyboard Navigation
- Theme selector: Arrow keys to navigate, Enter/Space to select
- Theme toggle: Enter/Space to toggle
- Customization panel: Tab navigation through color pickers

### Screen Reader Support
- All interactive elements have proper ARIA labels
- Color changes announced through live regions
- Focus management maintained during theme switches

### High Contrast Support
- Respects user's high contrast preferences
- Enhanced border colors in high contrast mode
- Maintained readability across all themes

### Reduced Motion
- Respects `prefers-reduced-motion` setting
- Transitions disabled when user prefers reduced motion

## Performance Considerations

### CSS Optimization
- CSS custom properties for efficient theme switching
- Minimal repaints during theme changes
- Hardware acceleration for smooth transitions

### JavaScript Optimization
- Debounced theme change events
- Efficient localStorage operations
- Minimal DOM manipulation

### Memory Management
- Singleton ThemeManager instance
- Proper cleanup of event listeners
- Efficient color storage

## Browser Support

### Supported Browsers
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 16+

### Fallbacks
- Graceful degradation for older browsers
- CSS custom properties fallbacks
- localStorage availability checks

## Testing

### Theme Switching
- [ ] All themes apply correctly
- [ ] No visual glitches during transitions
- [ ] Custom themes persist across sessions
- [ ] System preference detection works

### Customization
- [ ] Color pickers update theme variables
- [ ] Save/reset functionality works
- [ ] Real-time preview updates
- [ ] Custom colors persist

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen readers announce changes
- [ ] High contrast mode supported
- [ ] Reduced motion respected

### Performance
- [ ] Theme switching is smooth (< 100ms)
- [ ] No memory leaks
- [ ] localStorage operations efficient
- [ ] CSS transitions smooth

## Migration Guide

### From Single Theme to Multi-Theme

1. **Update CSS**: Add new theme data attributes
2. **Update JavaScript**: Use new ThemeManager class
3. **Update HTML**: Add theme selector and customization UI
4. **Test**: Verify all themes work correctly

### Preserving Existing Themes

Existing light/dark themes are preserved and remain the default options. The new themes are additive and don't break existing functionality.

## Future Enhancements

### Planned Features
- Theme export/import functionality
- Theme sharing between users
- Advanced color schemes (monochromatic, complementary)
- Theme scheduling (automatic theme changes based on time)
- Theme transitions and animations

### API Extensions
- Theme validation
- Theme conflict resolution
- Advanced customization options
- Theme marketplace integration

## Troubleshooting

### Common Issues

**Theme not applying**
- Check that CSS is loaded before JavaScript
- Verify theme data attribute is set on documentElement
- Check browser console for errors

**Custom colors not saving**
- Verify localStorage is available
- Check for localStorage quota exceeded
- Ensure colors are valid hex values

**Performance issues**
- Reduce transition duration
- Minimize DOM manipulation
- Use CSS containment where possible

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('theme-debug', 'true');
```

This will log theme changes and performance metrics to the console.

## Contributing

When adding new themes:

1. Add theme variables to `themes.css`
2. Update `availableThemes` array in `ThemeManager`
3. Add theme option to selector
4. Test accessibility and performance
5. Update documentation

## License

This theme system is part of the Weather API project and follows the same license terms.
