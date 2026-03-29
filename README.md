# Advanced Contact Form with LocalStorage Dashboard

A professional-level multi-page responsive website built with pure HTML, CSS, and JavaScript. Features real-time validation, LocalStorage persistence, dark mode, and a complete submissions dashboard.

## Features

### Contact Form (contact.html)
- Real-time inline validation (no alerts)
- Email format validation
- Minimum character requirement (10 chars for message)
- Submit button disabled until all fields are valid
- Loading state during submission
- Success toast notifications
- Auto-save draft while typing
- Draft restoration on page reload
- Duplicate submission prevention
- Input sanitization for XSS prevention

### Submissions Dashboard (submissions.html)
- Display all submissions in responsive card layout
- Search functionality (filter by name/email)
- Sort options (latest, oldest, name A-Z)
- Edit submissions with validation
- Delete submissions with confirmation
- Pagination with "Load More" button
- Real-time data updates
- Cross-tab synchronization
- Empty state handling

### UI/UX Features
- Fully responsive design (mobile + desktop)
- Modern clean UI with Flexbox/Grid
- Dark mode toggle (preference saved in LocalStorage)
- Toast notifications (no alerts)
- Loading spinners
- Smooth animations and transitions
- Accessible form controls
- Semantic HTML structure

## File Structure

```
project/
├── contact.html          # Contact form page
├── submissions.html      # Submissions dashboard page
├── style.css            # All styling (light + dark mode)
├── script.js            # All JavaScript logic
└── README.md            # This file
```

## How to Run Locally

1. Download all files to a folder
2. Open `contact.html` in your web browser
3. No server required - runs entirely in the browser

## Usage Instructions

### Submitting a Contact Form
1. Open `contact.html`
2. Fill in Name, Email, and Message (min 10 characters)
3. Submit button enables when all fields are valid
4. Form auto-saves as you type (draft restored on reload)
5. Success notification appears after submission

### Viewing Submissions
1. Navigate to `submissions.html` via the navbar
2. View all submitted contacts in card format
3. Use search bar to filter by name or email
4. Sort by latest, oldest, or alphabetically
5. Click "Edit" to modify a submission
6. Click "Delete" to remove a submission
7. Click "Load More" to see additional submissions

### Dark Mode
- Click the moon/sun icon in the navbar
- Preference is saved and persists across sessions

## Technical Highlights

- **LocalStorage Management**: Robust data persistence with error handling
- **Real-time Validation**: Instant feedback without page refresh
- **Cross-tab Sync**: Changes reflect across multiple browser tabs
- **Input Sanitization**: XSS prevention through proper escaping
- **Modular Code**: Clean separation of concerns
- **No Dependencies**: Pure vanilla JavaScript
- **Cross-browser Compatible**: Works on all modern browsers

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## LocalStorage Keys Used

- `contacts` - Array of all contact submissions
- `contactDraft` - Auto-saved form draft
- `theme` - Dark/light mode preference

## Code Quality

- Clean, well-commented code
- Semantic HTML5
- CSS custom properties for theming
- Modular JavaScript functions
- Error handling throughout
- No console errors
- Follows best practices

## Perfect for

- Frontend development portfolios
- JavaScript skill demonstration
- Internship applications (TCS Digital, etc.)
- Learning DOM manipulation
- Understanding LocalStorage API

---

Built with ❤️ using pure HTML, CSS, and JavaScript
