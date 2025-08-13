#!/usr/bin/env node

const regexpTree = require('regexp-tree');

function explainNode(node) {
  switch (node.type) {
    case 'RegExp':
      return explainNode(node.body) + explainFlags(node.flags);
    case 'Alternative':
      return node.expressions.map(explainNode).join('');
    case 'Assertion':
      switch (node.kind) {
        case '^': return 'start → ';
        case '$': return ' → end';
        case 'b': return 'word boundary → ';
        case 'B': return 'non-word boundary → ';
        default: return `assertion (${node.kind}) → `;
      }
    case 'Char':
      if (node.kind === 'meta') {
        switch (node.value) {
          case '\d': return 'digit (0-9)';
          case '\D': return 'non-digit';
          case '\w': return 'word character (a-Z, 0-9, _)';
          case '\W': return 'non-word character';
          case '\s': return 'whitespace';
          case '\S': return 'non-whitespace';
          default: return `character (${node.value})`; // Fallback for unknown meta chars
        }
      } else {
        return node.value; // For literal characters
      }
    case 'Quantifier':
      let quantifier = '';
      if (node.greedy === false) {
        quantifier = ' (non-greedy)';
      }
      switch (node.kind) {
        case '?': return ' zero or one time' + quantifier;
        case '*': return ' zero or more times' + quantifier;
        case '+': return ' one or more times' + quantifier;
        case '{': return ` ${node.from} to ${node.to || 'infinity'} times` + quantifier;
        default: return ` quantifier (${node.kind})` + quantifier;
      }
    case 'CharacterClass':
      return `[${node.expressions.map(explainNode).join('')}]`;
    case 'ClassRange':
      return `${explainNode(node.from)}-${explainNode(node.to)}`;
    case 'Group':
      if (node.capturing) {
        return `(group: ${explainNode(node.body)})`;
      }
      return `(?:non-capturing group: ${explainNode(node.body)})`;
    case 'Disjunction':
      return `(${explainNode(node.left)} OR ${explainNode(node.right)})`;
    case 'Repetition':
      return explainNode(node.expression) + explainNode(node.quantifier);
    default:
      return `(unsupported type: ${node.type})`;
  }
}

function explainFlags(flags) {
  if (!flags) return '';
  let explanation = ' with flags: ';
  if (flags.includes('i')) explanation += 'case-insensitive, ';
  if (flags.includes('g')) explanation += 'global, ';
  if (flags.includes('m')) explanation += 'multiline, ';
  if (flags.includes('s')) explanation += 'dotall (dot matches newline), ';
  // Remove trailing comma and space
  return explanation.replace(/, $/, '');
}

function explainRegex(regexString) {
  try {
    const ast = regexpTree.parse(regexString);
    return explainNode(ast);
  } catch (e) {
    return `Error parsing regex: ${e.message}`;
  }
}

const regex = process.argv[2];

if (!regex) {
  console.error('Usage: explain.js <regex>');
  process.exit(1);
}

console.log(explainRegex(regex));