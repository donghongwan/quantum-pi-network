const { createHash } = require('crypto');

class IdentityUtils {
    generateIdentityId(username, email) {
        const hash = createHash('sha256');
        hash.update(`${username}:${email}:${Date.now()}`);
        return hash.digest('hex');
    }
}

module.exports = new IdentityUtils();
