module.exports = function (context) {
    var Email = require('./email.model'),
        EmailBuilder = require('email-templates'),
        nodemailer = require('nodemailer'),
        //moment = require('moment'),
        config = context.config,

        getPendingEmails = function () {
            return Email.find({ status: { '$in': ['queued', 'error'] }, numberOfRetries: { $lt: config.email.retries } }).exec();
        },

        // listPendingEmails = function (req, res) {
        //     emailDomain.getPendingEmails(function (err, result) {
        //         messageHandler.wrapResponse(res, err, result);
        //     });
        // };

        buildEmail = function (template, templateVars, subjectVars, to, options) {
            var email = new EmailBuilder({ juice: false });

            return Promise.all([
                email.render(template + '/html', templateVars),
                email.render(template + '/subject', subjectVars)
            ])
                .then(function (args) {
                    createEmail(config.email.sender, to, args[1], args[0], options);
                });
        },

        createEmail = function (from, to, subject, body, options) {
            var email = new Email({
                from: from,
                to: to,
                subject: subject,
                body: body,
                bodyType: 'html'
            });

            if (options) {
                if (options.cc) { email.cc = options.cc; }
                if (options.bcc) { email.bcc = options.bcc; }
                if (options.attachments) { email.attachments = options.attachments; }
            }

            email.creationDate = new Date();
            email.status = 'queued';
            email.numberOfRetries = 0;

            return email.save();
        },

        sendEmails = function () {
            return new Promise(async (resolve, reject) => {
                try {
                    var transporter = nodemailer.createTransport({
                        service: config.email.transporterService,
                        auth: {
                            user: config.email.transporterUser,
                            pass: config.email.transporterPassword
                        }
                    });

                    var emails = await getPendingEmails();

                    for (let i = 0; i < emails.length; i++) {
                        var email = emails[i];

                        (async function (emailToProcess) {
                            var mailOptions = {
                                from: config.email.sender,
                                to: emailToProcess.to.join(),
                                cc: emailToProcess.cc.join(),
                                bcc: emailToProcess.bcc.join(),
                                subject: emailToProcess.subject
                            };

                            if (emailToProcess.bodyType === 'html') {
                                mailOptions.html = emailToProcess.body;
                            } else {
                                mailOptions.text = emailToProcess.body;
                            }

                            // (async function (options) {
                            emailToProcess.status = 'sending';

                            var currentEmail = await emailToProcess.save();

                            // send mail with defined transport object
                            transporter.sendMail(mailOptions).then(async () => {
                                currentEmail.status = 'sent';
                                currentEmail.sentDate = new Date();
                                currentEmail.errorDescription = '';

                                await currentEmail.save();
                            }, async (error) => {
                                currentEmail.status = 'error';
                                currentEmail.lastRetryDate = new Date();
                                currentEmail.numberOfRetries += 1;
                                currentEmail.errorDescription = JSON.stringify(error);

                                await currentEmail.save();
                            });
                        }(email));
                    }

                    return resolve('Todos os e-mails foram enviados com sucesso');
                }
                catch (error) {
                    return reject(error);
                }
            });
        };

    return {
        getPendingEmails: getPendingEmails,
        buildEmail: buildEmail,
        sendEmails: sendEmails
    };
};