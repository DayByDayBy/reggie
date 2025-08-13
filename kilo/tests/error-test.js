import { expect } from 'chai';
import { explainRegex } from '../explain.js';

describe('Error Handling and Input Validation', () => {

    it('should throw "No regex pattern provided" for null input', () => {
        expect(() => explainRegex(null)).to.throw('No regex pattern provided');
    });

    it('should throw "No regex pattern provided" for empty string input', () => {
        expect(() => explainRegex('')).to.throw('No regex pattern provided');
    });

    it('should throw "No regex pattern provided" for whitespace-only input', () => {
        expect(() => explainRegex('   ')).to.throw('No regex pattern provided');
    });

    it('should throw "Regex pattern too long" for overly long input', () => {
        const longString = '/'.repeat(1001);
        expect(() => explainRegex(longString)).to.throw('Regex pattern too long (max 1000 characters)');
    });

    it('should throw "Invalid regex pattern" for an incomplete pattern', () => {
        // An unclosed group is a common error
        expect(() => explainRegex('/(a|b/')).to.throw(/Invalid regex pattern/);
    });

    it('should throw for an unclosed character class', () => {
        expect(() => explainRegex('/[a-z/')).to.throw(/Invalid regex pattern/);
    });
});