/**
 * @fileoverview Test for landmark-has-unique-aria-label rule
 * @author ESLint Plugin Team
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import RuleTester from '../../__util__/RuleTester';
import rule from '../../../src/rules/landmark-has-unique-aria-label';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();

const missingLabelError = (elementType) => ({
  message: `Multiple ${elementType} elements found without unique accessible labels. Each landmark must have a unique aria-label or aria-labelledby attribute.`,
  type: 'JSXOpeningElement',
});

const duplicateLabelError = (elementType) => ({
  message: `Multiple ${elementType} elements found with identical accessible labels. Each landmark must have a unique accessible label.`,
  type: 'JSXOpeningElement',
});

ruleTester.run('landmark-has-unique-aria-label', rule, {
  valid: [
    // Single landmark elements - no labels needed
    { code: '<nav>Navigation</nav>', parserOptions: { ecmaFeatures: { jsx: true } } },
    { code: '<main>Main content</main>', parserOptions: { ecmaFeatures: { jsx: true } } },
    { code: '<aside>Sidebar</aside>', parserOptions: { ecmaFeatures: { jsx: true } } },
    { code: '<header>Page header</header>', parserOptions: { ecmaFeatures: { jsx: true } } },
    { code: '<footer>Page footer</footer>', parserOptions: { ecmaFeatures: { jsx: true } } },

    // Multiple landmarks with unique aria-label
    {
      code: `
        <div>
          <nav aria-label="Primary navigation">
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>
          <nav aria-label="Breadcrumb navigation">
            <a href="/">Home</a>
            <a href="/category">Category</a>
          </nav>
        </div>
      `,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    // Multiple landmarks with unique aria-labelledby
    {
      code: `
        <div>
          <nav aria-labelledby="primary-nav-heading">
            <h2 id="primary-nav-heading">Primary Navigation</h2>
          </nav>
          <nav aria-labelledby="secondary-nav-heading">
            <h2 id="secondary-nav-heading">Secondary Navigation</h2>
          </nav>
        </div>
      `,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    // Mixed aria-label and aria-labelledby
    {
      code: `
        <div>
          <nav aria-label="Primary navigation">
            <a href="/">Home</a>
          </nav>
          <nav aria-labelledby="breadcrumb-heading">
            <h2 id="breadcrumb-heading">Breadcrumb</h2>
          </nav>
        </div>
      `,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    // Different landmark types
    {
      code: `
        <div>
          <header aria-label="Site header">
            <h1>Site Title</h1>
          </header>
          <main aria-label="Main content">
            <p>Content</p>
          </main>
          <aside aria-label="Sidebar">
            <p>Sidebar content</p>
          </aside>
          <footer aria-label="Site footer">
            <p>Footer content</p>
          </footer>
        </div>
      `,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    // Custom landmark configuration
    {
      code: `
        <div>
          <section aria-label="First section">Content 1</section>
          <section aria-label="Second section">Content 2</section>
        </div>
      `,
      options: [{ landmarks: ['section'] }],
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  ],

  invalid: [
    // Multiple nav elements without labels
    {
      code: `
        <div>
          <nav>
            <a href="/">Home</a>
          </nav>
          <nav>
            <a href="/about">About</a>
          </nav>
        </div>
      `,
      parserOptions: { ecmaFeatures: { jsx: true } },
      errors: [
        missingLabelError('nav'),
        missingLabelError('nav'),
      ],
    },

    // Multiple main elements without labels
    {
      code: `
        <div>
          <main>
            <p>Main content 1</p>
          </main>
          <main>
            <p>Main content 2</p>
          </main>
        </div>
      `,
      parserOptions: { ecmaFeatures: { jsx: true } },
      errors: [
        missingLabelError('main'),
        missingLabelError('main'),
      ],
    },

    // Multiple elements with duplicate aria-label
    {
      code: `
        <div>
          <nav aria-label="Navigation">
            <a href="/">Home</a>
          </nav>
          <nav aria-label="Navigation">
            <a href="/about">About</a>
          </nav>
        </div>
      `,
      parserOptions: { ecmaFeatures: { jsx: true } },
      errors: [
        duplicateLabelError('nav'),
        duplicateLabelError('nav'),
      ],
    },

    // Multiple elements with duplicate aria-labelledby
    {
      code: `
        <div>
          <nav aria-labelledby="nav-heading">
            <a href="/">Home</a>
          </nav>
          <nav aria-labelledby="nav-heading">
            <a href="/about">About</a>
          </nav>
        </div>
      `,
      parserOptions: { ecmaFeatures: { jsx: true } },
      errors: [
        duplicateLabelError('nav'),
        duplicateLabelError('nav'),
      ],
    },

    // Mix of missing labels and duplicates
    {
      code: `
        <div>
          <nav>
            <a href="/">Home</a>
          </nav>
          <nav aria-label="Secondary navigation">
            <a href="/about">About</a>
          </nav>
          <nav aria-label="Secondary navigation">
            <a href="/contact">Contact</a>
          </nav>
          <nav>
            <a href="/help">Help</a>
          </nav>
        </div>
      `,
      parserOptions: { ecmaFeatures: { jsx: true } },
      errors: [
        missingLabelError('nav'),
        duplicateLabelError('nav'),
        duplicateLabelError('nav'),
        missingLabelError('nav'),
      ],
    },

    // Empty aria-label
    {
      code: `
        <div>
          <nav aria-label="">
            <a href="/">Home</a>
          </nav>
          <nav aria-label="">
            <a href="/about">About</a>
          </nav>
        </div>
      `,
      parserOptions: { ecmaFeatures: { jsx: true } },
      errors: [
        missingLabelError('nav'),
        missingLabelError('nav'),
      ],
    },

    // Whitespace-only aria-label
    {
      code: `
        <div>
          <nav aria-label="   ">
            <a href="/">Home</a>
          </nav>
          <nav aria-label="   ">
            <a href="/about">About</a>
          </nav>
        </div>
      `,
      parserOptions: { ecmaFeatures: { jsx: true } },
      errors: [
        missingLabelError('nav'),
        missingLabelError('nav'),
      ],
    },

    // Multiple header elements
    {
      code: `
        <div>
          <header aria-label="Site header">
            <h1>Site Title</h1>
          </header>
          <header aria-label="Site header">
            <h2>Section Title</h2>
          </header>
        </div>
      `,
      parserOptions: { ecmaFeatures: { jsx: true } },
      errors: [
        duplicateLabelError('header'),
        duplicateLabelError('header'),
      ],
    },

    // Custom landmark configuration with errors
    {
      code: `
        <div>
          <section>Content 1</section>
          <section>Content 2</section>
        </div>
      `,
      options: [{ landmarks: ['section'] }],
      parserOptions: { ecmaFeatures: { jsx: true } },
      errors: [
        missingLabelError('section'),
        missingLabelError('section'),
      ],
    },
  ],
});
