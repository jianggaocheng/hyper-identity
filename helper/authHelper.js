const config = require('../config');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

module.exports = {
    encrypt: function (plainText) {
        let encrypted = CryptoJS.AES.encrypt(plainText, config.authKey);
        return encrypted.toString();
    },
    decrypt: function (encryptedText) {
        let decryptedBytes = CryptoJS.AES.decrypt(encryptedText, config.authKey);
        let decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
        return decrypted;
    },
    md5: function(data) {
        var Buffer = require("buffer").Buffer;
        var buf = new Buffer(data);
        var str = buf.toString("binary");
        var crypto = require("crypto");
        return crypto.createHash("md5WithRSAEncryption").update(str).digest("hex");
    },
    // Wrapper for verifyToken
    verifyToken: function(token, modelName, callback) {
        if (!token) {
            return callback({ errCode: 'Token_Empty', errMsg: 'Token为空' });
        }
    
        // verify token
        jwt.verify(token, config.jwtKey, function (err, decoded) {
            if (err) {
                tutu.logger.debug('Verify token failed', JSON.stringify(err));
                return callback({ errCode: 'Token_Verify_Error', errMsg: 'Token验证失败' });
            }

            tutu.models[modelName].get(decoded._id, function (err, user) {
                if (err) {
                    tutu.logger.debug(`Find [${modelName}] error`, JSON.stringify(err));
                    return callback({ errCode: `Token_Get_${modelName}_Failed`, errMsg: 'Token验证失败' });
                }
    
                if (user.encryptToken == module.exports.md5(token)) {
                    return callback({ code: 200, user });
                } else {
                    tutu.logger.debug('Token_Verify_Not_Match', user.encryptToken, module.exports.md5(token));
                    return callback({ errCode: 'Token_Verify_Not_Match', errMsg: 'Token过期' });
                }
            });
        });
    }
};
