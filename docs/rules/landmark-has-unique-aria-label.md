# jsx-a11y/landmark-has-unique-aria-label

<!-- end auto-generated rule header -->

Enforce that repeated landmark elements have unique accessible labels. This rule helps ensure that when multiple landmark elements of the same type (such as `<nav>`, `<main>`, `<aside>`, `<header>`, or `<footer>`) exist on a page, they can be distinguished by assistive technologies.

## Rule Details

When multiple landmark elements of the same type exist in a document, each must have a unique accessible label using either `aria-label` or `aria-labelledby` attributes. This allows screen reader users to understand the purpose and content of each landmark.

This rule checks for:
- Multiple landmark elements of the same type without accessible labels
- Multiple landmark elements with identical accessible labels
- Proper usage of `aria-label` and `aria-labelledby` attributes

### Fail

```jsx
// Multiple nav elements without labels
<div>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
  <nav>
    <a href="/help">Help</a>
    <a href="/contact">Contact</a>
  </nav>
</div>

// Multiple nav elements with duplicate labels
<div>
  <nav aria-label="Navigation">
    <a href="/">Home</a>
  </nav>
  <nav aria-label="Navigation">
    <a href="/secondary">Secondary</a>
  </nav>
</div>

// Multiple main elements without labels
<div>
  <main>
    <p>Main content area 1</p>
  </main>
  <main>
    <p>Main content area 2</p>
  </main>
</div>
```

### Pass

```jsx
// Single landmark elements (no labels required)
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>

// Multiple landmarks with unique aria-label
<div>
  <nav aria-label="Primary navigation">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
  <nav aria-label="Footer navigation">
    <a href="/help">Help</a>
    <a href="/contact">Contact</a>
  </nav>
</div>

// Multiple landmarks with unique aria-labelledby
<div>
  <nav aria-labelledby="primary-nav-heading">
    <h2 id="primary-nav-heading">Primary Navigation</h2>
    <a href="/">Home</a>
  </nav>
  <nav aria-labelledby="footer-nav-heading">
    <h2 id="footer-nav-heading">Footer Links</h2>
    <a href="/help">Help</a>
  </nav>
</div>

// Mixed aria-label and aria-labelledby
<div>
  <nav aria-label="Primary navigation">
    <a href="/">Home</a>
  </nav>
  <nav aria-labelledby="breadcrumb-heading">
    <h2 id="breadcrumb-heading">Breadcrumb</h2>
    <a href="/">Home</a>
    <span> > </span>
    <a href="/category">Category</a>
  </nav>
</div>
```

## When Not To Use It

This rule should not be disabled as it addresses a critical accessibility concern. However, if you have a specific use case where multiple identical landmarks are intentional and properly labeled through other means, you may consider configuring the rule or using eslint-disable comments for specific instances.

## Accessibility guidelines

- [WCAG 2.4.1](https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html)
- [WCAG 1.3.6](https://www.w3.org/WAI/WCAG21/Understanding/identify-purpose.html)

## Rule Options

This rule accepts an options object with the following properties:

### `landmarks`

An array of landmark element names to check. Defaults to `['nav', 'main', 'aside', 'header', 'footer']`.

```json
{
  "jsx-a11y/landmark-has-unique-aria-label": [
    "error",
    {
      "landmarks": ["nav", "main", "aside", "header", "footer", "section"]
    }
  ]
}
```

## Resources

- [WAI-ARIA Authoring Practices 1.1 - Landmarks](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
- [WebAIM - Semantic Structure](https://webaim.org/techniques/semanticstructure/)
- [ARIA Landmarks Example](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html)