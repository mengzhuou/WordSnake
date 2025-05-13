import { render } from '@testing-library/react';
import FuncProps from '../WordSnake/FuncProps';
import {
    getLetterFromPreviousWord,
    getRandomStart,
    updateWordCloud,
    checkWordExist,
    checkMissingWordExist,
    missingWordDef
} from '../WordSnake/FuncProps';

import { addDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
    doc: jest.fn(),
    getDocs: jest.fn(),
    updateDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    limit: jest.fn()
}));

jest.mock('../WordSnake/firebase', () => ({}));

describe('FuncProps components', () => {
    it('renders without crashing', () => {
        render(<FuncProps />);
    });

    describe('getLetterFromPreviousWord', () => {
        it('returns the last letter in lowercase', () => {
          expect(getLetterFromPreviousWord('Apple')).toBe('e');
          expect(getLetterFromPreviousWord('BANANA')).toBe('a');
        });
    });
    
    describe('getRandomStart', () => {
        it('returns a lowercase letter a-z', () => {
          const letter = getRandomStart();
          expect(letter).toMatch(/^[a-z]$/);
        });
    });

    describe('updateWordCloud', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('updates occurrence if word already exists', async () => {
            (getDocs).mockResolvedValue({
                empty: false,
                docs: [{ id: 'abc123', data: () => ({ Occurrence: 3 }) }]
            });

            const mockDocRef = {};
            (doc).mockReturnValue(mockDocRef);

            await updateWordCloud('testword');

            expect(updateDoc).toHaveBeenCalledWith(mockDocRef, { Occurrence: 4 });
        });

        it('adds new word if it does not exist', async () => {
            (getDocs).mockResolvedValue({ empty: true });
            await updateWordCloud('newword');
            expect(addDoc).toHaveBeenCalled();
        });
    });

    describe('checkWordExist', () => {
        beforeEach(() => {
            global.fetch = jest.fn();
        });

        it('returns true if word exists', async () => {
            (fetch).mockResolvedValue({ ok: true });
            const result = await checkWordExist('apple');
            expect(result).toBe(true);
        });

        it('returns false on error', async () => {
            (fetch).mockRejectedValue(new Error('API error'));
            const result = await checkWordExist('invalidword');
            expect(result).toBe(false);
        });
    });

    describe('checkMissingWordExist', () => {
        it('returns true if word is in missing list', async () => {
            expect(await checkMissingWordExist('rizz')).toBe(true);
        });

        it('returns false if word is not in missing list', async () => {
            expect(await checkMissingWordExist('banana')).toBe(false);
        });
    });

    describe('missingWordDef', () => {
        it('returns definition if word is in list', () => {
            expect(missingWordDef('kite')).toContain('a toy');
        });

        it('returns fallback text if word not found', () => {
            expect(missingWordDef('unknown')).toBe('Definition not available');
        });
    });
});
