# ✨ Feature: `landmark-has-unique-aria-label` – ESLint Rule for Landmark Accessibility

## 📜 Overview

This feature introduces a new ESLint rule: `jsx-a11y/landmark-has-unique-aria-label`. It enforces that repeated **landmark elements** such as `<nav>`, `<main>`, `<aside>`, `<header>`, and `<footer>` must have **unique accessible labels** via `aria-label` or `aria-labelledby`. This ensures proper screen reader navigation and alignment with WAI-ARIA and WCAG accessibility standards.

---

## 🔧 Implementation

### 📁 File: `lib/rules/landmark-has-unique-aria-label.js`

This rule:

* Tracks landmark tags across a file.
* Checks if they are labeled via `aria-label` or `aria-labelledby`.
* Resolves `aria-labelledby` references when they point to static IDs with readable text.
* Reports duplicates or missing labels if repeated landmarks are detected.

The rule supports:

* Static string values via `aria-label`
* String-literal ID references via `aria-labelledby` (best-effort resolution)
* Graceful fallback for unresolved or missing labels

---

## 🧠 Usage

### 📦 Plugin Setup

```js
// lib/index.js
module.exports = {
  rules: {
    'landmark-has-unique-aria-label': require('./rules/landmark-has-unique-aria-label'),
  },
};
```

### 🛠 ESLint Config

```json
{
  "plugins": ["jsx-a11y"],
  "rules": {
    "jsx-a11y/landmark-has-unique-aria-label": "error"
  }
}
```

---

## ✅ Valid Examples

```jsx
<>
  <nav aria-label="Main navigation" />
  <nav aria-label="Secondary navigation" />
</>
```

```jsx
<>
  <h2 id="main-label">Main</h2>
  <h2 id="sidebar-label">Sidebar</h2>
  <nav aria-labelledby="main-label" />
  <nav aria-labelledby="sidebar-label" />
</>
```

---

## ❌ Invalid Examples

```jsx
<>
  <nav aria-label="Navigation" />
  <nav aria-label="Navigation" />
</>
```

```jsx
<>
  <h2 id="main">Main</h2>
  <nav aria-labelledby="main" />
  <nav aria-labelledby="main" />
</>
```

```jsx
<>
  <nav />
  <nav aria-label="Second nav" />
</>
```

---

## 🧪 Tests

📄 File: `__tests__/landmark-has-unique-aria-label.js`

Includes cases for:

* Valid uses of `aria-label` and `aria-labelledby`
* Duplicate label values
* Missing accessible names when multiple landmarks are present

---

## 🌐 Accessibility References

* [🔗 WAI-ARIA Authoring Practices 1.2 – Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
* [🔗 ARIA 1.2 – ](https://www.w3.org/TR/wai-aria-1.2/#aria-label)[`aria-label`](https://www.w3.org/TR/wai-aria-1.2/#aria-label)
* [🔗 ARIA 1.2 – ](https://www.w3.org/TR/wai-aria-1.2/#aria-labelledby)[`aria-labelledby`](https://www.w3.org/TR/wai-aria-1.2/#aria-labelledby)
* [🔗 WCAG 2.1 SC 2.4.1 – Bypass Blocks](https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html)
* [🔗 WCAG 2.1 SC 4.1.2 – Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)

---

## 🚀 Contribution Instructions

### 1. Fork & Setup

```bash
git clone https://github.com/<your-username>/eslint-plugin-jsx-a11y.git
cd eslint-plugin-jsx-a11y
npm install
git checkout -b feat/landmark-has-unique-aria-label
```

### 2. Add the Rule

* Add to `lib/rules/landmark-has-unique-aria-label.js`
* Register in `lib/index.js`

### 3. Add Documentation

📄 `docs/rules/landmark-has-unique-aria-label.md`

```markdown
# landmark-has-unique-aria-label

Ensure that repeated landmark elements have a unique accessible name via `aria-label` or `aria-labelledby`.

See [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) for best practices.
```

### 4. Add Tests

📄 `__tests__/landmark-has-unique-aria-label.js`
Covers positive and negative test cases using `RuleTester`.

### 5. Run Tests

```bash
npm test
```

### 6. Push & Open a PR

```bash
git push origin feat/landmark-has-unique-aria-label
```

Open your pull request here:
📎 [https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/compare](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/compare)

Include:

* Summary of the rule
* Motivation and accessibility references
* Doc and test file links

---

## 📣 Maintainer Notes

* Rule adheres to ESLint structure and a11y goals
* Adds useful coverage not found in core `jsx-a11y` rules
* Enhances dev confidence for ARIA landmark correctness

---
