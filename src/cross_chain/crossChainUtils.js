const { createHash } = require('crypto');

class CrossChainUtils {
    generateTransactionId(fromChain, toChain, amount, asset) {
        const hash = createHash('sha256');
        hash.update(`${fromChain}:${toChain}:${amount}:${asset}:${Date.now()}`);
        return hash.digest('hex');
    }
}

module.exports = new CrossChainUtils();
