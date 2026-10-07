import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStartPayload, buyLink, productStartPayload, bundleBuyLink, PAYLOAD_MAX } from '../src/lib/telegram.js';

const SAFE = /^[A-Za-z0-9_-]+$/;

test('GTA V with all fields', () => {
  assert.equal(buildStartPayload('GTA V', 499, 20, 999), 'GTA-V__499__20__999');
});

test("punctuation collapses to single dashes; commas stripped from numbers", () => {
  assert.equal(buildStartPayload("Assassin's Creed: Valhalla (Deluxe)", '1,299'), 'Assassin-s-Creed-Valhalla-Deluxe__1299');
});

test('name + price only', () => {
  assert.equal(buildStartPayload('Hades', 299), 'Hades__299');
});

test('empty middle field keeps positions', () => {
  assert.equal(buildStartPayload('Hades', 299, '', 499), 'Hades__299____499');
});

test('too long throws', () => {
  assert.throws(() => buildStartPayload('A'.repeat(70), 499), /max 64/);
});

test('decimal price throws', () => {
  assert.throws(() => buildStartPayload('Game', '4.99'), /not a whole number/);
});

test('underscores in names become dashes', () => {
  assert.equal(buildStartPayload('Half_Life 2', 499), 'Half-Life-2__499');
});

test('buyLink uses the bot username and the payload', () => {
  assert.equal(buyLink({ name: 'GTA V', price: 499, discount: 20, listPrice: 999 }), 'https://t.me/outcastgstore_bot?start=GTA-V__499__20__999');
});

test('product helper: tiered game with a discount', () => {
  // 350 / 83 is how the site stores a ₹350 tier price; was = $59.99 list.
  const p = { id: 'rdr2', name: 'Red Dead Redemption 2 PC', now: 350 / 83, was: 59.99 };
  const payload = productStartPayload(p);
  assert.equal(payload, 'Red-Dead-Redemption-2__350__93__4979');
  assert.ok(SAFE.test(payload));
});

test('product helper: no discount when list price is lower than ours', () => {
  const p = { id: 'x', name: 'Cheap Game PC', now: 200 / 83, was: 1.99 };
  assert.equal(productStartPayload(p), 'Cheap-Game__200');
});

test('product helper: long names are shortened to fit, never over 64', () => {
  const p = { id: 'x', name: "The Things We Don't See: 10 Interactive Stories of Horror, Mystery, and the Unknown PC", now: 200 / 83, was: 5.99 };
  const payload = productStartPayload(p);
  assert.ok(payload.length <= PAYLOAD_MAX, payload);
  assert.ok(payload.startsWith('The-Things-We-Don-t-See'));
  assert.ok(payload.includes('__200__'));
});

test('product helper: non-Latin names fall back to the Steam app id', () => {
  const p = { id: 's123456', name: '三国志 PC', now: 300 / 83, was: 29.99 };
  const payload = productStartPayload(p);
  assert.ok(payload.startsWith('Steam-App-123456__300'), payload);
});

test('bundle link carries name and flat price', () => {
  assert.equal(bundleBuyLink({ name: 'Pro Vault', price: 799 }), 'https://t.me/outcastgstore_bot?start=Pro-Vault__799');
});
