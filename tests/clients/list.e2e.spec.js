var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { handler } from '../../src/clients/list';
describe('clients > list function', () => {
    test('it should list no clients', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = {};
        const ctx = undefined;
        const callback = undefined;
        const result = yield handler(event, ctx, callback);
        assert(result);
        assert(result.statusCode === 200);
    }));
});
