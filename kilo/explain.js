#!/usr/bin/env node

import pkg from 'regexp-tree';
const { parse } = pkg;

function groupConsecutiveChars(expressions) {
    if (!expressions || expressions.length === 0) return [];
    
    const grouped = [];
    let currentGroup = [];
    
    for (const expr of expressions) {
        if (expr.type === 'Char' && expr.kind === 'simple' && !expr.escaped) {
            currentGroup.push(expr.value);
        } else {
            if (currentGroup.length > 0) {
                if (currentGroup.length === 1) {
                    grouped.push(`the character "${currentGroup[0]}"`);
                } else {
                    grouped.push(`"${currentGroup.join('')}"`);
                }
                currentGroup = [];
            }
            grouped.push(explainNode(expr));
        }
    }
    
    // Handle any remaining characters
    if (currentGroup.length > 0) {
        if (currentGroup.length === 1) {
            grouped.push(`the character "${currentGroup[0]}"`);
        } else {
            grouped.push(`"${currentGroup.join('')}"`);
        }
    }
    
    return grouped;
}

function explainNode(node) {
    switch (node.type) {
        case 'Char':
            if (node.kind === 'meta') {
                switch (node.value) {
                    case '\\d': return 'a digit (0–9)';
                    case '\\D': return 'any non-digit';
                    case '\\w': return 'a word character (letter, digit, or underscore)';
                    case '\\W': return 'any non-word character';
                    case '\\s': return 'whitespace';
                    case '\\S': return 'any non-whitespace';
                    case '.': return 'any character';
                    case '\\t': return 'a tab';
                    case '\\n': return 'a newline';
                    case '\\r': return 'a carriage return';
                    case '\\f': return 'a form feed';
                    case '\\v': return 'a vertical tab';
                    case '\\0': return 'a null character';
                    default: return `the character "${node.value}"`;
                }
            } else if (node.kind === 'simple') {
                // Handle escaped characters
                if (node.escaped) {
                    switch (node.value) {
                        case '\\\\': return 'a literal backslash';
                        case '\\.': return 'a literal dot';
                        case '\\+': return 'a literal plus';
                        case '\\*': return 'a literal asterisk';
                        case '\\?': return 'a literal question mark';
                        case '\\^': return 'a literal caret';
                        case '\\$': return 'a literal dollar sign';
                        case '\\|': return 'a literal pipe';
                        case '\\(': return 'a literal opening parenthesis';
                        case '\\)': return 'a literal closing parenthesis';
                        case '\\[': return 'a literal opening bracket';
                        case '\\]': return 'a literal closing bracket';
                        case '\\{': return 'a literal opening brace';
                        case '\\}': return 'a literal closing brace';
                        default: return `the literal character "${node.value}"`;
                    }
                }
                return `the character "${node.value}"`;
            }
            return `the character "${node.value}"`;

        case 'CharacterClass':
            const inside = node.expressions.map(explainNode).join(', ');
            return node.negative
                ? `any character except: ${inside}`
                : `any of: ${inside}`;

        case 'ClassRange':
            return `${node.from.symbol}–${node.to.symbol}`;

        case 'Repetition':
            const { kind, from, to } = node.quantifier;
            let quantifierText = '';
            
            if (kind === '+') {
                quantifierText = 'one or more times';
            } else if (kind === '*') {
                quantifierText = 'zero or more times';
            } else if (kind === '?') {
                quantifierText = 'optionally';
            } else if (kind === 'Range') {
                if (from === to) {
                    quantifierText = `exactly ${from} time${from === 1 ? '' : 's'}`;
                } else if (to === null || to === undefined) {
                    quantifierText = `${from} or more times`;
                } else {
                    quantifierText = `${from}–${to} times`;
                }
            }
            
            const greedy = node.quantifier.greedy !== false ? '' : ' (non-greedy)';
            const baseExplanation = explainNode(node.expression);
            
            // Make the output more natural
            if (quantifierText === 'optionally') {
                return `${baseExplanation} ${quantifierText}${greedy}`;
            } else {
                return `${baseExplanation}, ${quantifierText}${greedy}`;
            }

        case 'Alternative':
            const expressions = groupConsecutiveChars(node.expressions);
            if (expressions.length === 0) return 'nothing';
            if (expressions.length === 1) return expressions[0];
            
            // More natural joining
            if (expressions.length === 2) {
                return `${expressions[0]} then ${expressions[1]}`;
            } else {
                const last = expressions.pop();
                return `${expressions.join(', then ')} then ${last}`;
            }

        case 'Disjunction':
            return `either ${explainNode(node.left)} or ${explainNode(node.right)}`;

        case 'Assertion':
            switch (node.kind) {
                case '^': return 'start of string';
                case '$': return 'end of string';
                case '\\b': return 'word boundary';
                case '\\B': return 'non-word boundary';
                case 'Lookahead':
                    return node.negative
                        ? `not followed by ${explainNode(node.assertion)}`
                        : `followed by ${explainNode(node.assertion)}`;
                case 'Lookbehind':
                    return node.negative
                        ? `not preceded by ${explainNode(node.assertion)}`
                        : `preceded by ${explainNode(node.assertion)}`;
                default:
                    return `assertion (${node.kind})`;
            }

        case 'Group':
            const groupContent = explainNode(node.expression);
            if (node.capturing) {
                const groupNum = node.number ? ` #${node.number}` : '';
                return `capture group${groupNum}: ${groupContent}`;
            } else {
                return `group: ${groupContent}`;
            }

        case 'Backreference':
            return `reference to group #${node.reference}`;

        case 'RegExp':
            return explainNode(node.body);

        default:
            // Handle any unknown node types gracefully
            if (node.raw) {
                return `"${node.raw}"`;
            }
            return '(unknown pattern)';
    }
}

function explainRegex(input) {
    if (!input) {
        throw new Error('No regex pattern provided');
    }

    let pattern = input;
    let flags = '';
    
    // Extract flags if the input is in /pattern/flags format
    if (input.startsWith('/')) {
        const lastSlashIndex = input.lastIndexOf('/');
        if (lastSlashIndex > 0) {
            pattern = input.slice(1, lastSlashIndex);
            flags = input.slice(lastSlashIndex + 1);
        } else {
            // Handle case where there's only one slash at the beginning
            pattern = input.slice(1);
        }
    }

    try {
        // Parse the regex using regexp-tree
        const ast = parse(`/${pattern}/${flags}`);
        let explanation = explainNode(ast);

        // Add flag explanations
        if (flags) {
            const flagDescriptions = [];
            if (flags.includes('i')) flagDescriptions.push('case-insensitive');
            if (flags.includes('g')) flagDescriptions.push('global (find all matches)');
            if (flags.includes('m')) flagDescriptions.push('multiline (^ and $ match line boundaries)');
            if (flags.includes('s')) flagDescriptions.push('dotall (. matches newlines)');
            if (flags.includes('u')) flagDescriptions.push('unicode');
            if (flags.includes('y')) flagDescriptions.push('sticky (matches from lastIndex)');
            
            if (flagDescriptions.length > 0) {
                explanation += `\n\nFlags: ${flagDescriptions.join(', ')}`;
            }
        }

        return explanation;
    } catch (parseError) {
        throw new Error(`Invalid regex pattern: ${parseError.message}`);
    }
}

function main() {
    try {
        const args = process.argv.slice(2);
        
        if (args.length === 0) {
            console.error('Usage: explain.js <regex-pattern>');
            console.error('Example: explain.js "/\\d+/"');
            console.error('Example: explain.js "\\w+@\\w+\\.\\w+"');
            process.exit(1);
        }

        const input = args[0];
        const explanation = explainRegex(input);
        console.log(explanation);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// Run the main function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { explainRegex, explainNode };