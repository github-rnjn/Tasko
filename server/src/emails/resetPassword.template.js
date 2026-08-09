const resetPasswordTemplate = (name, otp) => {
    return `
        <!DOCTYPE html>
        <html>
        <body>
            <h2>Hello ${name},</h2>

            <p>Your password reset code is:</p>

            <h1>${otp}</h1>

            <p>This code expires in 10 minutes.</p>

            <p>
                If you didn't request a password reset,
                you can safely ignore this email.
            </p>
        </body>
        </html>
    `;
};

module.exports = resetPasswordTemplate;