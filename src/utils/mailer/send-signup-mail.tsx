import { sendMail } from "./send-mail";

export const sendSignUpEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const body = `
  <p>Your password is ${password}</p>
  <p>Login link: <a href="${process.env.NEXTAUTH_URL}/signin" target="_blank">Sign In</a></p>
  `;
  const result = await sendMail({
    to: email,
    subject: "DiversyFund - Sign Up",
    body,
  });

  return { success: result.accepted.includes(email) };
};
