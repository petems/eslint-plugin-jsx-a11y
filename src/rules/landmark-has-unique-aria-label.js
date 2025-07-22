/**
 * @fileoverview Enforce that repeated landmark elements have unique accessible labels.
 * @author ESLint Plugin Team
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import {
  getProp,
  getPropValue,
  getLiteralPropValue,
} from 'jsx-ast-utils';

import { generateObjSchema, arraySchema } from '../util/schemas';
import getElementType from '../util/getElementType';

const DEFAULT_LANDMARK_ELEMENTS = [
  'nav',
  'main',
  'aside',
  'header',
  'footer',
];

const schema = generateObjSchema({
  landmarks: arraySchema,
});

const errorMessage = (elementType, issue) => {
  if (issue === 'missing') {
    return `Multiple ${elementType} elements found without unique accessible labels. Each landmark must have a unique aria-label or aria-labelledby attribute.`;
  }
  if (issue === 'duplicate') {
    return `Multiple ${elementType} elements found with identical accessible labels. Each landmark must have a unique accessible label.`;
  }
  return `${elementType} elements require unique accessible labels when multiple instances are present.`;
};

// Helper function to check if aria-label has a valid value
const ariaLabelHasValue = (prop) => {
  const value = getPropValue(prop);
  if (value === undefined) {
    return false;
  }
  if (typeof value === 'string' && value.length === 0) {
    return false;
  }
  return true;
};

// Helper function to get accessible label from aria-label or aria-labelledby
const getAccessibleLabel = (node, context) => {
  // Check for aria-label first
  const ariaLabelProp = getProp(node.attributes, 'aria-label');
  if (ariaLabelProp && ariaLabelHasValue(ariaLabelProp)) {
    const labelValue = getLiteralPropValue(ariaLabelProp);
    if (typeof labelValue === 'string' && labelValue.trim()) {
      return { type: 'aria-label', value: labelValue.trim() };
    }
  }

  // Check for aria-labelledby
  const ariaLabelledbyProp = getProp(node.attributes, 'aria-labelledby');
  if (ariaLabelledbyProp && ariaLabelHasValue(ariaLabelledbyProp)) {
    const labelledbyValue = getLiteralPropValue(ariaLabelledbyProp);
    if (typeof labelledbyValue === 'string' && labelledbyValue.trim()) {
      // For aria-labelledby, we can only validate that it's present and non-empty
      // We cannot reliably resolve the referenced IDs in static analysis
      return { type: 'aria-labelledby', value: labelledbyValue.trim() };
    }
  }

  return null;
};

export default {
  meta: {
    docs: {
      url: 'https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/landmark-has-unique-aria-label.md',
      description: 'Enforce that repeated landmark elements have unique accessible labels.',
    },
    schema: [schema],
  },

  create: (context) => {
    const elementType = getElementType(context);
    const landmarkElements = new Map(); // elementType -> Array of { node, label }

    return {
      'Program:exit': () => {
        // Process all collected landmarks
        for (const [type, elements] of landmarkElements) {
          if (elements.length <= 1) {
            continue; // Only one element of this type, no need to check uniqueness
          }

          const labeledElements = [];
          const unlabeledElements = [];

          // Categorize elements by whether they have labels
          elements.forEach(({ node, label }) => {
            if (label) {
              labeledElements.push({ node, label });
            } else {
              unlabeledElements.push({ node });
            }
          });

          // Report elements without labels when multiple of same type exist
          unlabeledElements.forEach(({ node }) => {
            context.report({
              node,
              message: errorMessage(type, 'missing'),
            });
          });

          // Check for duplicate labels among labeled elements
          const labelCounts = new Map();
          labeledElements.forEach(({ node, label }) => {
            const labelKey = `${label.type}:${label.value}`;
            if (!labelCounts.has(labelKey)) {
              labelCounts.set(labelKey, []);
            }
            labelCounts.get(labelKey).push(node);
          });

          // Report duplicate labels
          for (const [labelKey, nodes] of labelCounts) {
            if (nodes.length > 1) {
              nodes.forEach((node) => {
                context.report({
                  node,
                  message: errorMessage(type, 'duplicate'),
                });
              });
            }
          }
        }
      },

      JSXOpeningElement: (node) => {
        const options = context.options[0] || {};
        const landmarkOptions = options.landmarks || DEFAULT_LANDMARK_ELEMENTS;
        const nodeType = elementType(node);

        // Only check landmark elements
        if (!landmarkOptions.includes(nodeType)) {
          return;
        }

        // Get accessible label for this element
        const accessibleLabel = getAccessibleLabel(node, context);

        // Store this landmark for later analysis
        if (!landmarkElements.has(nodeType)) {
          landmarkElements.set(nodeType, []);
        }
        landmarkElements.get(nodeType).push({
          node,
          label: accessibleLabel,
        });
      },
    };
  },
};