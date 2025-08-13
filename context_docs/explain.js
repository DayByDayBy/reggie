#!/usr/bin/env node
const {parse} = require('regexp-tree');

function explainNode(node) {
    switch (node.type) {
        case 'Character':
            return `"${node.symbol}"`;
        case 'CharacterClass':
            return node.expressions.map(explainNode).join(', ');
        case 'ClassRange':
            return `characters from "${node.from.symbol}" to "${node.to.symbol}"`;
        case 'CharacterClassRange':
            return `characters from "${node.from.symbol}" to "${node.to.symbol}"`;
        case 'Repetition':
            let quant = '';
            if (node.quantifier.kind === '+') quant = 'one or more';
            else if (node.quantifier.kind === '*') quant = 'zero or more';
            else if (node.quantifier.kind === '?') quant = 'zero or one';
            else quant = `${node.quantifier.from} to ${node.quantifier.to} times`;
            return `${quant} of (${explainNode(node.expression)})`;
        case 'Alternative':
            return node.expressions.map(explainNode).join(', then ');
        case 'Disjunction':
            return node.left && node.right
                ? `${explainNode(node.left)} or ${explainNode(node.right)}`
                : '';
        case 'Assertion':
            if (node.kind === '^') return 'start of string';
            if (node.kind === '$') return 'end of string';
            if (node.kind === '\\b') return 'word boundary';
            return `assertion ${node.kind}`;
        case 'Group':
            return `group: (${explainNode(node.expression)})`;
        case 'RegExp':
            return explainNode(node.body);
        default:
            return node.raw || '(unknown)';
    }
}

const input = process.argv[2];
let pattern = input;

// Strip /.../ if present
if (pattern.startsWith('/') && pattern.lastIndexOf('/') > 0) {
    pattern = pattern.slice(1, pattern.lastIndexOf('/'));
}

try {
    const ast = parse(`/${pattern}/`);
    console.log(explainNode(ast));
} catch (e) {
    console.error(`Error parsing regex: ${e.message}`);
    process.exit(1);
}
