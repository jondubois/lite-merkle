const assert = require('assert');
const SimpleLamport = require('../index');
const hash = require('hash.js');

describe('Unit tests', async () => {

  let lamport;

  beforeEach(async () => {
    lamport = new SimpleLamport({
      seedEncoding: 'hex',
      hashEncoding: 'base64'
    });
  });

  describe('Generate keys', async () => {
    it('should return a valid private key and public key pair', async () => {
      let { publicKey, privateKey } = lamport.generateKeys();
      let rawPrivateKey = JSON.parse(privateKey);
      let rawPublicKey = JSON.parse(publicKey);
      assert.equal(rawPrivateKey.length, 2);
      assert.equal(rawPrivateKey[0].length, 256);
      assert.equal(rawPrivateKey[1].length, 256);
      assert.equal(rawPublicKey.length, 2);
      assert.equal(rawPublicKey[0].length, 256);
      assert.equal(rawPublicKey[1].length, 256);
    });
  });

  describe('Generate keys from seed', async () => {
    it('should return a valid private key and public key pair from seed', async () => {
      let seed = lamport.generateSeed();
      let { publicKey, privateKey } = lamport.generateKeysFromSeed(seed, 0);
      // assert.equal(Buffer.byteLength(seed, 'base64'), 32);
      let rawPrivateKey = JSON.parse(privateKey);
      let rawPublicKey = JSON.parse(publicKey);
      assert.equal(rawPrivateKey.length, 2);
      assert.equal(rawPrivateKey[0].length, 256);
      assert.equal(rawPrivateKey[1].length, 256);
      assert.equal(rawPublicKey.length, 2);
      assert.equal(rawPublicKey[0].length, 256);
      assert.equal(rawPublicKey[1].length, 256);
    });
  });

  describe('Sign', async () => {
    let privateKey;
    let publicKey;

    beforeEach(async () => {
      let keyPair = lamport.generateKeys();
      privateKey = keyPair.privateKey;
      publicKey = keyPair.publicKey;
    });

    it('should return signature as a string made up of 256 entries', async () => {
      let signature = lamport.sign('test message', privateKey);
      let rawSignature = JSON.parse(signature);
      assert.equal(rawSignature.length, 256);
    });
  });

  describe('Verify', async () => {
    let privateKey;
    let publicKey;

    beforeEach(async () => {
      let keyPair = lamport.generateKeys();
      privateKey = keyPair.privateKey;
      publicKey = keyPair.publicKey;
    });

    it('should return true if signature is valid', async () => {
      let message = 'hello world';
      let signature = lamport.sign(message, privateKey);
      let verified = lamport.verify(message, signature, publicKey);
      assert.equal(verified, true);
    });

    it('should return false if signature is not valid', async () => {
      let message = 'hello world';
      let signature = lamport.sign(message, privateKey);
      let badSignature = lamport.sign('different message', privateKey);
      let verified = lamport.verify(message, badSignature, publicKey);
      assert.equal(verified, false);
    });
  });
});
