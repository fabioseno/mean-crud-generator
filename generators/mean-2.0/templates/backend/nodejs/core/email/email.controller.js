// module.exports = function (context) {
//     var emailDomain = require('./email.domain')(context),
//         messageHandler = context.utils.messageHandler,

//         // sendEmails = async function (req, res) {
//         //     try {
//         //         var result = await emailDomain.sendEmails();

//         //         messageHandler.wrapResponse(res, null, result);
//         //     }
//         //     catch (error) {
//         //         messageHandler.wrapResponse(res, error);
//         //     }
//         // };

//     return {
//         sendEmails: sendEmails
//     };
// };