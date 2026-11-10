# Rimshah Malik — portfolio

A static portfolio for two independent student builds: Customer Support Hub and Finance Assistant. All project screenshots show synthetic data. The pages distinguish implemented features, mock tests, observed live smoke checks and unfinished work.

## Pages

- `index.html`: introduction, selected work, about and contact
- `projects/customer-support-hub.html`: support workflow case study and five-step screenshot walkthrough
- `projects/finance-assistant.html`: finance workflow case study and five-step screenshot walkthrough
- `learning-log.html`: dated assisted-build notes
- `assets/`: styles, browser interactions, optimised screenshots and the supplied CV

## Preview

No package installation or build is needed. With Python installed, run:

```text
python -m http.server 8767 --bind 127.0.0.1
```

Then open http://127.0.0.1:8767. The walkthroughs are interactive screenshots, not hosted versions of the Python apps. They do not call OpenAI or send email. The contact links open email/LinkedIn; there is no backend contact form or analytics integration.

## Publish

This repository is prepared for GitHub Pages, using the main branch and root directory. `.nojekyll` keeps the static files unchanged. Updates pushed to the publishing branch update the site.

## Edit

Edit text in the HTML pages. Images live under `assets/images/`. Walkthrough captions are in each project page's `walkthrough-data` JSON. Shared behaviour is in `assets/app.js` and layout in `assets/style.css`.

The CV is the supplied original-layout version. Review it before making changes to education or experience; this site does not invent awards, employers, clients or measured ROI. AI build assistance is disclosed on the site.
